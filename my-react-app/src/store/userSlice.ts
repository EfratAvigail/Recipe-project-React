import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import type { User } from "../types/user"

interface UserState {
  users: User[]
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  error: null,
}

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      // Since there's no endpoint to get all users, we'll extract users from recipes
      const response = await axios.get("http://localhost:8080/api/recipe")
      const recipes = response.data

      // Extract unique users from recipes
      const userMap = new Map<number, User>()
      recipes.forEach((recipe: any) => {
        if (recipe.UserId && !userMap.has(recipe.UserId)) {
          // Create a minimal user object from available data
          userMap.set(recipe.UserId, {
            Id: recipe.UserId,
            Name: recipe.UserName || `משתמש ${recipe.UserId}`,
            Username: "",
            Password: "",
            Email: "",
            Phone: "",
            Tz: "",
          })
        }
      })

      return Array.from(userMap.values())
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "שגיאה בטעינת המשתמשים")
      }
      return rejectWithValue("שגיאה בטעינת המשתמשים")
    }
  },
)

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה בטעינת המשתמשים"
      })
  },
})

export default userSlice.reducer
