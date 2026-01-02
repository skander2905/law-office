import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

const useGetUserData = () => {
  const [user, setUser] = useState<{ email: string; role: string }>({
    email: "",
    role: "",
  });

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error(error);
        } else {
          console.log(data);
          const userId = data.user.id;
          const { data: userRole, error: userRoleError } = await supabase
            .from("userRoles")
            .select("role")
            .eq("userId", userId)
            .single();
          if (userRoleError) {
            console.error(userRoleError);
          } else {
            setUser({
              email: data.user.email || "",
              role: userRole.role,
            });
            console.log(userRole);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUserRole();
  }, []);

  return user;
};

export default useGetUserData;
