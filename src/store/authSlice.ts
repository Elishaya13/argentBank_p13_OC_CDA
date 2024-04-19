import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login } from '../services/api';

interface AuthState {
  token: string | null;
  error: string | null;
  rememberMe: boolean;
  loading: boolean;
}

// Définition des types pour les arguments de la fonction asynchrone
interface LoginArgs {
  email: string;
  password: string;
}

interface LoginError {
  message: string;
}

// LOGIN Création de l'action thunk pour la connexion
export const loginUser = createAsyncThunk<
  string,
  LoginArgs,
  { rejectValue: LoginError }
>('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const response = await login(email, password);
    return response.body.token;
  } catch (error) {
    const err = error as Error;
    return thunkAPI.rejectWithValue({ message: err.message });
  }
});

// State initial
const initialState: AuthState = {
  token:
    localStorage.getItem('token') || sessionStorage.getItem('token') || null,
  error: null,
  rememberMe: false,
  loading: false,
};

// SLICE pour la gestion de l'authentification
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      state.token = null;
      state.error = null;
      state.rememberMe = false;
    },
    rememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload;
        console.log(state.rememberMe);
        if (state.rememberMe) {
          localStorage.setItem('token', action.payload);
        } else {
          sessionStorage.setItem('token', action.payload);
        }
        state.error = null;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        }
      });
  },
});

export const { logout, rememberMe } = authSlice.actions;

export default authSlice.reducer;
