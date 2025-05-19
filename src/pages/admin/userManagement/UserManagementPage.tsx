import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UserPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import AddUserDialog from "./components/AddUserDialog";
import { USER } from "@/utils/interface";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserFilter } from "./components/UserFilter";
import EditUserDialog from "./components/EditUserDialog";
import { UserTable } from "./components/UserTable";
import { TableSearch } from "./components/TableSearch";

export default function UserManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const queryString = location.search;

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<USER | null>(null);

  const [users, setUsers] = useState<USER[] | []>([]);
  const [openMenuFilters, setOpenMenuFilters] = useState(false);
  const closeMenuMenuFilters = () => setOpenMenuFilters(false);

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
    gender: string[];
  }>({
    status: [],
    role: [],
    gender: [],
  });

  const handleEditUser = (user: USER) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleResetPassword = (user: USER) => {
    if (!user) {
      return;
    }

    resetPassword(user.id as string);
  };

  const handleDeleteUser = async (user: USER) => {
    if (!user) {
      return;
    }

    await deleteUser(user.id as string);
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
    setActiveFilters({ status: [], role: [], gender: [] });
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

  const handleUserAdded = (newUser: USER) => {
    setUsers([...users, newUser]);
  };

  const handleUserUpdated = (updatedUser: USER) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  useEffect(() => {
    const status = searchParams.get("status");
    const role = searchParams.get("role");
    const gender = searchParams.get("gender");

    const newFilters: {
      status: string[];
      role: string[];
      gender: string[];
    } = { status: [], role: [], gender: [] };

    if (status) {
      newFilters.status = status.split(",");
    }

    if (role) {
      newFilters.role = role.split(",");
    }

    if (gender) {
      newFilters.gender = gender.split(",");
    }

    setActiveFilters(newFilters);
  }, [searchParams]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-[#1877F2] hover:bg-[#166FE5] text-white h-8 gap-1"
            onClick={() => setIsAddUserOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Add user
          </Button>
        </div>
      </div>

      {/* Edit USER Dialog */}
      <EditUserDialog
        isOpen={isEditUserOpen}
        onOpenChange={setIsEditUserOpen}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
        isAdmin={isAdmin}
      />

      <Tabs defaultValue="all-users" className="space-y-4">
        <TabsContent value="all-users" className="space-y-4">
          <Card className="bg-zinc-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle />

                <div className="flex items-center gap-2">
                  <TableSearch
                    handleSearch={handleSearch}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder="Search users..."
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

                  <UserFilter
                    openMenuFilters={openMenuFilters}
                    setOpenMenuFilters={setOpenMenuFilters}
                    activeFilters={activeFilters}
                    toggleFilter={(filter, value) =>
                      toggleFilter(filter as keyof typeof activeFilters, value)
                    }
                    clearFilters={clearFilters}
                    applyFilters={applyFilters}
                    closeMenuMenuFilters={closeMenuMenuFilters}
                  />
                </div>
              </div>
            </CardHeader>

            <UserTable
              users={users}
              isLoading={isLoading}
              handleEditUser={handleEditUser}
              handleResetPassword={handleResetPassword}
              handleDeleteUser={handleDeleteUser}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add USER Dialog */}
      <AddUserDialog
        isOpen={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
}
