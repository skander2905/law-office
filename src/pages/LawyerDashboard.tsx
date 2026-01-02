import { Button } from "@mui/material";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

const LawyerDashboard = ({ email }: { email: string }) => {
  const navigate = useNavigate();
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    } else {
      navigate("/");
    }
  };
  return (
    <div>
      Lawyer Dashboard {email}
      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );
};

export default LawyerDashboard;
