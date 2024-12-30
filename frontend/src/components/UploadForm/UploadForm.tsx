import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import { LoadingOverlay } from "../LoadingOverlay/LoadingOverlay";
import { processImageBatch, removeBatch } from "@/store/slices/uploadSlice";
import type { RootState } from "@/store/store";
import DeleteIcon from "@mui/icons-material/Delete";

export const UploadForm = () => {
  const dispatch = useDispatch();
  const { isProcessing, batches, currentBatchError } = useSelector(
    (state: RootState) => state.upload
  );
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 10) {
      alert("Maximum 10 files per batch allowed");
      return;
    }
    setFiles(selectedFiles);
  };

  const handleUploadBatch = async () => {
    if (files.length === 0) return;

    try {
      await dispatch(processImageBatch(files)).unwrap();
      setFiles([]); // Clear files after successful upload
      // Reset file input
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Failed to process batch:", error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (batches.length > 0) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [batches.length]);

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
      <LoadingOverlay show={isProcessing} />
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

        <Box sx={{ mt: 2 }}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginBottom: 2 }}
          />
          {files.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Selected files: {files.length}
            </Typography>
          )}
          {currentBatchError && (
            <Typography
              color="error"
              variant="caption"
              sx={{ display: "block", mt: 1 }}
            >
              {currentBatchError}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
          <Button
            variant="contained"
            onClick={handleUploadBatch}
            disabled={isProcessing || files.length === 0}
            sx={{ flex: 1 }}
          >
            Upload Batch ({files.length} files)
          </Button>

          <Button variant="contained" disabled={true} sx={{ flex: 1 }}>
            Process Collection ({batches.length} batches)
          </Button>
        </Box>

        {batches.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Total images:{" "}
            {batches.reduce((sum, batch) => sum + batch.files.length, 0)}
          </Typography>
        )}
      </Box>

      {/* Batch List */}
      {batches.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Processed Batches
          </Typography>
          <List>
            {batches.map((batch) => (
              <ListItem
                key={batch.id}
                sx={{
                  bgcolor: "background.paper",
                  mb: 1,
                  borderRadius: 1,
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => dispatch(removeBatch(batch.id))}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Box sx={{ width: "100%" }}>
                  <Typography variant="body1">
                    Batch #{batch.id.slice(-4)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {batch.files.length} images •{" "}
                    {new Date(batch.timestamp).toLocaleString()}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {batch.files.map((file, index) => (
                      <Typography
                        key={index}
                        variant="caption"
                        sx={{
                          display: "inline-block",
                          mr: 1,
                          color: "text.secondary",
                        }}
                      >
                        {file.name}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};
