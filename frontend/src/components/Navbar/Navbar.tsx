import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { AuthModal } from "@/components/AuthModal/AuthModal";
import { logout } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import type { AppDispatch } from "@/store/store";
import { AccountCircle, CloudUpload } from "@mui/icons-material";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(90deg, #151B2E, #2C3E7B)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  borderBottom: "1px solid rgba(255, 215, 0, 0.1)",
}));

const NavLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: "inherit",
  padding: "8px 12px",
  borderRadius: "4px",
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  transition: "all 0.3s",
  fontSize: "0.9rem",
  [theme.breakpoints.up("md")]: {
    fontSize: "1rem",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "rgba(255, 215, 0, 0.03)",
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
    background: "linear-gradient(90deg, #FFD700, #2C3E7B, #FFD700)",
    transform: "scaleX(0)",
    opacity: 0,
    transition: "all 0.3s",
  },
  "&:hover": {
    transform: "scale(1.05) translateY(-1px)",
    letterSpacing: "0.5px",
    color: "#FFD700",
    textShadow: "0 0 8px rgba(255, 215, 0, 0.4)",
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

const StyledButton = styled(Button)(({ theme }) => ({
  textDecoration: "none",
  color: "inherit",
  padding: "6px 10px",
  [theme.breakpoints.up("md")]: {
    padding: "8px 12px",
  },
  borderRadius: "4px",
  position: "relative",
  display: "inline-block",
  transition: "all 0.3s",
  background: "rgba(44, 62, 123, 0.3)",
  fontSize: "0.85rem",
  [theme.breakpoints.up("md")]: {
    fontSize: "1rem",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "rgba(255, 215, 0, 0.03)",
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
    background: "linear-gradient(90deg, #FFD700, #2C3E7B, #FFD700)",
    transform: "scaleX(0)",
    opacity: 0,
    transition: "all 0.3s",
  },
  "&:hover": {
    transform: "scale(1.05) translateY(-1px)",
    letterSpacing: "0.5px",
    color: "#FFD700",
    background: "rgba(44, 62, 123, 0.5)",
    textShadow: "0 0 8px rgba(255, 215, 0, 0.4)",
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

export const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar sx={{ minHeight: { xs: 56, md: 64 }, px: { xs: 1, md: 2 } }}>
          <NavLink to="/">
            <Typography
              variant="h6"
              component="div"
              sx={{
                letterSpacing: "0.5px",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #FFD700, #FFE44D)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                textShadow: "0 0 20px rgba(255, 215, 0, 0.2)",
                fontSize: { xs: "1.1rem", md: "1.25rem" },
              }}
            >
              Card Vault
            </Typography>
          </NavLink>

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, md: 2 },
            }}
          >
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/upload"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <CloudUpload
                    sx={{
                      mr: { xs: 0.5, md: 1 },
                      fontSize: { xs: "1.2rem", md: "1.5rem" },
                    }}
                  />
                  {!isMobile && <Typography>Upload</Typography>}
                </NavLink>
                <NavLink
                  to="/profile"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <AccountCircle
                    sx={{
                      mr: { xs: 0.5, md: 1 },
                      fontSize: { xs: "1.2rem", md: "1.5rem" },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: "0.8rem", md: "1rem" },
                      maxWidth: { xs: 80, md: "none" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.username.toUpperCase()}
                  </Typography>
                </NavLink>
                <StyledButton
                  onClick={handleLogout}
                  sx={{
                    minWidth: { xs: "60px", md: "auto" },
                    fontSize: { xs: "0.8rem", md: "1rem" },
                    px: { xs: 1, md: 2 },
                  }}
                >
                  Logout
                </StyledButton>
              </>
            ) : (
              <StyledButton
                onClick={() => setIsModalOpen(true)}
                sx={{
                  fontSize: { xs: "0.8rem", md: "1rem" },
                  px: { xs: 1, md: 2 },
                }}
              >
                Login / Register
              </StyledButton>
            )}
          </Box>
        </Toolbar>
      </StyledAppBar>

      <AuthModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
