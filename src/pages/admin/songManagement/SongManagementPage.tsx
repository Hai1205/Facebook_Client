import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Clock,
  Download,
  MoreHorizontal,
  Music,
  Pencil,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useMusicStore } from "@/stores/useMusicStore";
import { Song } from "@/utils/types";
import formatTime from "@/utils/service/formatTime";
import { SongsEmptyState } from "@/layout/components/EmptyState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableSkeleton } from "@/layout/components/TableSkeleton";
import UploadSongDialog from "./components/UploadSongDialog";
import EditSongDialog from "./components/EditSongDialog";

export default function SongManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const queryString = location.search;

  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [songs, setSongs] = useState<Song[] | []>([]);

  const { isLoading, getAllSong, searchSongs, deleteSong, downloadSong } =
    useMusicStore();

  useEffect(() => {
    const fetchSongs = async () => {
      if (queryString) {
        await searchSongs(queryString).then(setSongs);
      } else {
        await getAllSong().then(setSongs);
      }
    };

    fetchSongs();
  }, [getAllSong, query, queryString, searchSongs]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (searchQuery.trim()) {
        setSearchParams({ query: searchQuery.trim() });
      } else {
        setSearchParams();
      }
    },
    [searchQuery, setSearchParams]
  );

  const handleDownloadSong = async (song: Song) => {
    if (!song) {
      return;
    }

    await downloadSong(song.id);
  };

  const handleDeleteSong = async (song: Song) => {
    if (!song) {
      return;
    }

    await deleteSong(song.id);
  };

  const handleSongUploaded = (newSong: Song) => {
    setSongs([...songs, newSong]);
  };

  const handleEditSong = (song: Song) => {
    setSelectedSong(song);
    setIsEditDialogOpen(true);
  };

  const handleSongUpdated = (updatedSong: Song) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) => (song.id === updatedSong.id ? updatedSong : song))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Songs</h2>

        <div className="flex items-center gap-2">
          <Dialog open={isAddSongOpen} onOpenChange={setIsAddSongOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsAddSongOpen(true)}
                size="sm"
                className="bg-[#1DB954] hover:bg-green-600 text-white h-8 gap-1"
              >
                <Plus className="h-4 w-4" />
                Upload Song
              </Button>
            </DialogTrigger>

            <UploadSongDialog
              isOpen={isAddSongOpen}
              onOpenChange={setIsAddSongOpen}
              onSongUploaded={handleSongUploaded}
            />
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all-songs" className="space-y-4">
        <TabsContent value="all-songs" className="space-y-4">
          <Card className="bg-zinc-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Song Management</CardTitle>

                <div className="flex items-center gap-2">
                  <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2"
                  >
                    <div className="relative w-60">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

                      <Input
                        type="search"
                        placeholder="Search songs..."
                        className="w-full pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </CardHeader>

            <ScrollArea className="h-[calc(100vh-340px)] w-full rounded-xl">
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px] text-center">
                        Thumbnail
                      </TableHead>

                      <TableHead className="text-center">Title</TableHead>

                      <TableHead className="text-center">Artist</TableHead>

                      <TableHead className="text-center">Album</TableHead>

                      <TableHead className="text-center">Duration</TableHead>

                      <TableHead className="text-center">Views</TableHead>

                      <TableHead className="text-center">
                        Release Date
                      </TableHead>

                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={9}>
                          <TableSkeleton />
                        </TableCell>
                      </TableRow>
                    ) : songs.length > 0 ? (
                      songs.map((song) => (
                        <TableRow key={song.id}>
                          <TableCell className="text-center">
                            <Link to={`/song-details/${song.id}`}>
                              <div className="flex justify-center">
                                <Avatar className="h-9 w-9 rounded-md">
                                  <AvatarImage
                                    src={song.thumbnailUrl}
                                    alt={song.title}
                                  />
                                  <AvatarFallback>
                                    <Music className="h-4 w-4" />
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            </Link>
                          </TableCell>

                          <TableCell className="text-center hover:underline">
                            <Link to={`/song-details/${song.id}`}>
                              {song.title}
                            </Link>
                          </TableCell>

                          <TableCell className="text-center hover:underline">
                            <Link to={`/profile/${song.user.id}`}>
                              {song.user.fullName}
                            </Link>
                          </TableCell>

                          <TableCell>
                            {song.album ? (
                              <Link to={`/album-details/${song.album.id}`}>
                                <span className="text-center hover:underline">
                                  {song.album.title}
                                </span>
                              </Link>
                            ) : (
                              <span className="text-center">No Album</span>
                            )}
                          </TableCell>

                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{formatTime(song.duration)}</span>
                            </div>
                          </TableCell>

                          <TableCell className="text-center">
                            {song.views}
                          </TableCell>

                          <TableCell className="text-center">
                            {song.releaseDate}
                          </TableCell>

                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                  <DropdownMenuItem
                                    onClick={() => handleEditSong(song)}
                                    className="cursor-pointer"
                                  >
                                    <Pencil className="mr-2 h-4 w-4 cursor-pointer" />
                                    {" Edit"}
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => handleDownloadSong(song)}
                                    className="cursor-pointer"
                                  >
                                    <Download className="mr-2 h-4 w-4" />
                                    {" Download"}
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem
                                    onClick={() => handleDeleteSong(song)}
                                    className="text-red-600 cursor-pointer"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    {" Delete"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9}>
                          <SongsEmptyState message="No songs have been added yet. Upload a song to get started." />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>

      <EditSongDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        song={selectedSong}
        onSongUpdated={handleSongUpdated}
      />
    </div>
  );
}
