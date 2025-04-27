import { Link, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Eye, MoreHorizontal, Pencil, Plus, Search, Trash } from "lucide-react";
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
import { PostsEmptyState } from "@/layout/components/EmptyState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { POST } from "@/utils/interface";
import UploadPostDialog from "./components/UploadPostDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EditPostDialog from "./components/EditPostDialog";
import { usePostStore } from "@/stores/usePostStore";
import { formatDateInDDMMYYY, formatNumberStyle } from "@/lib/utils";
import { mockPosts } from "@/utils/fakeData";
import { Badge } from "@/components/ui/badge";
import { TablePostSkeleton } from "./components/TablePostSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PostManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const queryString = location.search;

  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [posts, setPosts] = useState<POST[] | []>(mockPosts);

  const [selectedPost, setSelectedPost] = useState<POST | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { isLoading, getAllPost, searchPosts } = usePostStore();

  useEffect(() => {
    const fetchPosts = async () => {
      if (queryString) {
        await searchPosts(queryString).then(setPosts);
      } else {
        await getAllPost().then(setPosts);
      }
    };

    fetchPosts();
  }, [getAllPost, query, queryString, searchPosts]);

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

  const handlePostUploaded = (newPost: POST) => {
    setPosts([...posts, newPost]);
  };

  const handleEditPost = (post: POST) => {
    setSelectedPost(post);
    setIsEditDialogOpen(true);
  };

  const handlePostUpdated = (updatedPost: POST) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const mediaTypeStyles = {
    IMAGE: "text-blue-500 border-blue-500",
    VIDEO: "text-purple-500 border-purple-500",
  };
  
  const privacyStyles = {
    PUBLIC: "text-green-500 border-green-500",
    PRIVATE: "text-gray-500 border-gray-500",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Posts Management</h2>

        <div className="flex items-center gap-2">
          <Dialog open={isAddPostOpen} onOpenChange={setIsAddPostOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsAddPostOpen(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white h-8 gap-1"
              >
                <Plus className="h-4 w-4" />
                Upload POST
              </Button>
            </DialogTrigger>

            <UploadPostDialog
              isOpen={isAddPostOpen}
              onOpenChange={setIsAddPostOpen}
              onPostUploaded={handlePostUploaded}
            />
          </Dialog>
        </div>
      </div>

      <Card className="bg-zinc-900">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle />

            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative w-60">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

                  <Input
                    type="search"
                    placeholder="Search posts..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>
        </CardHeader>

        <ScrollArea className="h-[calc(100vh-220px)] w-full rounded-xl">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">User</TableHead>

                  <TableHead className="text-center">Media Type</TableHead>

                  <TableHead className="text-center">Privacy</TableHead>

                  <TableHead className="text-center">Engagement</TableHead>

                  <TableHead className="text-center">Upload Date</TableHead>

                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <TablePostSkeleton />
                    </TableCell>
                  </TableRow>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <Link to={`/profile/${post?.user?.id}`}>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={post?.user?.avatarPhotoUrl}
                                alt={post?.user?.fullName}
                              />

                              <AvatarFallback className="text-white">
                                {post?.user?.fullName?.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                              <span className="font-medium hover:underline text-white">
                                {post?.user?.fullName}
                              </span>

                              <span className="text-sm text-muted-foreground hover:underline">
                                {post?.user?.email}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={mediaTypeStyles[post.mediaType]}
                        >
                          {post.mediaType}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={privacyStyles[post.privacy]}
                        >
                          {post.privacy}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <span className="mr-2 text-white">
                            👍 {formatNumberStyle(post.likes.length)}
                          </span>
                          <span className="text-white">
                            💬 {formatNumberStyle(post.comments.length)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center text-white">
                        {formatDateInDDMMYYY(post.createdAt as string)}
                      </TableCell>

                      <TableCell className="text-center text-white">
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
                                // onClick={() => handleEditPost(post)}
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4 cursor-pointer" />
                                {" View"}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleEditPost(post)}
                                className="cursor-pointer"
                              >
                                <Pencil className="mr-2 h-4 w-4 cursor-pointer" />
                                {" Edit"}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem className="text-red-600">
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
                    <TableCell colSpan={6}>
                      <PostsEmptyState message="No posts have been added yet. Create an post to get started." />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </ScrollArea>
      </Card>

      <EditPostDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        post={selectedPost}
        onPostUpdated={handlePostUpdated}
      />
    </div>
  );
}
