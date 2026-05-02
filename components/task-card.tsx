"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SendTaskModal } from "./send-task-modal";

const priorityColor: Record<string, "secondary" | "default" | "destructive"> = {
  low: "secondary",
  medium: "default",
  high: "destructive",
};

export function TaskCard({ task }: { task: any }) {
  return (
    <Card>
      <CardContent className="pt-4 space-y-2">
        <p className="text-sm font-medium">{task.title}</p>
        {task.description && <p className="text-xs text-muted-foreground">{task.description}</p>}
        <Badge variant={priorityColor[task.priority] ?? "default"}>{task.priority}</Badge>
        {task.status !== "done" && (
          <SendTaskModal taskId={task.id} taskTitle={task.title} />
        )}
      </CardContent>
    </Card>
  );
}
