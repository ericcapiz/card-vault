import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { AuthModal } from "@/components/AuthModal/AuthModal";
import { logout } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import type { AppDispatch } from "@/store/store";
import { AccountCircle } from "@mui/icons-material";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.primary.main,
  boxShadow: "none",
  borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
}));

const NavLink = styled(Link)(({ theme }) => ({
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

const StyledButton = styled(Button)(({ theme }) => ({
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

export const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <NavLink to="/">
            <Typography
              variant="h6"
              component="div"
              sx={{
                letterSpacing: "0.5px",
              }}
            >
              Card Vault
            </Typography>
          </NavLink>

          <Box sx={{ flexGrow: 1 }} />

          <Box>
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  sx={{
                    mr: 2,
                    verticalAlign: "middle",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <AccountCircle sx={{ mr: 1 }} />
                  <Typography>{user?.username.toUpperCase()}</Typography>
                </NavLink>
                <NavLink
                  onClick={handleLogout}
                  sx={{
                    color: "white",
                    textTransform: "none",
                    minWidth: "auto",
                    padding: "6px 16px",
                    height: 36,
                    fontSize: "16px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                    },
                  }}
                >
                  LOGOUT
                </NavLink>
              </>
            ) : (
              <StyledButton
                color="inherit"
                onClick={() => setIsModalOpen(true)}
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
