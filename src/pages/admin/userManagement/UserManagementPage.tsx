import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Filter,
  MoreHorizontal,
  Search,
  Trash,
  Pencil,
  Music,
  Disc3,
  UserPlus,
  RefreshCw,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import EditUserDialog from "./components/EditUserDialog";
import AddUserDialog from "./components/AddUserDialog";
import { Album, Song, User } from "@/utils/types";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import ManageSongsDialog from "../songManagement/components/ManageSongsDialog";
import EditSongDialog from "../songManagement/components/EditSongDialog";
import ManageAlbumsDialog from "../albumManagement/components/ManageAlbumsDialog";
import { UserEmptyState } from "@/layout/components/EmptyState";
import { TableSkeleton } from "@/layout/components/TableSkeleton";
import EditAlbumDialog from "../albumManagement/components/EditAlbumDialog";

export default function UserManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const queryString = location.search;

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[] | []>([]);
  const [openMenuFilters, setOpenMenuFilters] = useState(false);
  const closeMenuMenuFilters = () => setOpenMenuFilters(false);

  const [isManageSongsOpen, setIsManageSongsOpen] = useState(false);
  const [isManageAlbumsOpen, setIsManageAlbumsOpen] = useState(false);
  const [isEditSongOpen, setIsEditSongOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<User | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const [isEditAlbumOpen, setIsEditAlbumOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const { isLoading, searchUsers, deleteUser, getAllUser } = useUserStore();
  const { isAdmin, resetPassword } = useAuthStore();

  useEffect(() => {
    const fetchUsers = async () => {
      const params = new URLSearchParams(searchParams);
      params.set("admin", `${isAdmin}`);
      const updatedQueryString = `?${params.toString()}`;

      if (queryString) {
        await searchUsers(updatedQueryString).then(setUsers);
      } else {
        await getAllUser().then(setUsers);
      }
    };

    fetchUsers();
  }, [getAllUser, query, queryString, searchUsers, searchParams, isAdmin]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams();

      params.set("admin", `${isAdmin}`);

      if (searchQuery.trim()) {
        params.set("query", searchQuery.trim());
      }

      setSearchParams(params);
    },
    [isAdmin, searchQuery, setSearchParams]
  );

  // Add these state variables at the beginning of the UsersPage component, after the existing state declarations
  const [activeFilters, setActiveFilters] = useState<{
    status: string[];
    role: string[];
  }>({
    status: [],
    role: [],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "lock":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleResetPassword = (user: User) => {
    if (!user) {
      return;
    }

    resetPassword(user.id);
  };

  const handleDeleteUser = async (user: User) => {
    if (!user) {
      return;
    }

    await deleteUser(user.id);
    setUsers(users.filter((u) => u.id !== user.id));
  };

  // Function to toggle a filter value
  const toggleFilter = (
    category: keyof typeof activeFilters,
    value: string
  ) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };

      if (updated[category].includes(value)) {
        updated[category] = updated[category].filter((item) => item !== value);
      } else {
        updated[category] = [...updated[category], value];
      }

      return updated;
    });
  };

  // Function to clear all filters
  const clearFilters = async () => {
    setActiveFilters({ status: [], role: [] });
    setSearchQuery("");

    const params = new URLSearchParams();
    params.set("admin", `${isAdmin}`);
    setSearchParams(params);

    closeMenuMenuFilters();
  };

  // Function to apply all filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    params.set("admin", `${isAdmin}`);

    Object.keys(activeFilters).forEach((key) => {
      const values = activeFilters[key as keyof typeof activeFilters];
      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }
    });

    setSearchParams(params);
    closeMenuMenuFilters();
  };

  const handleManageSongs = (artist: User) => {
    setSelectedArtist(artist);
    setIsManageSongsOpen(true);
  };

  const handleManageAlbums = (artist: User) => {
    setSelectedArtist(artist);
    setIsManageAlbumsOpen(true);
  };

  const handleEditSong = (song: Song) => {
    setSelectedSong(song);
    setIsEditSongOpen(true);
  };

  const handleEditAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setIsEditAlbumOpen(true);
  };

  const handleUserAdded = (newUser: User) => {
    setUsers([...users, newUser]);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-[#1DB954] hover:bg-green-600 text-white h-8 gap-1"
            onClick={() => setIsAddUserOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Edit User Dialog */}
      <EditUserDialog
        isOpen={isEditUserOpen}
        onOpenChange={setIsEditUserOpen}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />

      {/* Manage Songs Dialog */}
      <ManageSongsDialog
        isOpen={isManageSongsOpen}
        onOpenChange={setIsManageSongsOpen}
        artist={selectedArtist}
        handleEditSong={handleEditSong}
      />

      {/* Edit Song Dialog */}
      <EditSongDialog
        isOpen={isEditSongOpen}
        onOpenChange={setIsEditSongOpen}
        song={selectedSong}
      />

      {/* Manage Albums Dialog */}
      <ManageAlbumsDialog
        isOpen={isManageAlbumsOpen}
        onOpenChange={setIsManageAlbumsOpen}
        artist={selectedArtist}
        handleEditAlbum={handleEditAlbum}
      />

      {/* Edit Album Dialog */}
      <EditAlbumDialog
        isOpen={isEditAlbumOpen}
        onOpenChange={setIsEditAlbumOpen}
        album={selectedAlbum}
      />

      <Tabs defaultValue="all-users" className="space-y-4">
        <TabsContent value="all-users" className="space-y-4">
          <Card className="bg-zinc-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>

                <div className="flex items-center gap-2">
                  <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2"
                  >
                    <div className="relative w-60">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

                      <Input
                        type="search"
                        placeholder="Search users..."
                        className="w-full pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </form>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={clearFilters}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>

                  <DropdownMenu
                    open={openMenuFilters}
                    onOpenChange={closeMenuMenuFilters}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => setOpenMenuFilters((prev) => !prev)}
                      >
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-[250px]">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>

                      <DropdownMenuSeparator />

                      <div className="p-2">
                        <h4 className="mb-2 text-sm font-medium">Status</h4>

                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Checkbox
                              id="status-active"
                              checked={activeFilters.status.includes("active")}
                              onCheckedChange={() =>
                                toggleFilter("status", "active")
                              }
                              className="mr-2"
                            />

                            <label htmlFor="status-active">Active</label>
                          </div>

                          <div className="flex items-center">
                            <Checkbox
                              id="status-pending"
                              checked={activeFilters.status.includes("pending")}
                              onCheckedChange={() =>
                                toggleFilter("status", "pending")
                              }
                              className="mr-2"
                            />

                            <label htmlFor="status-pending">Pending</label>
                          </div>

                          <div className="flex items-center">
                            <Checkbox
                              id="status-lock"
                              checked={activeFilters.status.includes("lock")}
                              onCheckedChange={() =>
                                toggleFilter("status", "lock")
                              }
                              className="mr-2"
                            />

                            <label htmlFor="status-lock">lock</label>
                          </div>
                        </div>
                      </div>

                      <DropdownMenuSeparator />

                      <div className="p-2">
                        <h4 className="mb-2 text-sm font-medium">Role</h4>

                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Checkbox
                              id="role-user"
                              checked={activeFilters.role.includes("user")}
                              onCheckedChange={() =>
                                toggleFilter("role", "user")
                              }
                              className="mr-2"
                            />

                            <label htmlFor="role-user">User</label>
                          </div>

                          <div className="flex items-center">
                            <Checkbox
                              id="role-artist"
                              checked={activeFilters.role.includes("artist")}
                              onCheckedChange={() =>
                                toggleFilter("role", "artist")
                              }
                              className="mr-2"
                            />
                            <label htmlFor="role-artist">Artist</label>
                          </div>

                          <div className="flex items-center">
                            <Checkbox
                              id="role-admin"
                              checked={activeFilters.role.includes("admin")}
                              onCheckedChange={() =>
                                toggleFilter("role", "admin")
                              }
                              className="mr-2"
                            />
                            <label htmlFor="role-admin">Admin</label>
                          </div>
                        </div>
                      </div>

                      <DropdownMenuSeparator />

                      <div className="p-2 flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                        >
                          Clear Filters
                        </Button>

                        <Button size="sm" onClick={applyFilters}>
                          Apply Filters
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <ScrollArea className="h-[calc(100vh-340px)] w-full rounded-xl">
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">User</TableHead>

                      <TableHead className="text-center">Role</TableHead>

                      <TableHead className="text-center">Country</TableHead>

                      <TableHead className="text-center">Status</TableHead>

                      <TableHead className="text-center">Join Date</TableHead>

                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <TableSkeleton />
                        </TableCell>
                      </TableRow>
                    ) : users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Link to={`/profile/${user?.id}`}>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage
                                    src={user?.avatarUrl}
                                    alt={user?.fullName || "User"}
                                  />
                                  <AvatarFallback>
                                    {user?.fullName
                                      ? user.fullName.substring(0, 2)
                                      : "U"}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col">
                                  <span className="font-medium hover:underline">
                                    {user?.fullName || "Unknown Artist"}
                                  </span>

                                  <span className="text-sm text-muted-foreground hover:underline">
                                    @{user?.username || "unknown"}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </TableCell>

                          <TableCell className="capitalize text-center">
                            {user.role}
                          </TableCell>

                          <TableCell className="capitalize text-center">
                            {user.country}
                          </TableCell>

                          <TableCell className="capitalize text-center flex items-center justify-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${getStatusColor(
                                user.status
                              )}`}
                            />
                            <span className="capitalize">{user.status}</span>
                          </TableCell>

                          <TableCell className="text-center">
                            {user.joinDate}
                          </TableCell>

                          <TableCell className="text-right">
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
                                  onClick={() => handleEditUser(user)}
                                  className="cursor-pointer"
                                >
                                  <Pencil className="mr-2 h-4 w-4 cursor-pointer" />{" "}
                                  Edit
                                </DropdownMenuItem>

                                {(user.role === "artist" ||
                                  user.role === "admin") && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleManageSongs(user)}
                                      className="cursor-pointer"
                                    >
                                      <Music className="mr-2 h-4 w-4" /> Manage
                                      songs
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      onClick={() => handleManageAlbums(user)}
                                      className="cursor-pointer"
                                    >
                                      <Disc3 className="mr-2 h-4 w-4" /> Manage
                                      albums
                                    </DropdownMenuItem>
                                  </>
                                )}

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                  onClick={() => handleResetPassword(user)}
                                  className="cursor-pointer"
                                >
                                  Reset password
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(user)}
                                  className="text-red-600 cursor-pointer"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete user
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <UserEmptyState />
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

      {/* Add User Dialog */}
      <AddUserDialog
        isOpen={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
}
