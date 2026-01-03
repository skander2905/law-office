import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Event as CalendarIcon,
  Person as UserIcon,
} from "@mui/icons-material";

interface CaseData {
  id: string;
  caseNumber: string;
  caseType: string;
  status: string;
  attorney: string;
  nextHearing: string;
  description: string;
}

interface CaseOverviewProps {
  caseData: CaseData;
  loading?: boolean;
}

const CaseOverview = ({ caseData, loading }: CaseOverviewProps) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Closed":
        return "default";
      case "Pending":
        return "warning";
      default:
        return "info";
    }
  };

  return (
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
          <Chip label={caseData.status} color={getStatusColor(caseData.status)} />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Case #{caseData.caseNumber}
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Case Type
            </Typography>
            <Typography variant="body1">{caseData.caseType}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Assigned Attorney
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <UserIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body1">{caseData.attorney}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Next Hearing
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body1">{caseData.nextHearing}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Case Status
            </Typography>
            <Typography variant="body1">{caseData.status}</Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="caption" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1">{caseData.description}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CaseOverview;

