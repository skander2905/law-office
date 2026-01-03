import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Box,
} from "@mui/material";
import { FiberManualRecord as DotIcon } from "@mui/icons-material";

interface Activity {
  id: string;
  activitytype: string;
  title: string;
  description: string;
  created_at: string;
}

interface RecentActivityProps {
  activities: Activity[];
  loading?: boolean;
  formatActivityDate: (dateString: string) => string;
}

const RecentActivity = ({
  activities,
  loading,
  formatActivityDate,
}: RecentActivityProps) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        {activities.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No recent activity
          </Typography>
        ) : (
          <List>
            {activities.map((activity, index) => (
              <ListItem
                key={activity.id}
                sx={{
                  borderBottom:
                    index < activities.length - 1 ? 1 : 0,
                  borderColor: "divider",
                }}
              >
                <ListItemIcon>
                  <DotIcon sx={{ color: "#3b82f6", fontSize: 12 }} />
                </ListItemIcon>
                <ListItemText
                  primary={activity.title}
                  secondary={`${activity.description} - ${formatActivityDate(
                    activity.created_at
                  )}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;

