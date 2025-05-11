import { useEffect, useState } from "react";
import { Users, Flag, FileText, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TopUsers } from "./components/TopUsers";
import { PopularPosts } from "./components/PopularPosts";

import { useStatStore } from "@/stores/useStatStore";
import { STATS } from "@/utils/interface";
import { formatNumberStyle } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { isLoading, generalStat, getGeneralStat } = useStatStore();

  const [stats, setStats] = useState<STATS | null>(generalStat);

  useEffect(() => {
    const fetchStats = async () => {
      const result = await getGeneralStat();

      if (result) {
        setStats(result);
      }
    };

    fetchStats();
  }, [getGeneralStat]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <p className="text-muted-foreground">Overview of Facebook platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>

            <Users className="h-4 w-4" />
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 rounded-md bg-zinc-800 animate-pulse" />
            ) : (
              <div className="text-2xl font-bold">{formatNumberStyle(stats?.totalUsers || 0 )}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>

            <FileText className="h-4 w-4" />
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 rounded-md bg-zinc-800 animate-pulse" />
            ) : (
              <div className="text-2xl font-bold">{formatNumberStyle(stats?.totalPosts || 0)}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Comments
            </CardTitle>

            <MessageSquare className="h-4 w-4" />
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 rounded-md bg-zinc-800 animate-pulse" />
            ) : (
              <div className="text-2xl font-bold">{formatNumberStyle(stats?.totalComments || 0)}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium ">
              Total Reports
            </CardTitle>

            <Flag className="h-4 w-4" />
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 rounded-md bg-zinc-800 animate-pulse" />
            ) : (
              <div className="text-2xl font-bold">{formatNumberStyle(stats?.totalReports || 0)}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
            <Card className="col-span-4 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-white">Popular Posts</CardTitle>

                <CardDescription>Top 5 most engagement posts</CardDescription>
              </CardHeader>

              <CardContent>
                <PopularPosts />
              </CardContent>
            </Card>

            <Card className="col-span-4 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-white">Top Users</CardTitle>

                <CardDescription>Most followed users</CardDescription>
              </CardHeader>

              <CardContent>
                <TopUsers />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
