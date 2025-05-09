import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import recipeReducer from "./recipeSlice"
import categoryReducer from "./categorySlice"
import userReducer from "./userSlice"
import shoppingListReducer from "./shoppingListSlice"
import { useDispatch } from "react-redux"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipe: recipeReducer,
    category: categoryReducer,
    user: userReducer,
    shoppingList: shoppingListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Add typed dispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>()
