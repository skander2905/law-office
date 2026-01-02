import useGetUserData from "./hooks/useGetUserData";
import LawyerDashboard from "./LawyerDashboard";
import ClientDashboard from "./ClientDashboard";

const Dashboard = () => {
  const { email, role } = useGetUserData();

  return <>{role === "lawyer" ? <LawyerDashboard email={email} /> : <ClientDashboard email={email} />}</>;
};

export default Dashboard;
