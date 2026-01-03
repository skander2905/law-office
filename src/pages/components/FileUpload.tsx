import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Description as FileTextIcon,
} from "@mui/icons-material";

interface DocumentFile {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  fileurl: string;
}

interface FileUploadProps {
  documents: DocumentFile[];
  onUpload: (file: File) => Promise<{ success: boolean; error?: string }>;
}

const FileUpload = ({ documents, onUpload }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const result = await onUpload(file);

    if (!result.success) {
      setUploadError(result.error || "Failed to upload file");
    }

    setUploading(false);
    // Reset file input
    e.target.value = "";
  };

  return (
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
            borderColor: uploading ? "primary.main" : "divider",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: uploading ? "not-allowed" : "pointer",
            "&:hover": {
              borderColor: uploading ? "primary.main" : "text.secondary",
            },
            transition: "border-color 0.2s",
            opacity: uploading ? 0.6 : 1,
          }}
          component="label"
        >
          {uploading ? (
            <>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="body1">Uploading...</Typography>
            </>
          ) : (
            <>
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
            </>
          )}
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            disabled={uploading}
          />
        </Paper>

        {uploadError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {uploadError}
          </Alert>
        )}

        <Alert severity="info" sx={{ mt: 3 }}>
          <strong>Note:</strong> All uploaded documents will be reviewed by
          your attorney. Please ensure files are clearly named and relevant to
          your case.
        </Alert>

        {documents.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Recently Uploaded
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {documents.slice(0, 3).map((file) => (
                <Paper
                  key={file.id}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <FileTextIcon sx={{ fontSize: 24, color: "#3b82f6" }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">{file.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {file.size} • {file.uploadDate}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;

