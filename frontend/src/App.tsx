import { Box, Typography } from "@mui/material";
import { Navbar } from "@/components/Navbar/Navbar";

function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <Box component="main" sx={{ mt: 8, p: 3 }}>
        <Typography variant="h4">Welcome to Card Vault</Typography>
      </Box>
    </Box>
  );
}

export default App;
