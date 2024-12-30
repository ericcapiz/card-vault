import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Batch {
  id: string;
  timestamp: number;
  files: File[];
}

interface UploadState {
  batches: Batch[];
  isProcessing: boolean;
  currentBatchError: string | null;
  processingError: string | null;
}

// Get initial batches from localStorage
const initialState: UploadState = {
  batches: [], // We can't store File objects in localStorage
  isProcessing: false,
  currentBatchError: null,
  processingError: null,
};

export const processImageBatch = createAsyncThunk(
  "upload/processImageBatch",
  async (files: File[]) => {
    return { files };
  }
);

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    clearBatches: (state) => {
      state.batches = [];
    },
    removeBatch: (state, action) => {
      state.batches = state.batches.filter(
        (batch) => batch.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processImageBatch.pending, (state) => {
        state.isProcessing = true;
        state.currentBatchError = null;
      })
      .addCase(processImageBatch.fulfilled, (state, action) => {
        state.isProcessing = false;
        const newBatch = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          files: action.payload.files,
        };
        state.batches.push(newBatch);
      })
      .addCase(processImageBatch.rejected, (state, action) => {
        state.isProcessing = false;
        state.currentBatchError =
          action.error.message || "Failed to process batch";
      });
  },
});

export const { clearBatches, removeBatch } = uploadSlice.actions;
export default uploadSlice.reducer;
