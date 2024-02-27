import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, get } from '../services/api';

interface AuthState {
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  user: User | null;
}

// Définition des types pour les arguments de la fonction asynchrone
interface LoginArgs {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginError {
  message: string;
}
interface User {
  firstName: string;
  lastName: string;
}

// LOGIN Création de l'action thunk pour la connexion
export const loginUser = createAsyncThunk<
  string,
  LoginArgs,
  { rejectValue: LoginError }
>('auth/login', async ({ email, password, rememberMe }, thunkAPI) => {
  try {
    const response = await login(email, password);
    if (rememberMe) {
      sessionStorage.setItem('token', response.body.token);
    } else {
      localStorage.setItem('token', response.body.token);
    }
    return response.body.token;
  } catch (error) {
    const err = error as Error;
    return thunkAPI.rejectWithValue({ message: err.message });
  }
});

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

// State initial
const initialState: AuthState = {
  token:
    localStorage.getItem('token') || sessionStorage.getItem('token') || null,
  status: 'idle',
  error: null,
  user: null,
};

// Slice pour la gestion de l'authentification
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload;
        localStorage.setItem('token', action.payload);
        state.error = null;
        state.user = { firstName: 'Tony', lastName: 'Stark' };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        if (action.payload) {
          state.error = action.payload.message;
        }
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
