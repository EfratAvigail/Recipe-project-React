"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Container, Typography, Box, CircularProgress, Alert, Pagination } from "@mui/material"
import { fetchRecipes } from "../store/recipeSlice"
import { fetchCategories } from "../store/categorySlice"
import { fetchUsers } from "../store/userSlice"
import type { RootState } from "../store/store"
import RecipeCard from "../components/RecipeCard"
import RecipeFilter from "../components/RecipeFilter"
import type { RecipeFilters } from "../types/recipe"
import { useAppDispatch } from "../store/store"
import "../styles/RecipesPage.css"

const RecipesPage = () => {
  const dispatch = useAppDispatch()
  const { recipes, isLoading, error } = useSelector((state: RootState) => state.recipe)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<RecipeFilters>({
    search: "",
    categoryId: "",
    difficulty: "",
    duration: [0, 300],
    userId: "",
  })

  const recipesPerPage = 9

  useEffect(() => {
    dispatch(fetchRecipes())
    dispatch(fetchCategories())
    dispatch(fetchUsers())
  }, [dispatch])

  const handleFilterChange = (newFilters: RecipeFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const filteredRecipes = recipes.filter((recipe) => {
    // Search filter
    if (
      filters.search &&
      !recipe.Name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !recipe.Description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }

    // Category filter
    if (filters.categoryId && recipe.CategoryId.toString() !== filters.categoryId) {
      return false
    }

    // Difficulty filter
    if (filters.difficulty && recipe.Difficulty.toString() !== filters.difficulty) {
      return false
    }

    // Duration filter
    if (recipe.Duration < filters.duration[0] || recipe.Duration > filters.duration[1]) {
      return false
    }

    // User filter
    if (filters.userId && recipe.UserId.toString() !== filters.userId) {
      return false
    }

    return true
  })

  // Pagination
  const indexOfLastRecipe = currentPage * recipesPerPage
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe)

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Container className="recipes-page">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          מתכונים
        </Typography>
        <Typography variant="body1" color="text.secondary">
          גלה מגוון מתכונים טעימים ומיוחדים
        </Typography>
      </Box>

      <RecipeFilter onFilterChange={handleFilterChange} />

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 4 }}>
          {error}
        </Alert>
      ) : filteredRecipes.length === 0 ? (
        <Alert severity="info" sx={{ my: 4 }}>
          לא נמצאו מתכונים התואמים את החיפוש שלך
        </Alert>
      ) : (
        <>
          <Box sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              מציג {currentRecipes.length} מתוך {filteredRecipes.length} מתכונים
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {currentRecipes.map((recipe) => (
              <Box key={recipe.Id} sx={{ width: { xs: "100%", sm: "calc(50% - 16px)", md: "calc(33.333% - 16px)" } }}>
                <RecipeCard recipe={recipe} />
              </Box>
            ))}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default RecipesPage
