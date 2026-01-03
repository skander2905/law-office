import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { Scale as ScaleIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useCaseData } from "./hooks/useCaseData";
import { useDocuments } from "./hooks/useDocuments";
import { useActivities } from "./hooks/useActivities";
import CaseOverview from "./components/CaseOverview";
import RecentActivity from "./components/RecentActivity";
import DocumentsList from "./components/DocumentsList";
import FileUpload from "./components/FileUpload";

const ClientDashboard = ({ email: userEmail }: { email: string }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [userId, setUserId] = useState<string>("");

  // Get user ID on mount
  useEffect(() => {
    const getUserId = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setUserId(userData.user.id);
      }
    };
    getUserId();
  }, []);

  // Use custom hooks for data fetching
  const { caseData, loading: caseLoading } = useCaseData(userId);
  const {
    documents,
    loading: documentsLoading,
    uploadDocument,
    downloadDocument,
  } = useDocuments(caseData?.id || null);
  const {
    activities,
    loading: activitiesLoading,
    formatActivityDate,
  } = useActivities(caseData?.id || null);

  const loading = caseLoading;

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/");
    }
  };

  const handleFileUpload = async (file: File) => {
    return await uploadDocument(file, userId);
  };

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

  if (!caseData) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <Typography variant="h5">No case found</Typography>
        <Typography variant="body1" color="text.secondary">
          You don't have any active cases yet.
        </Typography>
        <Button variant="outlined" onClick={onLogout}>
          Logout
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
    >
      {/* Header */}
      <AppBar
        position="sticky"
        color="default"
        elevation={1}
        sx={{ bgcolor: "white" }}
      >
        <Toolbar>
          <ScaleIcon sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">Sterling & Associates</Typography>
            <Typography variant="caption" color="text.secondary">
              Client Portal
            </Typography>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              textAlign: "right",
              mr: 2,
            }}
          >
            <Typography variant="body2">{userEmail}</Typography>
            <Typography variant="caption" color="text.secondary">
              Client
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your case and communicate with your attorney
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
          >
            <Tab label="Case Overview" />
            <Tab label="Documents" />
            <Tab label="Upload Files" />
          </Tabs>
        </Box>

        {/* Case Overview Tab */}
        {activeTab === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <CaseOverview caseData={caseData} loading={caseLoading} />
            <RecentActivity
              activities={activities}
              loading={activitiesLoading}
              formatActivityDate={formatActivityDate}
            />
          </Box>
        )}

        {/* Documents Tab */}
        {activeTab === 1 && (
          <DocumentsList
            documents={documents}
            loading={documentsLoading}
            onDownload={downloadDocument}
          />
        )}

        {/* Upload Files Tab */}
        {activeTab === 2 && (
          <FileUpload documents={documents} onUpload={handleFileUpload} />
        )}
      </Container>
    </Box>
  );
};

export default ClientDashboard;
