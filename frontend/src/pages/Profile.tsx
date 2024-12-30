import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import { UploadForm } from "@/components/UploadForm/UploadForm";
import { LoadingOverlay } from "@/components/LoadingOverlay/LoadingOverlay";
import {
  fetchCollections,
  deleteCollection,
  deleteCardFromCollection,
  updateCollection,
  addCardsToCollection,
} from "@/store/slices/collectionSlice";
import type { RootState } from "@/store/store";

interface EditDialogProps {
  open: boolean;
  title: string;
  description: string;
  collectionId: string;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  setSuccessMessage: (message: string) => void;
}

const EditDialog = ({
  open,
  title,
  description,
  collectionId,
  onClose,
  onSave,
  setSuccessMessage,
}: EditDialogProps) => {
  const dispatch = useDispatch();
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFiles(Array.from(event.target.files));
  };

  const handleAddCards = async () => {
    if (files.length === 0) return;

    try {
      setIsProcessing(true);
      await dispatch(addCardsToCollection({ collectionId, files })).unwrap();
      setFiles([]);
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      setSuccessMessage("Cards added successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to add cards:", error);
      setSuccessMessage("Failed to add cards");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Collection</DialogTitle>
      <DialogContent sx={{ position: "relative" }}>
        <LoadingOverlay show={isProcessing} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {/* Collection Details Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              Collection Details
            </Typography>
            <TextField
              label="Title"
              fullWidth
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </Box>

          {/* Add Cards Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              Add New Cards
            </Typography>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            {files.length > 0 && (
              <Button
                variant="contained"
                onClick={handleAddCards}
                sx={{
                  mt: 2,
                  bgcolor: "#9BA5D9",
                  "&:hover": { bgcolor: "#B8C0E9" },
                }}
              >
                Upload {files.length} Card{files.length > 1 ? "s" : ""}
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSave(newTitle, newDescription)}
          sx={{
            color: "#9BA5D9",
            "&:hover": {
              color: "#B8C0E9",
              backgroundColor: "rgba(155, 165, 217, 0.08)",
            },
          }}
        >
          Save Collection Details
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const collections = useSelector(
    (state: RootState) => state.collections?.collections ?? []
  );
  const loading = useSelector(
    (state: RootState) => state.collections?.loading ?? false
  );
  const [editingCollection, setEditingCollection] = useState<{
    _id: string;
    title: string;
    description: string;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchCollections());
  }, [dispatch]);

  const handleDeleteCollection = (collectionId: string) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      dispatch(deleteCollection(collectionId));
    }
  };

  const handleDeleteCard = (collectionId: string, cardIndex: number) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      dispatch(deleteCardFromCollection({ collectionId, cardIndex }));
    }
  };

  const handleEditSave = async (title: string, description: string) => {
    if (editingCollection) {
      try {
        const result = await dispatch(
          updateCollection({
            collectionId: editingCollection._id,
            title,
            description,
          })
        ).unwrap();

        setSuccessMessage("Collection updated successfully");
        setEditingCollection(null);
        setTimeout(() => setSuccessMessage(""), 3000);
        dispatch(fetchCollections());
      } catch (error) {
        console.error("Failed to update collection:", error);
      }
    }
  };

  const handleDownload = async (
    collectionId: string,
    collectionTitle: string
  ) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://card-vault.fly.dev/api/collections/${collectionId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();

      // Use collection title for filename (sanitize it)
      const safeFilename = collectionTitle.replace(/[^a-zA-Z0-9-_]/g, "_");
      const filename = `${safeFilename}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 10,
        px: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: collections.length ? "row" : "column",
          },
          gap: { xs: 2, md: 4 },
          width: "100%",
          maxWidth: "1400px",
          alignItems: "center",
        }}
      >
        {/* Collections Section */}
        {collections.length > 0 && (
          <Box
            sx={{ flex: { xs: "1", md: "2" }, width: "100%", overflow: "auto" }}
          >
            <Typography variant="h5" sx={{ mb: 3 }}>
              Collections ({collections.length})
            </Typography>

            {collections.map((collection) => (
              <Paper key={collection._id} sx={{ mb: 4, overflow: "hidden" }}>
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Tooltip
                      title={collection.description || "No description"}
                      placement="top"
                      arrow
                    >
                      <Typography variant="h6">
                        {collection.title} ({collection.cards.length})
                      </Typography>
                    </Tooltip>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleDownload(collection._id, collection.title)
                      }
                      sx={{
                        color: "#9BA5D9",
                        "&:hover": {
                          backgroundColor: "rgba(155, 165, 217, 0.08)",
                        },
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setEditingCollection({
                          _id: collection._id,
                          title: collection.title,
                          description: collection.description,
                        })
                      }
                      sx={{
                        color: "text.secondary",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCollection(collection._id)}
                      sx={{
                        color: "error.main",
                        "&:hover": {
                          backgroundColor: "rgba(255, 99, 71, 0.08)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Card Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {collection.cards.map((card, index) => (
                        <TableRow key={index}>
                          <TableCell>{card.name}</TableCell>
                          <TableCell>{card.type}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDeleteCard(collection._id, index)
                              }
                              sx={{
                                color: "error.main",
                                "&:hover": {
                                  backgroundColor: "rgba(255, 99, 71, 0.08)",
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ))}
          </Box>
        )}

        {/* Form Section */}
        <Box
          sx={{
            flex: { xs: "1", md: collections.length ? "1" : "auto" },
            width: "100%",
            maxWidth: collections.length ? "none" : "800px",
          }}
        >
          <UploadForm />
        </Box>

        {/* Edit Dialog */}
        {editingCollection && (
          <EditDialog
            open={true}
            title={editingCollection.title}
            description={editingCollection.description}
            collectionId={editingCollection._id}
            onClose={() => setEditingCollection(null)}
            onSave={handleEditSave}
            setSuccessMessage={setSuccessMessage}
          />
        )}
      </Box>
    </Box>
  );
};

export default Profile;
