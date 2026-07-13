"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface DecorPhotoUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/heic,image/heif";
const MAX_SIZE_MB = 10;

export function DecorPhotoUpload({ file, onChange }: DecorPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function validateAndSet(selected: File | null) {
    setError("");
    if (!selected) {
      onChange(null);
      return;
    }
    if (!selected.type.startsWith("image/")) {
      setError("Выберите изображение (JPG, PNG, WEBP)");
      return;
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Файл слишком большой. Максимум ${MAX_SIZE_MB} МБ`);
      return;
    }
    onChange(selected);
  }

  function handleFiles(files: FileList | null) {
    validateAndSet(files?.[0] ?? null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  if (previewUrl && file) {
    return (
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl border-2 border-rose bg-rose/5">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={previewUrl}
              alt="Ваш пример декора"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-rose/20 bg-white/80 px-4 py-3">
            <p className="truncate text-sm text-chocolate">{file.name}</p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full bg-cream-dark px-3 py-1.5 text-xs font-medium text-chocolate hover:bg-cream"
              >
                Заменить
              </button>
              <button
                type="button"
                onClick={() => {
                  validateAndSet(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition ${
          dragOver
            ? "border-rose bg-rose/10"
            : "border-cream-dark bg-cream/50 hover:border-rose/60 hover:bg-rose/5"
        }`}
      >
        <span className="text-4xl" aria-hidden>
          📷
        </span>
        <span className="mt-3 text-base font-semibold text-chocolate">
          Загрузить фото-пример
        </span>
        <span className="mt-1 text-sm text-chocolate-light">
          Нажмите или перетащите сюда картинку
        </span>
        <span className="mt-3 rounded-full bg-berry px-5 py-2 text-sm font-semibold text-white shadow-soft">
          Выбрать фото
        </span>
        <span className="mt-2 text-xs text-chocolate-light">
          JPG, PNG, WEBP — до {MAX_SIZE_MB} МБ
        </span>
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
