"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type PdfPreviewProps = {
  fileUrl: string;
  zoom: number;
};

export default function PdfPreview({ fileUrl, zoom }: PdfPreviewProps) {
  const [pageCount, setPageCount] = useState(0);

  return (
    <Document
      key={fileUrl}
      file={fileUrl}
      onLoadSuccess={({ numPages }) => setPageCount(numPages)}
      onLoadError={(error) => {
        console.error("Failed to load PDF preview:", error);
        setPageCount(0);
      }}
      loading={
        <div className="p-8 text-center text-sm text-gray-600">
          Loading preview...
        </div>
      }
      error={
        <div className="p-8 text-center text-sm text-red-700">
          The PDF preview could not be displayed. You can still download the
          generated file.
        </div>
      }
      className="flex min-w-max flex-col items-center gap-5 p-6"
    >
      {Array.from({ length: pageCount }, (_, index) => (
        <Page
          key={index + 1}
          pageNumber={index + 1}
          scale={zoom}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={null}
          className="overflow-hidden rounded-[3px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
        />
      ))}
    </Document>
  );
}
