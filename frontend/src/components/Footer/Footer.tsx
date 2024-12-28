import { Box, Typography, Link } from "@mui/material";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "background.paper",
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        {"© "}
        <Link
          color="inherit"
          href="/"
          sx={{
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Card Vault
        </Link>{" "}
        {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};
