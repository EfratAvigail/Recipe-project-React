import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import type { User } from "../types/user"

interface LoginCredentials {
  UserName: string
  Password: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Check if user is already logged in from localStorage
const storedUser = localStorage.getItem("user")
if (storedUser) {
  try {
    initialState.user = JSON.parse(storedUser)
    initialState.isAuthenticated = true
  } catch (e) {
    localStorage.removeItem("user")
  }
}

export const login = createAsyncThunk<User, LoginCredentials, { rejectValue: string }>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Log the request for debugging
      console.log("Login request:", credentials)

      // נתיב מתוקן - בדוק את הנתיב הנכון בשרת
      const response = await axios.post<User>("http://localhost:8080/api/user/sighin", credentials)

      // Log the response for debugging
      console.log("Login response:", response.data)

      return response.data
    } catch (error) {
      console.error("Login error:", error)
      if (axios.isAxiosError(error) && error.response) {
        // בדוק את קוד השגיאה ותן הודעה מתאימה
        if (error.response.status === 401) {
          return rejectWithValue("שם משתמש או סיסמה שגויים")
        }
        return rejectWithValue(error.response.data.message || "שגיאה בהתחברות")
      }
      return rejectWithValue("שגיאה בהתחברות - בדוק את החיבור לשרת")
    }
  },
)

export const register = createAsyncThunk<User, User, { rejectValue: string }>(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // Log the original data for debugging
      console.log("Original registration data:", userData)

      // נתיב מתוקן - בדוק את הנתיב הנכון בשרת
      // שינוי מ-signin ל-sighin לפי הנתיב שנראה שהשרת מצפה לו
      const serverUserData = {
        Name: userData.Name,
        UserName: userData.Username || userData.UserName, // Use either one that's available
        Password: userData.Password,
        Email: userData.Email,
        Phone: userData.Phone,
        Tz: userData.Tz,
      }

      // Log the transformed data for debugging
      console.log("Sending registration data:", serverUserData)

      const response = await axios.post<User>("http://localhost:8080/api/user/sighin", serverUserData)

      // Log the response for debugging
      console.log("Registration response:", response.data)

      return response.data
    } catch (error) {
      console.error("Registration error:", error)
      if (axios.isAxiosError(error) && error.response) {
        console.error("Server error response:", error.response.data)
        // בדוק את קוד השגיאה ותן הודעה מתאימה
        if (error.response.status === 404) {
          return rejectWithValue("נתיב ההרשמה לא נמצא בשרת - בדוק את תצורת השרת")
        }
        return rejectWithValue(error.response.data.message || "שגיאה בהרשמה")
      }
      return rejectWithValue("שגיאה בהרשמה - בדוק את החיבור לשרת")
    }
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem("user")
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload
        localStorage.setItem("user", JSON.stringify(action.payload))
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה בהתחברות"
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload
        localStorage.setItem("user", JSON.stringify(action.payload))
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה בהרשמה"
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
