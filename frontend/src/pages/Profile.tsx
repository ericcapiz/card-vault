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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFiles(Array.from(event.target.files));
  };

  const handleAddCards = async () => {
    if (files.length === 0) return;

    try {
      await dispatch(addCardsToCollection({ collectionId, files })).unwrap();
      setFiles([]);
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Show success message for adding cards
      setSuccessMessage("Cards added successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to add cards:", error);
      setSuccessMessage("Failed to add cards");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await onSave(newTitle, newDescription);
      // Don't close the dialog here - let the parent handle it
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Collection</DialogTitle>
      <DialogContent>
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

        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
            Add New Cards
          </Typography>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
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
  const [addingCardsTo, setAddingCardsTo] = useState<string | null>(null);
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
    console.log("EditingCollection:", editingCollection);

    if (editingCollection) {
      try {
        const result = await dispatch(
          updateCollection({
            collectionId: editingCollection._id,
            title,
            description,
          })
        ).unwrap();

        console.log("Update result:", result);

        setSuccessMessage("Collection updated successfully");
        setEditingCollection(null);
        setTimeout(() => setSuccessMessage(""), 3000);
        dispatch(fetchCollections());
      } catch (error) {
        console.error("Failed to update collection:", error);
      }
    }
  };

  const handleDownload = (collectionId: string) => {
    window.open(
      `https://card-vault.fly.dev/api/collections/${collectionId}/download`,
      "_blank"
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 2, md: 4 },
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Success Message */}
      {successMessage && (
        <Box
          sx={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "success.main",
            color: "white",
            p: 2,
            borderRadius: 1,
            zIndex: 9999,
          }}
        >
          {successMessage}
        </Box>
      )}

      {/* Collections Section */}
      <Box
        sx={{
          flex: { xs: "1", md: "2" },
          width: "100%",
          overflow: "auto",
        }}
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
                  onClick={() => handleDownload(collection._id)}
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

      {/* Form Section */}
      <Box
        sx={{
          flex: { xs: "1", md: "1" },
          width: "100%",
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
  );
};

export default Profile;
