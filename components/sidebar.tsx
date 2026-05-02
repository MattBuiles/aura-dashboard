"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, ListTodo, FolderOpen, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sessions", label: "Sesiones", icon: MessageSquare },
  { href: "/tasks", label: "Tareas", icon: ListTodo },
  { href: "/activity", label: "Actividad", icon: Activity },
  { href: "/workspace", label: "Workspace", icon: FolderOpen },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-56 border-r h-screen flex flex-col p-4 gap-1">
      <div className="text-lg font-bold mb-4 px-2">Aura</div>
      {nav.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href}
          className={cn("flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent",
            path === href && "bg-accent font-medium")}>
          <Icon size={16} />{label}
        </Link>
      ))}
    </aside>
  );
}
