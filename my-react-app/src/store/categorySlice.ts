import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import type { Category } from "../types/category"

interface CategoryState {
  categories: Category[]
  isLoading: boolean
  error: string | null
}

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
}

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Category[]>("http://localhost:8080/api/category")
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "שגיאה בטעינת הקטגוריות")
      }
      return rejectWithValue("שגיאה בטעינת הקטגוריות")
    }
  },
)

export const addCategory = createAsyncThunk<Category, Omit<Category, "Id">, { rejectValue: string }>(
  "category/addCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post<Category>("http://localhost:8080/api/category", categoryData)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "שגיאה בהוספת הקטגוריה")
      }
      return rejectWithValue("שגיאה בהוספת הקטגוריה")
    }
  },
)

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder:any) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state:any) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state:any, action: PayloadAction<Category[]>) => {
        state.isLoading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state:any, action:any) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה בטעינת הקטגוריות"
      })

      // Add category
      .addCase(addCategory.pending, (state:any) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addCategory.fulfilled, (state:any, action: PayloadAction<Category>) => {
        state.isLoading = false
        state.categories.push(action.payload)
      })
      .addCase(addCategory.rejected, (state:any, action:any) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה בהוספת הקטגוריה"
      })
  },
})

export default categorySlice.reducer
