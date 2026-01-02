import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Chip,
  Grid,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from "@mui/material";
import {
  Scale as ScaleIcon,
  Logout as LogoutIcon,
  CloudUpload as UploadIcon,
  Description as FileTextIcon,
  Event as CalendarIcon,
  Person as UserIcon,
  FiberManualRecord as DotIcon,
} from "@mui/icons-material";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

interface CaseFile {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
}

const ClientDashboard = ({ email: userEmail }: { email: string }) => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<CaseFile[]>([
    {
      id: "1",
      name: "Contract_Agreement.pdf",
      uploadDate: "2024-12-15",
      size: "2.3 MB",
    },
    {
      id: "2",
      name: "Evidence_Document.pdf",
      uploadDate: "2024-12-10",
      size: "1.8 MB",
    },
  ]);

  const onLogout = () => {
    // Implement logout logic here
    const signOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error(error);
      } else {
        navigate("/");
      }
    };
    signOut();
  };

  const [activeTab, setActiveTab] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFile: CaseFile = {
        id: Date.now().toString(),
        name: file.name,
        uploadDate: new Date().toISOString().split("T")[0],
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      };
      setFiles([newFile, ...files]);
    }
  };

  // Mock case data
  const caseData = {
    caseNumber: "CA-2024-1157",
    caseType: "Civil Litigation",
    status: "Active",
    attorney: "Sarah Mitchell",
    nextHearing: "2025-01-15",
    description:
      "Contract dispute regarding service agreement terms and compensation.",
  };

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
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Case Information</Typography>
                  <Chip label={caseData.status} color="success" />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Case #{caseData.caseNumber}
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid size={12}>
                    <Typography variant="caption" color="text.secondary">
                      Case Type
                    </Typography>
                    <Typography variant="body1">{caseData.caseType}</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="caption" color="text.secondary">
                      Assigned Attorney
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <UserIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body1">
                        {caseData.attorney}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="caption" color="text.secondary">
                      Next Hearing
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body1">
                        {caseData.nextHearing}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="caption" color="text.secondary">
                      Case Status
                    </Typography>
                    <Typography variant="body1">{caseData.status}</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="caption" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {caseData.description}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  <ListItem sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <ListItemIcon>
                      <DotIcon sx={{ color: "#3b82f6", fontSize: 12 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Document uploaded"
                      secondary="Contract_Agreement.pdf - Dec 15, 2024"
                    />
                  </ListItem>
                  <ListItem sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <ListItemIcon>
                      <DotIcon sx={{ color: "#3b82f6", fontSize: 12 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Hearing scheduled"
                      secondary="Next hearing set for Jan 15, 2025"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DotIcon sx={{ color: "#3b82f6", fontSize: 12 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Case opened"
                      secondary="Case #CA-2024-1157 - Dec 1, 2024"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Documents Tab */}
        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Documents
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                All files related to your case
              </Typography>

              <Box
                sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
              >
                {files.map((file) => (
                  <Paper
                    key={file.id}
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      "&:hover": { bgcolor: "#f8fafc" },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <FileTextIcon sx={{ fontSize: 32, color: "#3b82f6" }} />
                      <Box>
                        <Typography variant="body1">{file.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {file.size} • Uploaded {file.uploadDate}
                        </Typography>
                      </Box>
                    </Box>
                    <Button variant="outlined" size="small">
                      Download
                    </Button>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Upload Files Tab */}
        {activeTab === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Documents
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Add files to your case
              </Typography>

              <Paper
                sx={{
                  mt: 3,
                  p: 6,
                  border: "2px dashed",
                  borderColor: "divider",
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": { borderColor: "text.secondary" },
                  transition: "border-color 0.2s",
                }}
                component="label"
              >
                <UploadIcon
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="body1">
                  <Typography
                    component="span"
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Click to upload
                  </Typography>{" "}
                  or drag and drop
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PDF, DOC, DOCX, PNG, JPG (max 10MB)
                </Typography>
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
              </Paper>

              <Alert severity="info" sx={{ mt: 3 }}>
                <strong>Note:</strong> All uploaded documents will be reviewed
                by your attorney. Please ensure files are clearly named and
                relevant to your case.
              </Alert>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default ClientDashboard;
