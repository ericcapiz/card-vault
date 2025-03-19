import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { RootState } from "@/store/store";
import { AuthModal } from "@/components/AuthModal/AuthModal";
import { useState } from "react";

// Define the styled button component
const StyledGetStartedButton = styled(Button)(({ theme }) => ({
  textDecoration: "none",
  color: "#FFFFFF",
  padding: "12px 24px",
  borderRadius: "4px",
  position: "relative",
  display: "inline-block",
  transition: "all 0.3s ease-in-out",
  fontSize: "1.1rem",
  fontWeight: "bold",
  overflow: "hidden",
  background: "linear-gradient(135deg, #2C3E7B 0%, #1A2552 100%)",
  border: "1px solid rgba(255, 215, 0, 0.1)",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(44, 62, 123, 0.1))",
    transform: "translateX(-100%)",
    transition: "transform 0.5s ease-in-out",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent)",
    transform: "translateX(-100%)",
    transition: "transform 0.3s ease-in-out",
  },
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(44, 62, 123, 0.3)",
    background: "linear-gradient(135deg, #4A5D9B 0%, #2C3E7B 100%)",
    border: "1px solid rgba(255, 215, 0, 0.3)",
    color: "#FFD700",
    textShadow: "0 0 8px rgba(255, 215, 0, 0.4)",
    "&::before": {
      transform: "translateX(0)",
    },
    "&::after": {
      transform: "translateX(100%)",
    },
  },
  "&:active": {
    transform: "translateY(1px)",
    boxShadow: "0 4px 10px rgba(44, 62, 123, 0.2)",
  },
  "&.MuiButton-outlined": {
    background: "transparent",
    border: "1px solid rgba(255, 215, 0, 0.3)",
    "&:hover": {
      background: "rgba(44, 62, 123, 0.1)",
      border: "1px solid rgba(255, 215, 0, 0.5)",
    },
  },
}));

interface HeroProps {
  scrollToFeatures?: () => void;
}

export const Hero = ({ scrollToFeatures }: HeroProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isAuthenticated) {
      navigate("/upload");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <Box
      sx={{
        mt: 32,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        textAlign: "center",
        p: 2,
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          background: "linear-gradient(90deg, #FFD700, #FFE44D)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: "0 0 20px rgba(255, 215, 0, 0.2)",
          fontWeight: "bold",
          mb: 2,
        }}
      >
        Card Vault
      </Typography>
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          color: "rgba(255, 255, 255, 0.9)",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        Organize your Yu-Gi-Oh! cards with OCR technology
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <StyledGetStartedButton
          variant="contained"
          size="large"
          onClick={handleButtonClick}
          sx={{ minWidth: 200 }}
        >
          {isAuthenticated ? "Upload Cards" : "Get Started"}
        </StyledGetStartedButton>

        {!isAuthenticated && scrollToFeatures && (
          <StyledGetStartedButton
            variant="outlined"
            size="large"
            onClick={scrollToFeatures}
            sx={{ minWidth: 200 }}
          >
            Learn More
          </StyledGetStartedButton>
        )}
      </Box>

      <AuthModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};

export default Hero;
