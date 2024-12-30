import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface Card {
  name: string;
  type: string;
}

interface UploadState {
  batches: Card[];
  isProcessing: boolean;
  currentBatchError: string | null;
  processingError: string | null;
  batchGroupId: string | null;
}

const initialState: UploadState = {
  batches: [],
  isProcessing: false,
  currentBatchError: null,
  processingError: null,
  batchGroupId: null,
};

export const processImageBatch = createAsyncThunk(
  "upload/processImageBatch",
  async (files: File[], { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const state = getState() as { upload: UploadState };
      const batchGroupId = state.upload.batchGroupId || uuidv4();
      formData.append("batchGroupId", batchGroupId);

      const response = await fetch("https://card-vault.fly.dev/api/batches", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process images");
      }

      const data = await response.json();
      return { cards: data.cards, batchGroupId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCardFromBatch = createAsyncThunk(
  "upload/deleteCardFromBatch",
  async (
    { batchGroupId, cardIndex }: { batchGroupId: string; cardIndex: number },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `https://card-vault.fly.dev/api/batches/${batchGroupId}/cards/${cardIndex}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete card");
      }

      const data = await response.json();
      return data.cards;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    clearBatches: (state) => {
      state.batches = [];
      state.batchGroupId = null;
    },
    removeBatch: (state, action) => {
      state.batches = state.batches.filter(
        (_, index) => index !== action.payload
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
        state.batches = action.payload.cards;
        state.batchGroupId = action.payload.batchGroupId;
      })
      .addCase(processImageBatch.rejected, (state, action) => {
        state.isProcessing = false;
        state.currentBatchError = action.payload as string;
      })
      .addCase(deleteCardFromBatch.fulfilled, (state, action) => {
        state.batches = action.payload;
      })
      .addCase(deleteCardFromBatch.rejected, (state, action) => {
        state.currentBatchError = action.payload as string;
      });
  },
});

export const { clearBatches, removeBatch } = uploadSlice.actions;
export default uploadSlice.reducer;
