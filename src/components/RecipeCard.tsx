"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { AccessTime, Delete, Edit, Restaurant } from "@mui/icons-material"
import type { Recipe } from "../types/recipe"
import type { RootState } from "../store/store"
import { deleteRecipe } from "../store/recipeSlice"
import { getDifficultyLabel } from "../utils/helpers"


interface RecipeCardProps {
  recipe: Recipe
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const [openDialog, setOpenDialog] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { categories } = useSelector((state: RootState) => state.category)

  const isOwner = user?.Id === recipe.UserId

  const categoryName = categories.find((cat) => cat.Id === recipe.CategoryId)?.Name || ""

  const handleEdit = () => {
    navigate(`/recipes/edit/${recipe.Id}`)
  }

  const handleDelete = () => {
    setOpenDialog(true)
  }

  const confirmDelete = () => {
    // @ts-ignore - Ignoring TypeScript error for dispatch
    dispatch(deleteRecipe(recipe.Id))
    setOpenDialog(false)
  }

  const handleViewRecipe = () => {
    navigate(`/recipes/${recipe.Id}`)
  }

  return (
    <>
      <Card className="recipe-card">
        <CardMedia component="img" height="180" image={recipe.Img || "/placeholder-recipe.jpg"} alt={recipe.Name} />
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {recipe.Name}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="recipe-description">
            {recipe.Description}
          </Typography>
          <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip icon={<Restaurant />} label={categoryName} size="small" color="primary" variant="outlined" />
            <Chip
              icon={<AccessTime />}
              label={`${recipe.Duration} דקות`}
              size="small"
              color="secondary"
              variant="outlined"
            />
          </Box>
          <Box sx={{ mt: 1 }}>
            <Chip
              label={getDifficultyLabel(recipe.Difficulty)}
              size="small"
              color={
                recipe.Difficulty === 1
                  ? "success"
                  : recipe.Difficulty === 2
                    ? "info"
                    : recipe.Difficulty === 3
                      ? "warning"
                      : "error"
              }
            />
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Button size="small" variant="contained" color="primary" onClick={handleViewRecipe}>
            צפה במתכון
          </Button>
          {isOwner && (
            <Box>
              <IconButton size="small" color="primary" onClick={handleEdit} aria-label="edit recipe">
                <Edit />
              </IconButton>
              <IconButton size="small" color="error" onClick={handleDelete} aria-label="delete recipe">
                <Delete />
              </IconButton>
            </Box>
          )}
        </CardActions>
      </Card>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"האם אתה בטוח שברצונך למחוק את המתכון?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            פעולה זו אינה ניתנת לביטול. המתכון "{recipe.Name}" יימחק לצמיתות.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ביטול</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RecipeCard
