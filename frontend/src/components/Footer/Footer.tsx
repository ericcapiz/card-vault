import { Box, Typography, Link, Stack } from "@mui/material";
import { GitHub, Language, Api } from "@mui/icons-material";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        background: "linear-gradient(90deg, #151B2E, #2C3E7B)",
        borderTop: "1px solid rgba(255, 215, 0, 0.1)",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Stack spacing={1} alignItems="center">
        <Typography variant="body2" color="text.secondary" align="center">
          {"© "}
          <Link
            color="inherit"
            href="/"
            sx={{
              textDecoration: "none",
              transition: "all 0.3s ease",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                width: "100%",
                height: "2px",
                bottom: -2,
                left: 0,
                background: "linear-gradient(90deg, #FFD700, transparent)",
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.3s ease",
              },
              "&:hover": {
                color: "#FFD700",
                textShadow: "0 0 8px rgba(255, 215, 0, 0.4)",
                "&::after": {
                  transform: "scaleX(1)",
                },
              },
            }}
          >
            Card Vault
          </Link>{" "}
          {new Date().getFullYear()}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          Developed by{" "}
          <Link
            color="inherit"
            href="https://www.ericcapiz.com/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: "none",
              transition: "all 0.3s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              position: "relative",
              px: 0.5,
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                border: "1px solid transparent",
                borderRadius: "4px",
                transition: "border-color 0.3s ease",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                width: "100%",
                height: "2px",
                bottom: -2,
                left: 0,
                background: "linear-gradient(90deg, #FFD700, transparent)",
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.3s ease",
              },
              "&:hover": {
                color: "#FFD700",
                textShadow: "0 0 8px rgba(255, 215, 0, 0.4)",
                "&::before": {
                  borderColor: "rgba(255, 215, 0, 0.3)",
                },
                "&::after": {
                  transform: "scaleX(1)",
                },
              },
            }}
          >
            <Language fontSize="small" />
            Eric Capiz
          </Link>
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          Powered by{" "}
          <Link
            color="inherit"
            href="https://ygoprodeck.com/api-guide/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: "none",
              transition: "all 0.3s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              position: "relative",
              px: 0.5,
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                border: "1px solid transparent",
                borderRadius: "4px",
                transition: "border-color 0.3s ease",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                width: "100%",
                height: "2px",
                bottom: -2,
                left: 0,
                background: "linear-gradient(90deg, #FFD700, transparent)",
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.3s ease",
              },
              "&:hover": {
                color: "#FFD700",
                textShadow: "0 0 8px rgba(255, 215, 0, 0.4)",
                "&::before": {
                  borderColor: "rgba(255, 215, 0, 0.3)",
                },
                "&::after": {
                  transform: "scaleX(1)",
                },
              },
            }}
          >
            <Api fontSize="small" />
            YGOPRODeck API
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
};
