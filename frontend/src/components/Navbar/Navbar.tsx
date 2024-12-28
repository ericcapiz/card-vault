import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.primary.main,
  boxShadow: "none",
  borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
}));

// Temporary flag for demo
const isLoggedIn = false;

export const Navbar = () => {
  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          Card Vault
        </Typography>

        <Box>
          {isLoggedIn ? (
            <Typography sx={{ mr: 2 }}>Hello, Demo</Typography>
          ) : (
            <Button color="inherit">Login / Register</Button>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};
