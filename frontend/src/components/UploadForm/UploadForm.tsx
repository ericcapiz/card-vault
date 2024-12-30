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
  Link,
} from "@mui/material";
import { LoadingOverlay } from "../LoadingOverlay/LoadingOverlay";
import {
  processImageBatch,
  removeBatch,
  clearBatches,
  deleteCardFromBatch,
} from "@/store/slices/uploadSlice";
import type { RootState } from "@/store/store";
import DeleteIcon from "@mui/icons-material/Delete";

export const UploadForm = () => {
  const dispatch = useDispatch();
  const { isProcessing, batches, currentBatchError, batchGroupId } =
    useSelector((state: RootState) => state.upload);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newCollectionId, setNewCollectionId] = useState<string | null>(null);

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

  const handleCreateCollection = async () => {
    if (!batchGroupId || batches.length === 0) return;

    try {
      const response = await fetch(
        "https://card-vault.fly.dev/api/collections",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            batchGroupId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create collection");

      const collection = await response.json();
      setSuccessMessage(`Collection created successfully: `);
      setNewCollectionId(collection._id);

      // Clear form after successful creation
      setTitle("");
      setDescription("");
      dispatch(clearBatches());

      // Clear success message after 10 seconds
      setTimeout(() => {
        setSuccessMessage(null);
        setNewCollectionId(null);
      }, 10000);
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
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
          autoComplete="off"
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

          <Button
            variant="contained"
            onClick={handleCreateCollection}
            disabled={!batchGroupId || batches.length === 0 || !title}
            sx={{ flex: 1 }}
          >
            Create Collection ({batches.length} cards)
          </Button>
        </Box>

        {/* Processed Cards List */}
        {batches.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Processed Cards
            </Typography>
            <List>
              {batches.map((card, index) => (
                <ListItem
                  key={index}
                  sx={{
                    bgcolor: "background.paper",
                    mb: 1,
                    borderRadius: 1,
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => {
                        if (batchGroupId) {
                          dispatch(
                            deleteCardFromBatch({
                              batchGroupId,
                              cardIndex: index,
                            })
                          );
                        }
                      }}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <Box>
                    <Typography variant="body1">{card.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.type}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {successMessage && newCollectionId && (
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography color="success.main">
              {successMessage}
              <Link
                component="button"
                onClick={() =>
                  window.open(
                    `https://card-vault.fly.dev/api/collections/${newCollectionId}/download`,
                    "_blank"
                  )
                }
                sx={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "#9BA5D9",
                  "&:hover": {
                    color: "#B8C0E9",
                  },
                }}
              >
                {title || "collection"} (click to download spreadsheet)
              </Link>
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
