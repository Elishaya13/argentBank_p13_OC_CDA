import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { get, updateUser } from '../services/api';

interface UserState {
  user: User | null;
  isEditing: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface LoginError {
  message: string;
}
interface User {
  firstName: string;
  lastName: string;
}

// GET USER Création de l'action thunk pour la récupération des données de l'utilisateur
export const getUser = createAsyncThunk<
  User,
  string,
  { rejectValue: LoginError }
>('auth/getUser', async (token, thunkAPI) => {
  try {
    const response = await get(token);
    return response.body;
  } catch (error) {
    const err = error as Error;
    return thunkAPI.rejectWithValue({ message: err.message });
  }
});

// PUT USER Création de l'action thunk pour la mise à jour des données de l'utilisateur
export const putUser = createAsyncThunk<
  User,
  { token: string; user: { firstName: string; lastName: string } },
  { rejectValue: LoginError }
>('auth/putUser', async ({ token, user }, thunkAPI) => {
  try {
    const response = await updateUser(token, user);
    return response.body;
  } catch (error) {
    const err = error as Error;
    return thunkAPI.rejectWithValue({ message: err.message });
  }
});

// State initial
const initialState: UserState = {
  user: null,
  isEditing: false,
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleEditing: (state) => {
      state.isEditing = !state.isEditing;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        if (action.payload) {
          state.error = action.payload.message;
        }
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(putUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(putUser.rejected, (state, action) => {
        state.status = 'failed';
        if (action.payload) {
          state.error = action.payload.message;
        }
      })
      .addCase(putUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
      });
  },
});

export const { toggleEditing } = userSlice.actions;
export default userSlice.reducer;
