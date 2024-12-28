import { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Link } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    sm: 400,
  },
  bgcolor: "background.paper",
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="auth-modal-title">
      <Box sx={modalStyle}>
        <Typography
          id="auth-modal-title"
          variant="h5"
          component="h2"
          align="center"
          mb={3}
        >
          {isLogin ? "Login" : "Register"}
        </Typography>

        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#9BA5D9",
                },
              },
              "& label.Mui-focused": {
                color: "#9BA5D9",
              },
            }}
          />

          {!isLogin && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#9BA5D9",
                  },
                },
                "& label.Mui-focused": {
                  color: "#9BA5D9",
                },
              }}
            />
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#9BA5D9",
                },
              },
              "& label.Mui-focused": {
                color: "#9BA5D9",
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLogin ? "Login" : "Register"}
          </Button>

          <Box textAlign="center">
            <Link
              component="button"
              variant="body2"
              onClick={() => setIsLogin(!isLogin)}
              sx={{
                cursor: "pointer",
                color: "#9BA5D9",
                "&:hover": {
                  color: "#B8C0E9",
                  textDecoration: "underline",
                },
                opacity: 1,
                fontSize: "0.9rem",
                letterSpacing: "0.5px",
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
