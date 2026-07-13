# Сайт-визитка юриста / нотариуса

Одностраничный сайт для частной юридической практики. Цель — конвертировать посетителя в заявку на консультацию.

## Стек

- HTML + CSS + vanilla JS (без фреймворков)
- Python + Flask (форма, SQLite, email-уведомления)

## Быстрый старт

```bash
# Установка зависимостей
pip install -r requirements.txt

# Настройка email (опционально)
cp .env.example .env
# Отредактируйте .env

# Запуск
cd backend
python app.py
```

Сайт: http://localhost:5000

## Замена демо-контента

В `index.html` замените:

- ФИО, фото (положите файл в `assets/photo.jpg` и обновите блок `.about__photo`)
- Телефон, email, Telegram, адрес
- Статистику в hero (годы, дела, процент)
- Тексты услуг, биографию, отзывы
- Embed карты Google Maps / 2ГИС

## Заявки

Заявки сохраняются в `backend/leads.db`. Просмотр:

```bash
sqlite3 backend/leads.db "SELECT * FROM leads ORDER BY id DESC LIMIT 10;"
```

## Деплой

- **VPS (Timeweb/Beget)**: gunicorn + nginx, переменные окружения из `.env`
- **Без бэкенда**: статика на Netlify, форма через Formspree/Getform (потребует правки `js/main.js`)
