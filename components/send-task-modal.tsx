"use client";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function SendTaskModal({ taskId, taskTitle }: { taskId: string; taskTitle: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { data } = useSWR(open ? "/api/sessions" : null, fetcher);
  const sessions: { id: string; channel?: string; label?: string }[] = data?.live ?? [];

  async function send(sessionKey: string) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/tasks/${taskId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionKey }),
      });
      setResult(res.ok ? "✓ Enviado" : "Error al enviar");
    } catch {
      setResult("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        className="mt-1 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(true)}
      >
        <Send size={11} /> Enviar al agente
      </button>
    );
  }

  return (
    <div className="mt-2 border rounded-md p-2 bg-background space-y-2">
      <p className="text-xs font-medium truncate">"{taskTitle}"</p>
      {sessions.length === 0 && !data && <p className="text-xs text-muted-foreground">Cargando sesiones...</p>}
      {sessions.length === 0 && data && <p className="text-xs text-muted-foreground">No hay sesiones activas.</p>}
      {sessions.map(s => (
        <button
          key={s.id}
          disabled={loading}
          className="w-full text-left text-xs px-2 py-1.5 rounded border hover:bg-accent disabled:opacity-50"
          onClick={() => send(s.id)}
        >
          {s.label ?? s.channel ?? s.id}
        </button>
      ))}
      {result && <p className="text-xs text-center">{result}</p>}
      <button className="text-xs text-muted-foreground hover:underline" onClick={() => { setOpen(false); setResult(null); }}>
        Cancelar
      </button>
    </div>
  );
}
