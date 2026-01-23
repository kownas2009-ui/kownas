import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "student";

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await (supabase as any)
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching role:", error);
          setRole("student");
        } else {
          setRole(data?.role || "student");
        }
      } catch (error) {
        console.error("Error:", error);
        setRole("student");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchRole();
    }
  }, [user, authLoading]);

  const isAdmin = role === "admin";
  const isStudent = role === "student";

  return {
    role,
    isAdmin,
    isStudent,
    loading: authLoading || loading
  };
};
