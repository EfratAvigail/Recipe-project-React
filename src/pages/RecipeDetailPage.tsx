"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { AccessTime, ArrowBack, Edit, Restaurant, CheckCircle, Person, Delete } from "@mui/icons-material"
import { fetchRecipeById, deleteRecipe } from "../store/recipeSlice"
import type { RootState } from "../store/store"
import { getDifficultyLabel } from "../utils/helpers"
import { useAppDispatch } from "../store/store"

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selectedRecipe, isLoading, error } = useSelector((state: RootState) => state.recipe)
  const { categories } = useSelector((state: RootState) => state.category)
  const { user } = useSelector((state: RootState) => state.auth)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    if (id) {
      // @ts-ignore - Ignoring TypeScript error for dispatch
      dispatch(fetchRecipeById(Number.parseInt(id)))
    }
  }, [dispatch, id])

  const handleEdit = () => {
    navigate(`/recipes/edit/${id}`)
  }

  const handleDelete = async () => {
    if (id) {
      // @ts-ignore - Ignoring TypeScript error for dispatch
      await dispatch(deleteRecipe(Number.parseInt(id)))
      navigate("/recipes")
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || !selectedRecipe) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 2 }}>
            חזרה
          </Button>
          <Alert severity="error">המתכון לא נמצא או שאירעה שגיאה בטעינת המתכון</Alert>
        </Box>
      </Container>
    )
  }

  const categoryName = categories.find((cat) => cat.Id === selectedRecipe.CategoryId)?.Name || ""
  const isOwner = user?.Id === selectedRecipe.UserId

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 2 }}>
          חזרה לרשימת המתכונים
        </Button>

        <Paper elevation={3} sx={{ overflow: "hidden", borderRadius: 2 }}>
          <Box
            sx={{
              height: { xs: 200, md: 300 },
              position: "relative",
              backgroundImage: `url(${selectedRecipe.Img || "/placeholder-recipe.jpg"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                color: "white",
              }}
            >
              <Typography variant="h3" component="h1" gutterBottom>
                {selectedRecipe.Name}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              <Chip icon={<Restaurant />} label={categoryName} color="primary" />
              <Chip icon={<AccessTime />} label={`${selectedRecipe.Duration} דקות`} color="secondary" />
              <Chip
                label={getDifficultyLabel(selectedRecipe.Difficulty)}
                color={
                  selectedRecipe.Difficulty === 1
                    ? "success"
                    : selectedRecipe.Difficulty === 2
                      ? "info"
                      : selectedRecipe.Difficulty === 3
                        ? "warning"
                        : "error"
                }
              />
              <Chip icon={<Person />} label={`יוצר: ${selectedRecipe.UserName || "משתמש"}`} variant="outlined" />
            </Box>

            <Typography variant="body1" paragraph>
              {selectedRecipe.Description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" component="h2" gutterBottom>
              מרכיבים
            </Typography>
            <List>
              {selectedRecipe.Ingrident && selectedRecipe.Ingrident.length > 0 ? (
                selectedRecipe.Ingrident.map((ingredient, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircle color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`${ingredient.Name} - ${ingredient.Count} ${ingredient.Type}`} />
                  </ListItem>
                ))
              ) : (
                <ListItem disableGutters>
                  <ListItemText primary="אין מרכיבים למתכון זה" />
                </ListItem>
              )}
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" component="h2" gutterBottom>
              הוראות הכנה
            </Typography>
            <List>
              {selectedRecipe.Instructions && selectedRecipe.Instructions.length > 0 ? (
                selectedRecipe.Instructions.map((instruction, index) => (
                  <ListItem key={index} disableGutters sx={{ alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <Chip label={index + 1} size="small" color="primary" sx={{ height: 24, minWidth: 24 }} />
                    </ListItemIcon>
                    <ListItemText primary={instruction} />
                  </ListItem>
                ))
              ) : (
                <ListItem disableGutters>
                  <ListItemText primary="אין הוראות הכנה למתכון זה" />
                </ListItem>
              )}
            </List>

            {isOwner && (
              <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button variant="outlined" color="primary" startIcon={<Edit />} onClick={handleEdit}>
                  ערוך מתכון
                </Button>
                {!deleteConfirm ? (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setDeleteConfirm(true)}
                  >
                    מחק מתכון
                  </Button>
                ) : (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                      אישור מחיקה
                    </Button>
                    <Button variant="outlined" onClick={() => setDeleteConfirm(false)}>
                      ביטול
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default RecipeDetailPage
