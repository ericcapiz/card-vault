import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { RootState } from "../store/store";
import { AuthModal } from "../components/AuthModal/AuthModal";
import { useState } from "react";

// Define the styled button component
const StyledGetStartedButton = styled(Button)(({ theme }) => ({
  textDecoration: "none",
  color: "inherit",
  padding: "8px 12px",
  borderRadius: "4px",
  position: "relative",
  display: "inline-block",
  transition: "all 0.3s",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "4px",
    transform: "scaleX(0.7) scaleY(0.6)",
    opacity: 0,
    transition: "all 0.3s",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "4px",
    left: "12px",
    right: "12px",
    height: "2px",
    background: "linear-gradient(90deg, #FFD700, #9B4D86, #FFD700)",
    transform: "scaleX(0)",
    opacity: 0,
    transition: "all 0.3s",
  },
  "&:hover": {
    transform: "scale(1.05) translateY(-1px)",
    letterSpacing: "1px",
    color: "#9B4D86",
    textShadow: "0 0 8px rgba(155, 77, 134, 0.4)",
    "&::before": {
      transform: "scale(1)",
      opacity: 1,
    },
    "&::after": {
      transform: "scaleX(1)",
      opacity: 1,
    },
  },
}));

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
      <StyledGetStartedButton
        variant="contained"
        size="large"
        onClick={() => setIsModalOpen(true)}
        sx={{ minWidth: 200 }}
      >
        Get Started
      </StyledGetStartedButton>

      <AuthModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};

export default Home;
