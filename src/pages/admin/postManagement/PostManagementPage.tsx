import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FILTER, POST } from "@/utils/interface";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { usePostStore } from "@/stores/usePostStore";
import { PostFilter } from "./components/PostFilter";
import { PostTable } from "./components/PostTable";
import NewPostDialog from "@/pages/post/components/posts/NewPostDialog";
import { ViewPostModal } from "@/pages/post/components/posts/ViewPostModal";
import { TableSearch } from "../userManagement/components/TableSearch";
import EditPostDialog from "@/pages/post/components/posts/EditPostDialog";

export default function PostManagementPage() {
  const { isLoading, getAllPost, searchPosts, deletePost } = usePostStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const queryString = location.search;

  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [posts, setPosts] = useState<POST[] | []>([]);

  const [selectedPost, setSelectedPost] = useState<POST | null>(null);
  const [isViewOpen, setViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const initialFilters: FILTER = { status: [], contentType: [] };
  const [activeFilters, setActiveFilters] = useState<FILTER>(initialFilters);
  const [openMenuFilters, setOpenMenuFilters] = useState(false);
  const closeMenuMenuFilters = () => setOpenMenuFilters(false);

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

  const handlePostUpdated = (updatedPost: POST) => {
    setPosts(
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handleViewPost = (post: POST) => {
    setSelectedPost(post);
    setViewOpen(true);
  };

  const handleUpdatePost = (post: POST) => {
    setSelectedPost(post);
    setIsEditOpen(true);
  };

  const clearFilters = () => {
    setActiveFilters(initialFilters);
    setSearchQuery("");
    setSearchParams({});
    closeMenuMenuFilters();
  };

  const toggleFilter = (value: string, type: "status" | "privacy") => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (updated[type]?.includes(value)) {
        updated[type] = updated[type].filter((item) => item !== value);
      } else {
        updated[type] = [...(updated[type] || []), value];
      }
      return updated;
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    if (activeFilters.status.length > 0) {
      params.set("status", activeFilters.status.join(","));
    } else {
      params.delete("status");
    }

    if (activeFilters.privacy && activeFilters.privacy.length > 0) {
      params.set("privacy", activeFilters.privacy.join(","));
    } else {
      params.delete("privacy");
    }

    setSearchParams(params);
    closeMenuMenuFilters();
  };

  const handleDeletePost = async (post: POST) => {
    if (!post) {
      return;
    }

    await deletePost(post.id as string);
    setPosts(posts.filter((p) => p.id !== post.id));
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
                className="bg-blue-600 hover:bg-[#166FE5] text-white h-8 gap-1"
              >
                <Plus className="h-4 w-4" />
                Upload POST
              </Button>
            </DialogTrigger>

            <NewPostDialog
              isPostFormOpen={isAddPostOpen}
              setIsPostFormOpen={setIsAddPostOpen}
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
              <TableSearch
                handleSearch={handleSearch}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Search posts..."
              />

              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 bg-blue-600 hover:bg-[#166FE5] text-white"
                onClick={clearFilters}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>

              <PostFilter
                openMenuFilters={openMenuFilters}
                setOpenMenuFilters={setOpenMenuFilters}
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                clearFilters={clearFilters}
                applyFilters={applyFilters}
                closeMenuMenuFilters={closeMenuMenuFilters}
              />
            </div>
          </div>
        </CardHeader>

        <PostTable
          posts={posts}
          isLoading={isLoading}
          handleViewPost={handleViewPost}
          handleUpdatePost={handleUpdatePost}
          handleDeletePost={handleDeletePost}
        />
      </Card>

      <ViewPostModal
        isOpen={isViewOpen}
        onOpenChange={setViewOpen}
        post={selectedPost as POST}
      />

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <EditPostDialog
          isPostFormOpen={isEditOpen}
          setIsPostFormOpen={setIsEditOpen}
          post={selectedPost as POST}
          onPostUpdated={handlePostUpdated}
        />
      </Dialog>
    </div>
  );
}
