import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { RootState } from "../store/store";
import { AuthModal } from "../components/AuthModal/AuthModal";
import { useState } from "react";

const Home = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/upload" />;
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        textAlign: "center",
        p: 2,
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        Card Vault
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
        Organize your Yu-Gi-Oh! cards with OCR technology
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => setIsModalOpen(true)}
        sx={{ minWidth: 200 }}
      >
        Get Started
      </Button>

      <AuthModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};

export default Home;
