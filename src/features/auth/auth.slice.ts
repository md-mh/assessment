import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type UserRole = "employer" | "candidate";

type AuthState = {
  isAuthenticated: boolean;
  email: string | null;
  role: UserRole | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  email: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (
      state,
      action: PayloadAction<{ email: string; role: UserRole }>,
    ) => {
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.email = null;
      state.role = null;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
