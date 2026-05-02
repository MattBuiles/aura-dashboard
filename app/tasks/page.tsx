"use client";
import useSWR from "swr";
import { KanbanBoard } from "@/components/kanban-board";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function TasksPage() {
  const { data, mutate } = useSWR("/api/tasks", fetcher, { refreshInterval: 5000 });
  const [newTitle, setNewTitle] = useState("");
  const tasks = data ?? [];

  async function handleStatusChange(id: string, status: string) {
    await fetch(`/api/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    mutate();
  }

  async function handleCreate() {
    if (!newTitle.trim()) return;
    await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: newTitle }) });
    setNewTitle("");
    mutate();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tareas</h1>
        <div className="flex gap-2">
          <input className="border rounded px-3 py-1.5 text-sm" placeholder="Nueva tarea..."
            value={newTitle} onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleCreate()} />
          <Button size="sm" onClick={handleCreate}>Agregar</Button>
        </div>
      </div>
      <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />
    </div>
  );
}
