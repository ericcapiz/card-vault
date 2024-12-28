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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { UploadForm } from "@/components/UploadForm/UploadForm";

// Temporary mock data
const mockCollections = [
  {
    id: 1,
    title: "First Collection",
    cards: [
      { id: 1, name: "Blue-Eyes White Dragon", type: "Monster" },
      { id: 2, name: "Dark Magician", type: "Monster" },
    ],
  },
  {
    id: 2,
    title: "Second Collection",
    cards: [
      { id: 3, name: "Monster Reborn", type: "Spell" },
      { id: 4, name: "Mirror Force", type: "Trap" },
    ],
  },
];

const Profile = () => {
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
          Collections ({mockCollections.length})
        </Typography>

        {mockCollections.map((collection) => (
          <Paper key={collection.id} sx={{ mb: 4, overflow: "hidden" }}>
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
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.08)", // Light hover effect
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 99, 71, 0.08)", // Reddish hover for delete
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
                  {collection.cards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell>{card.name}</TableCell>
                      <TableCell>{card.type}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          sx={{
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
    </Box>
  );
};

export default Profile;
