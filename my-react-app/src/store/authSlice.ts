import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { User } from "../types/user";

interface LoginCredentials {
  UserName: string;
  Password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Check if user is already logged in from localStorage
const storedUser = localStorage.getItem("user");
if (storedUser) {
  try {
    initialState.user = JSON.parse(storedUser);
    initialState.isAuthenticated = true;
  } catch (e) {
    localStorage.removeItem("user");
  }
}

export const login = createAsyncThunk<User, LoginCredentials, { rejectValue: string }>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("Login request:", credentials);
      const response = await axios.post<User>("http://localhost:8080/api/user/login", credentials);
      console.log("Login response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          return rejectWithValue("שם משתמש או סיסמה שגויים");
        }
        return rejectWithValue(error.response.data || "שגיאה בהתחברות");
      }
      return rejectWithValue("שגיאה בהתחברות - בדוק את החיבור לשרת");
    }
  },
);

export const register = createAsyncThunk<User, User, { rejectValue: string }>(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Original registration data:", userData);
      const serverUserData = {
        UserName: userData.UserName,
        Password: userData.Password,
        Name: userData.Name,
        Phone: userData.Phone,
        Email: userData.Email,
        Tz: userData.Tz,
      };
      console.log("Sending registration data:", serverUserData);
      const response = await axios.post<User>("http://localhost:8080/api/user/sighin", serverUserData);
      console.log("Registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Server error response:", error.response.data);
        return rejectWithValue(error.response.data || "שגיאה בהרשמה");
      }
      return rejectWithValue("שגיאה בהרשמה - בדוק את החיבור לשרת");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "שגיאה בהתחברות";
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "שגיאה בהרשמה";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
