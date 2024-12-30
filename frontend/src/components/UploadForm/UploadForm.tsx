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
import { fetchCollections } from "@/store/slices/collectionSlice";
import api from "@/store/services/api";

interface UploadFormProps {
  isAddingToCollection?: boolean;
  collectionId?: string;
  onSuccess?: () => void;
}

export const UploadForm = ({
  isAddingToCollection = false,
  collectionId,
  onSuccess,
}: UploadFormProps) => {
  const dispatch = useDispatch();
  const { isProcessing, batches, currentBatchError, batchGroupId } =
    useSelector((state: RootState) => state.upload);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newCollectionId, setNewCollectionId] = useState<string | null>(null);

  // Clear success message after 10 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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

  const handleCreateOrUpdate = async () => {
    if (!batchGroupId || batches.length === 0) return;

    try {
      const url = isAddingToCollection
        ? `/api/collections/${collectionId}/cards`
        : "/api/collections";

      const response = await api.post(
        url,
        isAddingToCollection
          ? { cards: batches[0].cards }
          : { title, description, batchGroupId }
      );

      // Clear form
      setTitle("");
      setDescription("");
      dispatch(clearBatches());

      // Refresh collections list
      dispatch(fetchCollections());

      // Show success message
      setSuccessMessage(
        "Collection created successfully! You can download it from the collections table."
      );

      // Set new collection ID for download link
      if (response.data?._id) {
        setNewCollectionId(response.data._id);
      }

      // Notify parent of success
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)", // Full height minus navbar height
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 1,
          maxWidth: 800,
          width: "100%",
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
          {!isAddingToCollection && (
            <>
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
            </>
          )}

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

          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}
          >
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
              onClick={handleCreateOrUpdate}
              disabled={!batchGroupId || batches.length === 0 || !title}
              sx={{ flex: 1 }}
            >
              {isAddingToCollection
                ? "Add Cards"
                : `Create Collection (${batches.length} cards)`}
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

          {successMessage && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography color="success.main">{successMessage}</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
