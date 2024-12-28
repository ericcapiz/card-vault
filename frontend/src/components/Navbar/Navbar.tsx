import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AuthModal } from "@/components/AuthModal/AuthModal";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.primary.main,
  boxShadow: "none",
  borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
}));

export const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoggedIn = false; // Temporary flag for demo

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              letterSpacing: "0.5px",
            }}
          >
            Card Vault
          </Typography>

          <Box>
            {isLoggedIn ? (
              <Typography sx={{ mr: 2 }}>Hello, Demo</Typography>
            ) : (
              <Button color="inherit" onClick={() => setIsModalOpen(true)}>
                Login / Register
              </Button>
            )}
          </Box>
        </Toolbar>
      </StyledAppBar>

      <AuthModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
