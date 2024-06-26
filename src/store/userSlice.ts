import { createAsyncThunk, createSlice, UnknownAction } from '@reduxjs/toolkit';
import { getUserProfile, updateUser } from '../services/api';
// Import jwt-decode
import { jwtDecode } from 'jwt-decode';

import { logout } from './authSlice';
import { RootState } from './store';

interface UserState {
  user: User | null;
  isEditing: boolean;
  error: string | null;
  loading: boolean;
}

interface LoginError {
  message: string;
  code?: number;
}
interface User {
  firstName: string;
  lastName: string;
}

interface Token {
  exp: number;
}

// Fonction pour vérifier si le token est valide
function verifyToken(
  token: string,
  thunkAPI: { rejectWithValue: (value: { message: string }) => void }
) {
  try {
    jwtDecode(token);
  } catch (error) {
    return thunkAPI.rejectWithValue({ message: 'Invalid token' });
  }
}

// Fonction pour vérifier si le token a expiré
function checkTokenExpiry(
  decodedToken: { exp: number },
  thunkAPI: {
    dispatch: (action: UnknownAction) => void;
    rejectWithValue: (value: { message: string; code: number }) => void;
  }
) {
  if (decodedToken.exp < Date.now() / 1000) {
    // Si oui, déconnecter l'utilisateur
    thunkAPI.dispatch(logout());
    return thunkAPI.rejectWithValue({
      message: 'Token expired',
      code: 401,
    });
  }
}

// GET USER Création de l'action thunk pour la récupération des données de l'utilisateur
export const getUser = createAsyncThunk<
  User,
  string,
  { rejectValue: LoginError; state: RootState }
>('auth/getUser', async (_, thunkAPI) => {
  try {
    // Récupération du token depuis le state auth
    const token = thunkAPI.getState().auth.token;

    // Si le token n'existe pas, on renvoie une erreur
    if (!token) return thunkAPI.rejectWithValue({ message: 'No token' });

    // Vérifier si le token est valide
    verifyToken(token, thunkAPI);

    // Décoder le token
    const decodedToken = jwtDecode<Token>(token) as { exp: number };

    // Vérifier si le token a expiré
    checkTokenExpiry(decodedToken, thunkAPI);

    // Appel getUserProfile avec le token récuperé
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
  { user: { firstName: string; lastName: string } },
  { rejectValue: LoginError; state: RootState }
>('auth/putUser', async ({ user }, thunkAPI) => {
  try {
    // Récuperation du token depuis le state auth
    const token = thunkAPI.getState().auth.token;

    // Si le token n'existe pas, on renvoie une erreur
    if (!token) return thunkAPI.rejectWithValue({ message: 'No token' });

    // Vérifier si le token est valide
    verifyToken(token, thunkAPI);

    // Decoder le token
    const decodedToken = jwtDecode<Token>(token) as { exp: number };

    // Vérifier si le token a expiré
    checkTokenExpiry(decodedToken, thunkAPI);

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
        if (action.payload && action.payload.code === 401) {
          state.error = 'Votre session a expiré, veuillez vous reconnecter';
        } else if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error =
            "Une erreur s'est produite, veuillez réessayer plus tard";
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
