import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  login,
  register,
  toggleAuthMode,
  clearError,
} from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import type { AppDispatch } from "@/store/store";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isLoginMode } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleClose = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoginMode) {
      const result = await dispatch(
        login({
          username: formData.username,
          password: formData.password,
        })
      );

      if (result.type === "auth/login/fulfilled") {
        setFormData({ username: "", email: "", password: "" });
        handleClose();
      } else {
        // Clear error after 3 seconds
        setTimeout(() => {
          dispatch(clearError());
        }, 3000);
      }
    } else {
      const result = await dispatch(register(formData));
      if (result.type === "auth/register/fulfilled") {
        setFormData({ username: "", email: "", password: "" });
        handleClose();
      } else {
        // Clear error after 3 seconds
        setTimeout(() => {
          dispatch(clearError());
        }, 3000);
      }
    }
  };

  const handleModeToggle = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
    });
    dispatch(toggleAuthMode());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(0, 0, 0, 0.2)", // Dark background for input
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.23)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(255, 255, 255, 0.4)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#9BA5D9",
      },
      input: {
        color: "#fff",
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
      "&.Mui-focused": {
        color: "#9BA5D9",
      },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
        },
      }}
    >
      <DialogTitle align="center">
        {isLoginMode ? "Login" : "Create Account"}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          autoComplete="off"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: 2,
          }}
        >
          <TextField
            required
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="off"
            sx={textFieldSx}
          />

          {!isLoginMode && (
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              sx={textFieldSx}
            />
          )}

          <TextField
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            sx={textFieldSx}
          />

          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isLoginMode ? (
              "Login"
            ) : (
              "Register"
            )}
          </Button>

          <Button
            variant="text"
            onClick={handleModeToggle}
            sx={{
              mt: 1,
              color: "#9BA5D9",
              "&:hover": {
                color: "#B8C0E9",
                background: "rgba(155, 165, 217, 0.08)",
              },
              textTransform: "none",
              fontSize: "0.9rem",
            }}
          >
            {isLoginMode
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
