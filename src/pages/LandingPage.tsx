import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  AppBar,
  Toolbar,
  Paper,
} from "@mui/material";
import {
  Scale as ScaleIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);

  const loginUser = async () => {
    setSignInLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setSignInLoading(false)
      } else {
        setSignInLoading(false)
        navigate("/dashboard");
      }
    } catch (error) {
      setSignInLoading(false)
      setError("An error occurred. Please try again.");
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="static"
        color="default"
        elevation={1}
        sx={{ bgcolor: "white" }}
      >
        <Toolbar>
          <ScaleIcon sx={{ mr: 2, color: "text.primary" }} />
          <Box>
            <Typography variant="h6" color="text.primary">
              Sterling & Associates
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Legal Services
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          position: "relative",
          bgcolor: "#1e293b",
          color: "white",
          py: 10,
          backgroundImage:
            "url(https://images.unsplash.com/photo-1758310999515-645097b709db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBvZmZpY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY3MDE4Nzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(30, 41, 59, 0.75)",
          },
        }}
      >
        <Container sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h3" gutterBottom>
            Welcome to Your Legal Portal
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
            Secure access to your case information and legal documents
          </Typography>
        </Container>
      </Box>

      <Box sx={{ flex: 1, bgcolor: "#f8fafc", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Features Section */}
            <Grid size={6}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom color="text.primary">
                  Portal Access
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Access your case files, upload documents, and stay informed
                  about your legal matters
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: "#dbeafe",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <PersonIcon sx={{ color: "#2563eb" }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Case Information
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          View all details about your case and upcoming hearings
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: "#dbeafe",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <CheckCircleIcon sx={{ color: "#2563eb" }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Document Upload
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Securely upload documents directly to your case file
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: "#dbeafe",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <ScaleIcon sx={{ color: "#2563eb" }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Track Progress
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monitor your case status and activity in real-time
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            <Grid size={6}>
              <Card elevation={3}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography variant="h5" gutterBottom>
                      Sign In
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Access your portal with your credentials
                    </Typography>
                  </Box>

                  <form onSubmit={handleSubmit}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      {error && <Alert severity="error">{error}</Alert>}

                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <EmailIcon
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <LockIcon sx={{ mr: 1, color: "text.secondary" }} />
                          ),
                        }}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        loading={signInLoading}
                      >
                        Sign In
                      </Button>
                    </Box>
                  </form>

                  <Paper
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      textAlign="center"
                      display="block"
                    >
                      <strong>New client?</strong> Your attorney will provide
                      login credentials.
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#1e293b", color: "white", py: 4 }}>
        <Container>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            © 2024 Sterling & Associates. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
