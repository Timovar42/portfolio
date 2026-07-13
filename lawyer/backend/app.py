import os
import sqlite3
import smtplib
from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "backend" / "leads.db"

AREA_LABELS = {
    "civil": "Гражданское право",
    "family": "Семейное право",
    "corporate": "Корпоративное право",
    "notary": "Нотариальные услуги",
    "inheritance": "Наследство",
    "labor": "Трудовые споры",
    "other": "Другое",
}

app = Flask(__name__, static_folder=str(BASE_DIR), static_url_path="")


def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                area TEXT NOT NULL,
                message TEXT,
                created_at TEXT NOT NULL
            )
            """
        )


def save_lead(name, phone, area, message):
    created_at = datetime.now(timezone.utc).isoformat()
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            "INSERT INTO leads (name, phone, area, message, created_at) VALUES (?, ?, ?, ?, ?)",
            (name, phone, area, message or None, created_at),
        )


def send_email_notification(name, phone, area, message):
    smtp_host = os.environ.get("SMTP_HOST")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER")
    smtp_pass = os.environ.get("SMTP_PASS")
    notify_to = os.environ.get("NOTIFY_EMAIL")

    if not all([smtp_host, smtp_user, smtp_pass, notify_to]):
        return False

    area_label = AREA_LABELS.get(area, area)
    body = (
        f"Новая заявка с сайта\n\n"
        f"Имя: {name}\n"
        f"Контакт: {phone}\n"
        f"Область права: {area_label}\n"
        f"Описание: {message or '—'}\n"
        f"Время: {datetime.now().strftime('%d.%m.%Y %H:%M')}\n"
    )

    msg = MIMEMultipart()
    msg["From"] = smtp_user
    msg["To"] = notify_to
    msg["Subject"] = f"Заявка с сайта — {name}"
    msg.attach(MIMEText(body, "plain", "utf-8"))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)

    return True


@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/css/<path:filename>")
def css(filename):
    return send_from_directory(BASE_DIR / "css", filename)


@app.route("/js/<path:filename>")
def js(filename):
    return send_from_directory(BASE_DIR / "js", filename)


@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    phone = (data.get("phone") or "").strip()
    area = (data.get("area") or "").strip()
    message = (data.get("message") or "").strip()

    if len(name) < 2:
        return jsonify({"error": "Имя обязательно"}), 400
    if len(phone) < 5:
        return jsonify({"error": "Контакт обязателен"}), 400
    if area not in AREA_LABELS:
        return jsonify({"error": "Выберите область права"}), 400

    save_lead(name, phone, area, message)

    try:
        send_email_notification(name, phone, area, message)
    except Exception:
        pass

    return jsonify({"ok": True})


if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")
