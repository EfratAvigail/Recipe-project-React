import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import type { ShoppingItem } from "../types/shoppingList"

interface ShoppingListState {
  items: ShoppingItem[]
  isLoading: boolean
  error: string | null
}

const initialState: ShoppingListState = {
  items: [],
  isLoading: false,
  error: null,
}

export const fetchShoppingList = createAsyncThunk<ShoppingItem[], number, { rejectValue: string }>(
  "shoppingList/fetchShoppingList",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get<ShoppingItem[]>(`http://localhost:8080/api/bay/${userId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "שגיאה בטעינת רשימת הקניות")
      }
      return rejectWithValue("שגיאה בטעינת רשימת הקניות")
    }
  },
)

export const addShoppingItem = createAsyncThunk<ShoppingItem[], ShoppingItem[], { rejectValue: string }>(
  "shoppingList/addShoppingItem",
  async (items, { rejectWithValue }) => {
    try {
      const response = await axios.post<ShoppingItem[]>("http://localhost:8080/api/bay", items)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "שגיאה בהוספת פריט לרשימת הקניות")
      }
      return rejectWithValue("שגיאה בהוספת פריט לרשימת הקניות")
    }
  },
)

export const updateShoppingItem = createAsyncThunk<ShoppingItem, ShoppingItem, { rejectValue: string }>(
  "shoppingList/updateShoppingItem",
  async (item, { rejectWithValue }) => {
    try {
      const response = await axios.post<ShoppingItem>("http://localhost:8080/api/bay/edit", item)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "שגיאה בעדכון פריט ברשימת הקניות")
      }
      return rejectWithValue("שגיאה בעדכון פריט ברשימת הקניות")
    }
  },
)

export const deleteShoppingItem = createAsyncThunk<
  { userId: number; itemId: number },
  { userId: number; itemId: number },
  { rejectValue: string }
>("shoppingList/deleteShoppingItem", async ({ userId, itemId }, { rejectWithValue }) => {
  try {
    await axios.post(`http://localhost:8080/api/bay/delete/${userId}/${itemId}`)
    return { userId, itemId }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || "שגיאה במחיקת פריט מרשימת הקניות")
    }
    return rejectWithValue("שגיאה במחיקת פריט מרשימת הקניות")
  }
})

const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch shopping list
      .addCase(fetchShoppingList.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchShoppingList.fulfilled, (state, action: PayloadAction<ShoppingItem[]>) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchShoppingList.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה בטעינת רשימת הקניות"
      })

      // Add shopping item
      .addCase(addShoppingItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addShoppingItem.fulfilled, (state, action: PayloadAction<ShoppingItem[]>) => {
        state.isLoading = false
        state.items = [...state.items, ...action.payload]
      })
      .addCase(addShoppingItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה בהוספת פריט לרשימת הקניות"
      })

      // Update shopping item
      .addCase(updateShoppingItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateShoppingItem.fulfilled, (state, action: PayloadAction<ShoppingItem>) => {
        state.isLoading = false
        const index = state.items.findIndex((item) => item.Id === action.payload.Id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateShoppingItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה בעדכון פריט ברשימת הקניות"
      })

      // Delete shopping item
      .addCase(deleteShoppingItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteShoppingItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.filter(
          (item) => !(item.Id === action.payload.itemId && item.UserId === action.payload.userId),
        )
      })
      .addCase(deleteShoppingItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה במחיקת פריט מרשימת הקניות"
      })
  },
})

export default shoppingListSlice.reducer
