import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Card {
  name: string;
  type: string;
}

interface Collection {
  _id: string;
  title: string;
  description: string;
  cards: Card[];
}

interface CollectionState {
  collections: Collection[];
  loading: boolean;
  error: string | null;
}

interface UpdateCollectionData {
  collectionId: string;
  title: string;
  description?: string;
}

interface AddCardsData {
  collectionId: string;
  files: File[];
}

const initialState: CollectionState = {
  collections: [],
  loading: false,
  error: null,
};

export const fetchCollections = createAsyncThunk(
  "collections/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://card-vault.fly.dev/api/collections",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch collections");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCollection = createAsyncThunk(
  "collections/delete",
  async (collectionId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://card-vault.fly.dev/api/collections/${collectionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete collection");
      return collectionId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCardFromCollection = createAsyncThunk(
  "collections/deleteCard",
  async (
    {
      collectionId,
      cardIndex,
    }: {
      collectionId: string;
      cardIndex: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://card-vault.fly.dev/api/collections/${collectionId}/cards/${cardIndex}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete card");
      const updatedCollection = await response.json();
      return { collectionId, updatedCollection };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCollection = createAsyncThunk(
  "collections/update",
  async (
    { collectionId, title, description }: UpdateCollectionData,
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://card-vault.fly.dev/api/collections/${collectionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description }),
        }
      );

      if (!response.ok) throw new Error("Failed to update collection");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCardsToCollection = createAsyncThunk(
  "collections/addCards",
  async ({ collectionId, files }: AddCardsData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const ocrResponse = await fetch(
        "https://card-vault.fly.dev/api/batches/process",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!ocrResponse.ok) {
        throw new Error("Failed to process images");
      }

      const processedData = await ocrResponse.json();

      const addResponse = await fetch(
        `https://card-vault.fly.dev/api/collections/${collectionId}/cards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cards: processedData.cards }),
        }
      );

      if (!addResponse.ok) {
        const error = await addResponse.text();
        throw new Error(error);
      }
      return await addResponse.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const collectionSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    clearCollections: (state) => {
      state.collections = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.collections = state.collections.filter(
          (c) => c._id !== action.payload
        );
      })
      .addCase(deleteCardFromCollection.fulfilled, (state, action) => {
        const index = state.collections.findIndex(
          (c) => c._id === action.payload.collectionId
        );
        if (index !== -1) {
          state.collections[index] = action.payload.updatedCollection;
        }
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        const index = state.collections.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.collections[index] = action.payload;
        }
      })
      .addCase(addCardsToCollection.fulfilled, (state, action) => {
        const index = state.collections.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.collections[index] = action.payload;
        }
      });
  },
});

export const { clearCollections } = collectionSlice.actions;
export default collectionSlice.reducer;
