import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import type { Recipe } from "../types/recipe"

interface RecipeState {
  recipes: Recipe[]
  recentRecipes: Recipe[]
  selectedRecipe: Recipe | null
  isLoading: boolean
  error: string | null
}

const initialState: RecipeState = {
  recipes: [],
  recentRecipes: [],
  selectedRecipe: null,
  isLoading: false,
  error: null,
}

export const fetchRecipes = createAsyncThunk<Recipe[], void, { rejectValue: string }>(
  "recipe/fetchRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Recipe[]>("http://localhost:8080/api/recipe")
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "שגיאה בטעינת המתכונים")
      }
      return rejectWithValue("שגיאה בטעינת המתכונים")
    }
  },
)

export const fetchRecentRecipes = createAsyncThunk<Recipe[], void, { rejectValue: string }>(
  "recipe/fetchRecentRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Recipe[]>("http://localhost:8080/api/recipe")
      // Sort by newest first and take only the first 6
      return response.data.sort((a, b) => b.Id - a.Id).slice(0, 6)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "שגיאה בטעינת המתכונים האחרונים")
      }
      return rejectWithValue("שגיאה בטעינת המתכונים האחרונים")
    }
  },
)

export const fetchRecipeById = createAsyncThunk<Recipe, number, { rejectValue: string }>(
  "recipe/fetchRecipeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get<Recipe[]>("http://localhost:8080/api/recipe")
      const recipe = response.data.find((r) => r.Id === id)
      if (!recipe) {
        return rejectWithValue("המתכון לא נמצא")
      }

      // Ensure Ingrident and Instructions are always arrays
      if (!recipe.Ingrident && !recipe.Ingridents) {
        recipe.Ingrident = []
      } else if (recipe.Ingridents && !recipe.Ingrident) {
        recipe.Ingrident = recipe.Ingridents
      }

      if (!recipe.Instructions) {
        recipe.Instructions = []
      }

      return recipe
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "שגיאה בטעינת המתכון")
      }
      return rejectWithValue("שגיאה בטעינת המתכון")
    }
  },
)

export const addRecipe = createAsyncThunk<Recipe, Recipe, { rejectValue: string }>(
  "recipe/addRecipe",
  async (recipeData, { rejectWithValue }) => {
    try {
      // Convert to server expected format
      const serverRecipeData = {
        Name: recipeData.Name,
        UserId: recipeData.UserId,
        Categoryid: recipeData.CategoryId,
        Img: recipeData.Img || "/placeholder-recipe.jpg",
        Duration: recipeData.Duration,
        Difficulty: recipeData.Difficulty,
        Description: recipeData.Description,
        Ingridents: recipeData.Ingrident,
        Instructions: recipeData.Instructions,
      }

      const response = await axios.post<Recipe>("http://localhost:8080/api/recipe", serverRecipeData)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "שגיאה בהוספת המתכון")
      }
      return rejectWithValue("שגיאה בהוספת המתכון")
    }
  },
)

export const updateRecipe = createAsyncThunk<Recipe, Recipe, { rejectValue: string }>(
  "recipe/updateRecipe",
  async (recipeData, { rejectWithValue }) => {
    try {
      // Convert to server expected format
      const serverRecipeData = {
        Id: recipeData.Id,
        Name: recipeData.Name,
        UserId: recipeData.UserId,
        Categoryid: recipeData.CategoryId,
        Img: recipeData.Img || "/placeholder-recipe.jpg",
        Duration: recipeData.Duration,
        Difficulty: recipeData.Difficulty,
        Description: recipeData.Description,
        Ingridents: recipeData.Ingrident,
        Instructions: recipeData.Instructions,
      }

      const response = await axios.post<Recipe>("http://localhost:8080/api/recipe/edit", serverRecipeData)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "שגיאה בעדכון המתכון")
      }
      return rejectWithValue("שגיאה בעדכון המתכון")
    }
  },
)

export const deleteRecipe = createAsyncThunk<number, number, { rejectValue: string }>(
  "recipe/deleteRecipe",
  async (id, { rejectWithValue }) => {
    try {
      await axios.post(`http://localhost:8080/api/recipe/delete/${id}`)
      return id
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "שגיאה במחיקת המתכון")
      }
      return rejectWithValue("שגיאה במחיקת המתכון")
    }
  },
)

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRecipes.fulfilled, (state, action: PayloadAction<Recipe[]>) => {
        state.isLoading = false
        state.recipes = action.payload
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה בטעינת המתכונים"
      })

      // Fetch recent recipes
      .addCase(fetchRecentRecipes.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRecentRecipes.fulfilled, (state, action: PayloadAction<Recipe[]>) => {
        state.isLoading = false
        state.recentRecipes = action.payload
      })
      .addCase(fetchRecentRecipes.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה בטעינת המתכונים האחרונים"
      })

      // Fetch recipe by ID
      .addCase(fetchRecipeById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRecipeById.fulfilled, (state, action: PayloadAction<Recipe>) => {
        state.isLoading = false
        state.selectedRecipe = action.payload
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה בטעינת המתכון"
      })

      // Add recipe
      .addCase(addRecipe.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addRecipe.fulfilled, (state, action: PayloadAction<Recipe>) => {
        state.isLoading = false
        state.recipes.push(action.payload)
      })
      .addCase(addRecipe.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה בהוספת המתכון"
      })

      // Update recipe
      .addCase(updateRecipe.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateRecipe.fulfilled, (state, action: PayloadAction<Recipe>) => {
        state.isLoading = false
        const index = state.recipes.findIndex((r) => r.Id === action.payload.Id)
        if (index !== -1) {
          state.recipes[index] = action.payload
        }
        state.selectedRecipe = action.payload
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה בעדכון המתכון"
      })

      // Delete recipe
      .addCase(deleteRecipe.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteRecipe.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false
        state.recipes = state.recipes.filter((recipe) => recipe.Id !== action.payload)
        if (state.selectedRecipe && state.selectedRecipe.Id === action.payload) {
          state.selectedRecipe = null
        }
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "שגיאה במחיקת המתכון"
      })
  },
})

export default recipeSlice.reducer
