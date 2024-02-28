import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, get, updateUser } from '../services/api';

interface AuthState {
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  user: User | null;
  isEditing: boolean;
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
const initialState: AuthState = {
  token:
    localStorage.getItem('token') || sessionStorage.getItem('token') || null,
  status: 'idle',
  error: null,
  user: null,
  isEditing: false,
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
    toggleEditing: (state) => {
      state.isEditing = !state.isEditing;
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
      })
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

export const { logout, toggleEditing } = authSlice.actions;

export default authSlice.reducer;
