import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login } from '../services/api';

interface AuthState {
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  rememberMe: boolean;
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

// LOGIN Création de l'action thunk pour la connexion
export const loginUser = createAsyncThunk<
  string,
  LoginArgs,
  { rejectValue: LoginError }
>('auth/login', async ({ email, password, rememberMe }, thunkAPI) => {
  console.log(rememberMe);
  try {
    const response = await login(email, password);
    // Enregistrement de la valeur de rememberMe dans le store via l'action setRememberMe
    thunkAPI.dispatch(setRememberMe(rememberMe));
    return response.body.token;
  } catch (error) {
    const err = error as Error;
    return thunkAPI.rejectWithValue({ message: err.message });
  }
});

// SET REMEMBER ME Création de l'action pour la gestion du bouton "Se souvenir de moi"
export const setRememberMe = createAction<boolean>('auth/setRememberMe');

// State initial
const initialState: AuthState = {
  token:
    localStorage.getItem('token') || sessionStorage.getItem('token') || null,
  status: 'idle',
  error: null,
  rememberMe: false,
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setRememberMe, (state, action) => {
        state.rememberMe = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload;
        if (state.rememberMe) {
          localStorage.setItem('token', action.payload);
        } else {
          sessionStorage.setItem('token', action.payload);
        }
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        if (action.payload) {
          state.error = action.payload.message;
        }
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
