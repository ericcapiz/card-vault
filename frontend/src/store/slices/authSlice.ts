import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

interface AuthState {
  user: null | { username: string };
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isLoginMode: boolean;
}

// Get persisted data
const token = localStorage.getItem("token");
const userStr = localStorage.getItem("user");
const user = userStr ? JSON.parse(userStr) : null;

const initialState: AuthState = {
  user: user,
  token: token,
  isAuthenticated: !!token && !!user, // Only authenticated if both exist
  isLoading: false,
  error: null,
  isLoginMode: true,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/api/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    credentials: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/api/auth/register", credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    toggleAuthMode: (state) => {
      state.isLoginMode = !state.isLoginMode;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, toggleAuthMode } = authSlice.actions;
export default authSlice.reducer;
