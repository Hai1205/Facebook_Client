import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStatStore } from "@/stores/useStatStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";
export function TopArtists() {
  const { users: artists, getTopArtistsStat } = useStatStore();
  useEffect(() => {
    getTopArtistsStat();
  }, [getTopArtistsStat]);

  return (
    <ScrollArea className="h-[290px] pr-4">
      <div className="space-y-4">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="flex items-center justify-between gap-4 rounded-lg border p-3 hover:bg-muted/50"
          >
            <div>
              <Link
                to={`/profile/${artist?.id}`}
                className="flex items-center gap-3"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={artist.avatarUrl} alt={artist.fullName} />
                  <AvatarFallback>
                    {artist.fullName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="cursor-pointer">
                  <div className="font-medium hover:underline">
                    {artist.fullName}
                  </div>

                  <div className="text-sm text-muted-foreground hover:underline">
                    @{artist.username}
                  </div>
                </div>
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              {artist.followers.length} followers
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
{
  /* <Link to={`/profile/${user?.id}`}></Link> */
}
