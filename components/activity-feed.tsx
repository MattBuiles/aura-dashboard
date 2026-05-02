"use client";
import useSWR from "swr";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function ActivityFeed() {
  const { data } = useSWR("/api/activity?limit=20", fetcher, { refreshInterval: 3000 });
  const logs = data ?? [];
  return (
    <ScrollArea className="h-96">
      <div className="space-y-2">
        {logs.map((log: any) => (
          <div key={log.id} className="text-sm border-b pb-2">
            <span className="font-mono text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
            </span>
            <span className="ml-2 font-medium">{log.type}</span>
            {log.channel && <span className="ml-2 text-muted-foreground">[{log.channel}]</span>}
          </div>
        ))}
        {!logs.length && <p className="text-muted-foreground text-sm">Sin actividad reciente.</p>}
      </div>
    </ScrollArea>
  );
}
