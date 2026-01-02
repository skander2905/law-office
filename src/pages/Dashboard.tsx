import useGetUserData from "./hooks/useGetUserData";
import LawyerDashboard from "./LawyerDashboard";
import ClientDashboard from "./ClientDashboard";
import { Box, CircularProgress } from "@mui/material";

const Dashboard = () => {
  const { email, role, loading } = useGetUserData();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {role === "lawyer" ? (
        <LawyerDashboard email={email} />
      ) : (
        <ClientDashboard email={email} />
      )}
    </>
  );
};

export default Dashboard;
