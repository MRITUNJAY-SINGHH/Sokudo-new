import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser } from './userServices';
import { setAuthToken } from '../../utils/Base';

export const userRegister = createAsyncThunk(
   'user/register',
   async (userData, { rejectWithValue }) => {
      try {
         const data = await registerUser(userData);

         if (data?.token) setAuthToken(data.token);
         return data;
      } catch (error) {
         return rejectWithValue(error.response?.data || 'Registration failed');
      }
   }
);

export const userLogin = createAsyncThunk(
   'user/login',
   async (credentials, { rejectWithValue }) => {
      try {
         const data = await loginUser(credentials);
         if (data?.token) setAuthToken(data.token);
         return data;
      } catch (error) {
         return rejectWithValue(error.response?.data || 'Login failed');
      }
   }
);

const initialState = {
   user: JSON.parse(localStorage.getItem('user')) || null,
   token: localStorage.getItem('token') || null,
   isLoggedIn: !!localStorage.getItem('token'),
   loading: false,
   error: null,
};

if (initialState.token) {
   setAuthToken(initialState.token);
}

// ----------------------
// Slice
// ----------------------
const userSlice = createSlice({
   name: 'user',
   initialState,
   reducers: {
      logout: (state) => {
         state.user = null;
         state.token = null;
         state.isLoggedIn = false;
         setAuthToken(null);
         localStorage.removeItem('user');
         localStorage.removeItem('token');
      },

      setCredentials: (state, action) => {
         const { user, token } = action.payload;
         state.user = user || state.user;
         state.token = token || state.token;
         state.isLoggedIn = !!(token || state.token);
         if (token) {
            localStorage.setItem('token', token);
            setAuthToken(token);
         }
         if (user) localStorage.setItem('user', JSON.stringify(user));
      },

  setUserAfterGoogle: (state, action) => {
   const { user, token } = action.payload;

   state.user = user;
   state.token = token;
   state.isLoggedIn = true;

   localStorage.setItem("user", JSON.stringify(user));
   localStorage.setItem("token", token);
},


   },
   extraReducers: (builder) => {
      builder

         .addCase(userRegister.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(userRegister.fulfilled, (state, action) => {
            state.loading = false;

            // Robustly read token & user from payload
            const payload = action.payload || {};
            state.token = payload.token || state.token;
            // if payload.user exists use it, otherwise if payload contains user fields at top-level use them
            state.user =
               payload.user ??
               (payload._id || payload.email ? payload : state.user);
            state.isLoggedIn = !!state.token;

            // persist
            if (state.token) {
               localStorage.setItem('token', state.token);
               setAuthToken(state.token);
            }
            if (state.user)
               localStorage.setItem('user', JSON.stringify(state.user));
         })
         .addCase(userRegister.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // LOGIN
         .addCase(userLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(userLogin.fulfilled, (state, action) => {
            state.loading = false;
            const payload = action.payload || {};
            state.token = payload.token || state.token;
            state.user =
               payload.user ??
               (payload._id || payload.email ? payload : state.user);
            state.isLoggedIn = !!state.token;

            if (state.token) {
               localStorage.setItem('token', state.token);
               setAuthToken(state.token);
            }
            if (state.user)
               localStorage.setItem('user', JSON.stringify(state.user));
         })
         .addCase(userLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         });
   },
});

export const { logout, setCredentials, setUserAfterGoogle } = userSlice.actions;
export default userSlice.reducer;
