import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { Description as FileTextIcon } from "@mui/icons-material";

interface DocumentFile {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  fileurl: string;
}

interface DocumentsListProps {
  documents: DocumentFile[];
  loading?: boolean;
  onDownload: (fileurl: string, fileName: string) => void;
}

const DocumentsList = ({
  documents,
  loading,
  onDownload,
}: DocumentsListProps) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Documents
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
          Your Documents
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          All files related to your case
        </Typography>

        {documents.length === 0 ? (
          <Box sx={{ mt: 3, textAlign: "center", py: 4 }}>
            <FileTextIcon
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="body1" color="text.secondary">
              No documents uploaded yet
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
          >
            {documents.map((file) => (
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
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onDownload(file.fileurl, file.name)}
                >
                  Download
                </Button>
              </Paper>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsList;

