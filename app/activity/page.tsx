"use client";
import useSWR from "swr";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then(r => r.json());
const TYPE_COLORS: Record<string, "default" | "secondary" | "destructive"> = {
  message: "default",
  tool_call: "secondary",
  heartbeat: "secondary",
  session_end: "destructive",
};

export default function ActivityPage() {
  const [filter, setFilter] = useState("");
  const { data } = useSWR(`/api/activity?limit=100${filter ? `&type=${filter}` : ""}`, fetcher, { refreshInterval: 3000 });
  const logs = data ?? [];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Actividad</h1>
        <select className="border rounded px-3 py-1.5 text-sm" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">Todos</option>
          <option value="message">Mensajes</option>
          <option value="tool_call">Tool calls</option>
          <option value="heartbeat">Heartbeat</option>
        </select>
      </div>
      <ScrollArea className="h-[calc(100vh-160px)]">
        <div className="space-y-2">
          {logs.map((log: any) => (
            <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg text-sm">
              <span className="text-xs text-muted-foreground w-40 shrink-0">{format(new Date(log.createdAt), "HH:mm:ss dd/MM")}</span>
              <Badge variant={TYPE_COLORS[log.type] ?? "default"}>{log.type}</Badge>
              {log.channel && <span className="text-muted-foreground">[{log.channel}]</span>}
              <pre className="text-xs overflow-auto flex-1">{JSON.stringify(log.payload, null, 2)}</pre>
            </div>
          ))}
          {!logs.length && <p className="text-muted-foreground">Sin actividad.</p>}
        </div>
      </ScrollArea>
    </div>
  );
}
