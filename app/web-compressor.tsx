"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Download, FileImage, LoaderCircle, Lock, Trash2, Upload } from "lucide-react";
import type { ProductPage } from "./product-config";
import { compressToLimit, formatBytes, resizeImage } from "./web-compression";

type Result = {
  id: string;
  file: File;
  previewUrl: string;
  status: "working" | "done" | "error";
  outputUrl?: string;
  outputBlob?: Blob;
  outputBytes?: number;
  width?: number;
  height?: number;
  reachedTarget?: boolean;
  error?: string;
};

function outputName(file: File, blob: Blob) {
  const base = file.name.replace(/\.[^.]+$/, "");
  const extension = blob.type === "image/jpeg" ? "jpg" : blob.type.split("/")[1] || "png";
  return `${base}-compressed.${extension}`;
}

export function WebCompressor({ page }: { page: ProductPage }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<Result[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [dragging, setDragging] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  useEffect(() => () => {
    resultsRef.current.forEach((result) => {
      URL.revokeObjectURL(result.previewUrl);
      if (result.outputUrl) URL.revokeObjectURL(result.outputUrl);
    });
  }, []);

  async function addFiles(files: File[]) {
    const accepted = files.filter((file) => file.type.startsWith("image/") && (!page.gifOnly || file.type === "image/gif"));
    if (!accepted.length) return;
    const pending = accepted.map<Result>((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: "working",
    }));
    setResults((current) => [...pending, ...current]);

    await Promise.all(pending.map(async (item) => {
      try {
        const output = page.resizer ? await resizeImage(item.file, dimensions.width, dimensions.height) : await compressToLimit(item.file, page.targetKb);
        const outputUrl = URL.createObjectURL(output.blob);
        setResults((current) => current.map((result) => result.id === item.id ? {
          ...result,
          status: "done",
          outputBlob: output.blob,
          outputUrl,
          outputBytes: output.blob.size,
          width: output.width,
          height: output.height,
          reachedTarget: output.reachedTarget,
        } : result));
      } catch (error) {
        setResults((current) => current.map((result) => result.id === item.id ? {
          ...result,
          status: "error",
          error: error instanceof Error ? error.message : "Compression failed.",
        } : result));
      }
    }));
  }

  function onSelect(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    void addFiles(files);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void addFiles(Array.from(event.dataTransfer.files));
  }

  function remove(id: string) {
    setResults((current) => {
      const result = current.find((item) => item.id === id);
      if (result) {
        URL.revokeObjectURL(result.previewUrl);
        if (result.outputUrl) URL.revokeObjectURL(result.outputUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  }

  function download(result: Result) {
    if (!result.outputBlob || !result.outputUrl) return;
    const anchor = document.createElement("a");
    anchor.href = result.outputUrl;
    anchor.download = outputName(result.file, result.outputBlob);
    anchor.click();
  }

  const accept = page.gifOnly ? "image/gif,.gif" : "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif";

  return (
    <section className="compressor" aria-labelledby="compressor-title">
      <header className="compressor-header">
        <div>
          <span className="section-label">LOCAL COMPRESSOR</span>
          <h2 id="compressor-title">{page.resizer ? "Set output dimensions" : `Target: ${page.gifOnly ? "custom GIF" : `${page.targetKb}KB or less`}`}</h2>
        </div>
        <span className="local-status"><Lock size={14} aria-hidden="true" /> No upload</span>
      </header>

      <div
        className={`dropzone ${dragging ? "is-dragging" : ""}`}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }}
        onDrop={onDrop}
      >
        <input ref={inputRef} type="file" accept={accept} multiple onChange={onSelect} className="sr-only" />
        <div className="drop-icon"><Upload size={24} aria-hidden="true" /></div>
        <div className="drop-copy">
          <strong>{dragging ? "Drop to start" : page.gifOnly ? "Drop animated GIFs here" : "Drop images here"}</strong>
          <span>{page.gifOnly ? "GIF files" : "JPG, PNG, WebP or GIF"} · Processed in this browser</span>
        </div>
        <button type="button" className="primary-button" onClick={() => inputRef.current?.click()}>
          <FileImage size={16} aria-hidden="true" /> Choose images
        </button>
      </div>
      {page.resizer && <div className="resize-settings"><label>Width <input type="number" min="1" value={dimensions.width} onChange={(event) => setDimensions({ ...dimensions, width: Number(event.target.value) || 1 })} /></label><span>×</span><label>Height <input type="number" min="1" value={dimensions.height} onChange={(event) => setDimensions({ ...dimensions, height: Number(event.target.value) || 1 })} /></label></div>}

      {page.gifOnly && (
        <label className="gif-target">
          <span>Maximum GIF size</span>
          <strong>{page.targetKb}KB</strong>
        </label>
      )}

      <div className="result-list" aria-live="polite" aria-busy={results.some((result) => result.status === "working")}>
        {results.map((result) => {
          const saved = result.outputBytes ? Math.round((1 - result.outputBytes / result.file.size) * 100) : 0;
          return (
            <article className="result-row" key={result.id}>
              {/* Blob URLs are local previews and do not pass through an image service. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.outputUrl || result.previewUrl} alt={`Preview of ${result.file.name}`} />
              <div className="result-name">
                <strong title={result.file.name}>{result.file.name}</strong>
                <span>{formatBytes(result.file.size)}{result.width ? ` · ${result.width} × ${result.height}` : ""}</span>
              </div>
              <div className="result-size">
                {result.status === "working" && <><LoaderCircle className="spin" size={16} /> <span>Compressing locally</span></>}
                {result.status === "error" && <><AlertCircle size={16} /> <span>{result.error}</span></>}
                {result.status === "done" && <>
                  {result.reachedTarget ? <Check size={16} /> : <AlertCircle size={16} />}
                  <strong>{formatBytes(result.outputBytes || 0)}</strong>
                  <span>{saved > 0 ? `Saved ${saved}% · ${result.reachedTarget ? `Under ${page.targetKb}KB` : "Closest result"}` : "Original kept"}</span>
                </>}
              </div>
              <div className="result-actions">
                <button type="button" className="icon-button" title="Remove image" aria-label={`Remove ${result.file.name}`} onClick={() => remove(result.id)}><Trash2 size={16} /></button>
                <button type="button" className="download-button" disabled={!result.outputBlob} onClick={() => download(result)}><Download size={16} /> Download</button>
              </div>
              {result.status === "done" && !result.reachedTarget && <p className="target-warning">Closest result generated. This image could not reach {page.targetKb}KB within the local quality limits.</p>}
            </article>
          );
        })}
      </div>

      {!results.length && <p className="empty-note"><Lock size={14} aria-hidden="true" /> Files stay in this tab and are cleared when you close it.</p>}
    </section>
  );
}
