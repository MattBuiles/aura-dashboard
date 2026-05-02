"use client";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function GatewayStatus() {
  const { data } = useSWR("/api/gateway/status", fetcher, { refreshInterval: 10000 });
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Gateway</span>
      <Badge variant={data?.ok ? "default" : "destructive"}>{data?.ok ? "online" : "offline"}</Badge>
    </div>
  );
}
