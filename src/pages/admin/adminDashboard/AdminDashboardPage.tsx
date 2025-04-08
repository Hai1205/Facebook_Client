import { useEffect } from "react";
import { Users, Music, Mic2, Disc } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TopArtists } from "./components/TopArtists";
import { PopularSongs } from "./components/PopularSongs";

import { useStatStore } from "@/stores/useStatStore";

export default function AdminDashboardPage() {
  const { generalStat, getGeneralStat } = useStatStore();

  useEffect(() => {
    getGeneralStat();
  }, [getGeneralStat]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>

            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{generalStat.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artists</CardTitle>

            <Mic2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{generalStat.totalArtists}</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Albums</CardTitle>

            <Disc className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{generalStat.totalAlbums}</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Songs</CardTitle>

            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{generalStat.totalSongs}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-zinc-900">
              <CardHeader>
                <CardTitle>Popular Songs</CardTitle>

                <CardDescription>
                  Top 5 most streamed songs
                </CardDescription>
              </CardHeader>

              <CardContent>
                <PopularSongs />
              </CardContent>
            </Card>

            <Card className="col-span-3 bg-zinc-900">
              <CardHeader>
                <CardTitle>Top Artists</CardTitle>

                <CardDescription>
                  Most followed users
                </CardDescription>
              </CardHeader>

              <CardContent>
                <TopArtists />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
