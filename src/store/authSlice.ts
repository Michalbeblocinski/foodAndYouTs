import { createAction, createSlice } from "@reduxjs/toolkit";
import { UserApp } from "../utils/types/user";
import { RootState } from "./store";

type AuthState = {
  user: UserApp | null;
  isLoggedIn: boolean;
};

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },

    setLogout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
    changeUserBasicCredentials: (state, action) => {
      if (state.user) {
        state.user.email = action.payload.email;
        if ("username" in state.user) {
          state.user.username = action.payload.username;
        }
        if ("lastName" in state.user) {
          state.user.lastName = action.payload.lastName;
        }
      }
    },
    changeUserPhotoUrl: (state, action) => {
      if (state.user) {
        if ("photoUrl" in state.user) {
          state.user.photoUrl = action.payload.photoUrl;
        }
      }
    },
    changeUserFollows: (state, action) => {
      if (state.user) {
        state.user.follows = state.user.follows || [];
        state.user.follows.push(action.payload);
      }
    },
    changeUserIngredients: (state, action) => {
      if (state.user) {
        state.user.ingredients = state.user.ingredients || [];
        state.user.ingredients = action.payload.ingredients;
      }
    },
  },
});

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const getUser = (state: RootState) => state.auth.user;

export const {
  setLogout,
  changeUserBasicCredentials,
  changeUserFollows,
  changeUserPhotoUrl,
  changeUserIngredients,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
export default authReducer;
export const setLogin = createAction<UserApp>("auth/setLogin");
