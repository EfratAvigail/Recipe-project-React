"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Container, Typography, Box, Alert } from "@mui/material"
import RecipeForm from "../components/RecipeForm"
import type { Recipe } from "../types/recipe"
import { addRecipe } from "../store/recipeSlice"
import type { RootState } from "../store/store"
import { useAppDispatch } from "../store/store"

const AddRecipePage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading } = useSelector((state: RootState) => state.recipe)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: Recipe) => {
    setError(null)
    try {
      const resultAction = await dispatch(addRecipe(data))
      if (addRecipe.fulfilled.match(resultAction)) {
        navigate("/recipes")
      } else if (addRecipe.rejected.match(resultAction) && resultAction.payload) {
        setError(resultAction.payload as string)
      } else if (addRecipe.rejected.match(resultAction) && resultAction.error) {
        setError("שגיאה בהוספת המתכון. אנא נסה שוב מאוחר יותר.")
      }
    } catch (err) {
      setError("שגיאה בהוספת המתכון. אנא נסה שוב מאוחר יותר.")
    }
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          הוספת מתכון חדש
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          שתף את המתכון האהוב עליך עם הקהילה
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <RecipeForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Box>
    </Container>
  )
}

export default AddRecipePage
