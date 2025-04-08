import { Loader2, Music } from "lucide-react";
import { Song } from "@/utils/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface SongResultsProps {
  songs: Song[];
  query: string;
  isLoading: boolean;
}

export function SongResults({ songs, query, isLoading }: SongResultsProps) {
  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center"
        style={{ marginTop: "100px" }}
      >
        <Loader2 className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center"
        style={{ marginTop: "50px" }}
      >
        <Music className="h-12 w-12 text-muted-foreground mb-4" />

        <h3 className="text-lg font-medium">No song found</h3>

        <p className="text-muted-foreground mt-1">
          We couldn't find any song matching "{query}"
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {songs.map((song) => (
        <div
          key={song.id}
          className="flex flex-col overflow-hidden rounded-lg border transition-all hover:shadow-md"
        >
          <Link to={`/song-details/${song.id}`}>
            <div className="relative aspect-square overflow-hidden">
              <Avatar className="h-full w-full rounded-md">
                <AvatarImage src={song.thumbnailUrl} alt={song.title} />

                <AvatarFallback className="absolute inset-0 flex items-center justify-center text-8xl font-bold !rounded-none">
                  <Music className="h-20 w-20" />
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col p-4">
              <Link to={`/song-details/${song.id}`}>
                <h3 className="font-semibold line-clamp-1 hover:underline">
                  {song.title}
                </h3>
              </Link>

              <Link to={`/profile/${song.user.id}`}>
                <p className="text-sm text-muted-foreground hover:underline">
                  {song.user.fullName}
                </p>
              </Link>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {song.releaseDate}
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
