import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/content";
import type { Database } from "@/types/database";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

const mapUserRowToUser = (row: UserRow): UserProfile => ({
  id: row.id,
  email: row.email ?? "",
  username: row.username ?? "",
  avatarUrl: row.avatar_url ?? "",
  role: row.role ?? "",
  bio: row.bio ?? "",
  createdAt: row.created_at ?? "",
  updatedAt: row.updated_at ?? row.created_at ?? "",
});

export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapUserRowToUser);
};
