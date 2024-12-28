import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { LoadingOverlay } from "@/components/LoadingOverlay/LoadingOverlay";
import { useState } from "react";

export const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleUploadBatch = () => {
    console.log("Upload batch clicked");
  };

  const handleProcessCollection = () => {
    console.log("Process collection clicked");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 1,
        maxWidth: 800,
        mx: "auto",
        position: "relative",
      }}
    >
      <LoadingOverlay show={isSubmitting} />
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
        Create New Collection
      </Typography>

      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <TextField
          required
          fullWidth
          label="Title"
          placeholder="Enter collection title"
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#9BA5D9",
              },
            },
            "& label.Mui-focused": {
              color: "#9BA5D9",
            },
          }}
        />

        <TextField
          fullWidth
          label="Description"
          placeholder="Enter collection description"
          multiline
          rows={3}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#9BA5D9",
              },
            },
            "& label.Mui-focused": {
              color: "#9BA5D9",
            },
          }}
        />

        <Box
          sx={{
            border: "2px dashed #9BA5D9",
            borderRadius: 1,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "rgba(155, 165, 217, 0.1)",
            },
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: "#9BA5D9", mb: 2 }} />
          <Typography gutterBottom>Drag and drop your images here</Typography>
          <Typography variant="body2" color="text.secondary">
            or click to select files
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Maximum 10 images allowed
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadBatch}
            disabled={files.length === 0}
          >
            Upload Batch
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleProcessCollection}
            disabled={files.length === 0}
          >
            Process Collection
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
