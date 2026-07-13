"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <h2 className="text-xl font-bold text-chocolate">Что-то пошло не так</h2>
      <pre className="mt-4 overflow-auto rounded-xl bg-cream-dark p-4 text-left text-sm text-red-700">
        {error.message}
        {error.digest ? `\n\ndigest: ${error.digest}` : ""}
      </pre>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-rose px-6 py-2.5 font-medium text-white hover:bg-rose-dark"
      >
        Попробовать снова
      </button>
    </div>
  );
}
