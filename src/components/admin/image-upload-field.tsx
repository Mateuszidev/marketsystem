"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/errors";

type ImageUploadFieldProps = {
  onUploaded: (url: string) => void;
};

type UploadResponse = {
  data?: {
    url?: string;
  };
  url?: string;
};

export function ImageUploadField({ onUploaded }: ImageUploadFieldProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadImage = async () => {
    if (!file) {
      setError("Selecione uma imagem para enviar.");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setError(await getErrorMessage(response));
        return;
      }

      const payload = (await response.json()) as UploadResponse;
      const url = payload.data?.url || payload.url;

      if (!url) {
        setError("Upload concluido, mas a URL nao foi retornada.");
        return;
      }

      onUploaded(url);
      setFile(null);
    } catch {
      setError("Nao foi possivel enviar a imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-3 rounded-xl border border-black/10 bg-stone-50 p-3">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(event) => {
            setError("");
            setFile(event.target.files?.[0] || null);
          }}
        />
        <Button type="button" variant="secondary" onClick={uploadImage} disabled={isUploading}>
          {isUploading ? "Enviando..." : "Enviar imagem"}
        </Button>
      </div>
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
