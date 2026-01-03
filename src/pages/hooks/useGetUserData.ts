import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

const useGetUserData = () => {
  const [user, setUser] = useState<{ email: string; role: string }>({
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error(error);
        } else {
          const userId = data.user.id;
          const { data: userRole, error: userRoleError } = await supabase
            .from("userroles")
            .select("role")
            .eq("userid", userId)
            .single();
          if (userRoleError) {
            setLoading(false);
          } else {
            setUser({
              email: data.user.email || "",
              role: userRole.role,
            });
            setLoading(false);
          }
        }
      } catch (error) {
        setLoading(false);
      }
    };

    getUserRole();
  }, []);

  return { ...user, loading };
};

export default useGetUserData;
