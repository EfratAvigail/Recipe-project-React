"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Container, Typography, Box, Alert, CircularProgress } from "@mui/material"
import RecipeForm from "../components/RecipeForm"
import type { Recipe } from "../types/recipe"
import { fetchRecipeById, updateRecipe } from "../store/recipeSlice"
import type { RootState } from "../store/store"
import { useAppDispatch } from "../store/store"

const EditRecipePage = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selectedRecipe, isLoading } = useSelector((state: RootState) => state.recipe)
  const { user } = useSelector((state: RootState) => state.auth)
  const [error, setError] = useState<string | null>(null)
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true)

  useEffect(() => {
    if (id) {
      dispatch(fetchRecipeById(Number.parseInt(id)))
    }
  }, [dispatch, id])

  useEffect(() => {
    // Check if user is authorized to edit this recipe
    if (selectedRecipe && user) {
      if (selectedRecipe.UserId !== user.Id) {
        setIsAuthorized(false)
        setError("אין לך הרשאה לערוך מתכון זה")
      } else {
        setIsAuthorized(true)
      }
    }
  }, [selectedRecipe, user])

  const handleSubmit = async (data: Recipe) => {
    if (!isAuthorized) return

    setError(null)
    try {
      const resultAction = await dispatch(updateRecipe(data))
      if (updateRecipe.fulfilled.match(resultAction)) {
        navigate("/recipes")
      } else if (updateRecipe.rejected.match(resultAction) && resultAction.payload) {
        setError(resultAction.payload as string)
      } else if (updateRecipe.rejected.match(resultAction) && resultAction.error) {
        setError("שגיאה בעדכון המתכון. אנא נסה שוב מאוחר יותר.")
      }
    } catch (err) {
      setError("שגיאה בעדכון המתכון. אנא נסה שוב מאוחר יותר.")
    }
  }

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (!selectedRecipe) {
    return (
      <Container>
        <Alert severity="error" sx={{ my: 4 }}>
          המתכון לא נמצא
        </Alert>
      </Container>
    )
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          עריכת מתכון
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          עדכן את פרטי המתכון שלך
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {isAuthorized ? (
          <RecipeForm initialData={selectedRecipe} onSubmit={handleSubmit} isLoading={isLoading} />
        ) : (
          <Alert severity="warning">אין לך הרשאה לערוך מתכון זה</Alert>
        )}
      </Box>
    </Container>
  )
}

export default EditRecipePage
