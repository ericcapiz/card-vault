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
} from "@/store/slices/collectionSlice";
import type { RootState } from "@/store/store";

interface EditDialogProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
}

const EditDialog = ({
  open,
  title,
  description,
  onClose,
  onSave,
}: EditDialogProps) => {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Collection</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(newTitle, newDescription)}>Save</Button>
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
    id: string;
    title: string;
    description: string;
  } | null>(null);

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
      await dispatch(
        updateCollection({
          collectionId: editingCollection.id,
          title,
          description,
        })
      );
      setEditingCollection(null);
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
              <Typography variant="h6">{collection.title}</Typography>
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
                      id: collection._id,
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
          onClose={() => setEditingCollection(null)}
          onSave={handleEditSave}
        />
      )}
    </Box>
  );
};

export default Profile;
