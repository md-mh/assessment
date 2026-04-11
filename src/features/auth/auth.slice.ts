import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type UserRole = "employer" | "candidate";

/** Profile returned from login/register and GET /api/auth/me */
export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
};

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (
      state,
      action: PayloadAction<{
        token: string | null;
        user: AuthUser;
      }>,
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
