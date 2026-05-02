"use client";
import { useState } from "react";
import useSWR from "swr";
import { Folder, File, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function FileBrowser() {
  const [currentPath, setCurrentPath] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { data: dir } = useSWR(`/api/workspace?path=${encodeURIComponent(currentPath)}`, fetcher);
  const { data: file } = useSWR(selectedFile ? `/api/workspace?path=${encodeURIComponent(selectedFile)}` : null, fetcher);

  return (
    <div className="grid grid-cols-2 gap-4 h-[calc(100vh-160px)]">
      <div className="border rounded-lg overflow-hidden">
        <div className="p-2 border-b bg-muted text-xs font-mono">/{currentPath}</div>
        <ScrollArea className="h-full">
          {currentPath && (
            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent"
              onClick={() => setCurrentPath(currentPath.split("/").slice(0, -1).join("/"))}>
              <ChevronRight size={14} className="rotate-180" /> ..
            </button>
          )}
          {(dir?.entries ?? []).map((entry: any) => (
            <button key={entry.name} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent"
              onClick={() => {
                const p = currentPath ? `${currentPath}/${entry.name}` : entry.name;
                if (entry.isDir) { setCurrentPath(p); setSelectedFile(null); } else setSelectedFile(p);
              }}>
              {entry.isDir ? <Folder size={14} /> : <File size={14} />}
              {entry.name}
            </button>
          ))}
        </ScrollArea>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="p-2 border-b bg-muted text-xs font-mono">{selectedFile ?? "Selecciona un archivo"}</div>
        <ScrollArea className="h-full">
          {file?.content
            ? <pre className="p-4 text-xs font-mono whitespace-pre-wrap">{file.content}</pre>
            : <p className="p-4 text-sm text-muted-foreground">Selecciona un archivo.</p>}
        </ScrollArea>
      </div>
    </div>
  );
}
