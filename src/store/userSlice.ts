import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserProfile, updateUser } from '../services/api';
import { logout } from './authSlice';

interface UserState {
  user: User | null;
  isEditing: boolean;
  error: string | null;
  loading: boolean;
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
    const response = await getUserProfile(token);
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
  error: null,
  loading: false,
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
        state.loading = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload.message;
        }
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(putUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(putUser.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload.message;
        }
      })
      .addCase(putUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(logout, (state) => {
        state.user = null;
      });
  },
});

export const { toggleEditing } = userSlice.actions;
export default userSlice.reducer;
