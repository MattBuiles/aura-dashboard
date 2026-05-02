import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GatewayStatus } from "@/components/gateway-status";
import { ActivityFeed } from "@/components/activity-feed";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <GatewayStatus />
      </div>
      <Card>
        <CardHeader><CardTitle>Actividad reciente</CardTitle></CardHeader>
        <CardContent><ActivityFeed /></CardContent>
      </Card>
    </div>
  );
}
