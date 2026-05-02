"use client";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function SessionsPage() {
  const { data } = useSWR("/api/sessions", fetcher, { refreshInterval: 5000 });
  const sessions = data?.history ?? [];
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Sesiones</h1>
      <Table>
        <TableHeader><TableRow>
          <TableHead>Canal</TableHead><TableHead>Estado</TableHead><TableHead>Inicio</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {sessions.map((s: any) => (
            <TableRow key={s.id}>
              <TableCell>{s.channel}</TableCell>
              <TableCell><Badge variant={s.status === "active" ? "default" : "secondary"}>{s.status}</Badge></TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
          {!sessions.length && <TableRow><TableCell colSpan={3} className="text-muted-foreground">Sin sesiones.</TableCell></TableRow>}
        </TableBody>
      </Table>
    </div>
  );
}
