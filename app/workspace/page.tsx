import { FileBrowser } from "@/components/file-browser";

export default function WorkspacePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Workspace</h1>
      <FileBrowser />
    </div>
  );
}
