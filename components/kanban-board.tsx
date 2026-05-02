"use client";
import { TaskCard } from "./task-card";

const COLUMNS = [
  { id: "pending", label: "Pendiente" },
  { id: "in_progress", label: "En progreso" },
  { id: "done", label: "Hecho" },
  { id: "blocked", label: "Bloqueado" },
];

export function KanbanBoard({ tasks, onStatusChange }: { tasks: any[]; onStatusChange: (id: string, status: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {COLUMNS.map((col) => (
        <div key={col.id} className="space-y-3">
          <h3 className="font-semibold text-sm">{col.label}</h3>
          <div className="space-y-2 min-h-32 p-2 rounded-lg bg-muted/50">
            {tasks.filter(t => t.status === col.id).map(task => (
              <div key={task.id}>
                <TaskCard task={task} />
                <select className="mt-1 text-xs w-full bg-background border rounded px-1 py-0.5"
                  value={task.status} onChange={e => onStatusChange(task.id, e.target.value)}>
                  {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
