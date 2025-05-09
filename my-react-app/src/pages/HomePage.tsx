"use client"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Link as RouterLink } from "react-router-dom"
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  useTheme,
} from "@mui/material"
import { Restaurant, AccessTime, Star, Add } from "@mui/icons-material"
import { fetchRecentRecipes } from "../store/recipeSlice"
import type { RootState } from "../store/store"
import { getDifficultyLabel } from "../utils/helpers"
import { useAppDispatch } from "../store/store"
import "../styles/HomePage.css"

const HomePage = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { recentRecipes, isLoading } = useSelector((state: RootState) => state.recipe)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { categories } = useSelector((state: RootState) => state.category)

  useEffect(() => {
    dispatch(fetchRecentRecipes())
  }, [dispatch])

  const getCategoryName = (categoryId: number) => {
    return categories.find((cat) => cat.Id === categoryId)?.Name || ""
  }

  return (
    <div className="home-page">
      <Box className="hero-section">
        <Container>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h2" component="h1" gutterBottom className="hero-title">
                מתכונים טעימים
              </Typography>
              <Typography variant="h5" paragraph className="hero-subtitle">
                גלה מתכונים חדשים, שתף את היצירות שלך ותן השראה לאחרים
              </Typography>
              <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button variant="contained" color="primary" size="large" component={RouterLink} to="/recipes">
                  גלה מתכונים
                </Button>
                {isAuthenticated ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    component={RouterLink}
                    to="/recipes/add"
                    startIcon={<Add />}
                  >
                    הוסף מתכון
                  </Button>
                ) : (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="outlined" color="primary" size="large" component={RouterLink} to="/login">
                      התחברות
                    </Button>
                    <Button variant="outlined" color="secondary" size="large" component={RouterLink} to="/register">
                      הרשמה
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
            <Box sx={{ flex: 1 }} className="hero-image-container">
              <img src="/hero-food.jpg" alt="מתכונים טעימים" className="hero-image" />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 6 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            מתכונים אחרונים
          </Typography>
          <Divider sx={{ width: "80px", margin: "0 auto", borderColor: theme.palette.primary.main, borderWidth: 2 }} />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {isLoading ? (
            <Typography>טוען מתכונים...</Typography>
          ) : (
            recentRecipes.slice(0, 6).map((recipe) => (
              <Box key={recipe.Id} sx={{ width: { xs: "100%", sm: "calc(50% - 16px)", md: "calc(33.333% - 16px)" } }}>
                <Card className="recipe-card-home">
                  <CardMedia
                    component="img"
                    height="200"
                    image={recipe.Img || "/placeholder-recipe.jpg"}
                    alt={recipe.Name}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {recipe.Name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="recipe-description-home">
                      {recipe.Description}
                    </Typography>
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Restaurant fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">{getCategoryName(recipe.CategoryId)}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTime fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">{recipe.Duration} דקות</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Star fontSize="small" color="warning" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">{getDifficultyLabel(recipe.Difficulty)}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" component={RouterLink} to={`/recipes/${recipe.Id}`}>
                      צפה במתכון
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))
          )}
        </Box>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button variant="contained" color="primary" component={RouterLink} to="/recipes" size="large">
            לכל המתכונים
          </Button>
        </Box>
      </Container>

      <Box sx={{ bgcolor: "background.paper", py: 6 }}>
        <Container>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <Box sx={{ flex: "1 1 300px" }}>
              <Paper elevation={0} sx={{ p: 3, height: "100%", textAlign: "center" }}>
                <Restaurant fontSize="large" color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  מגוון קטגוריות
                </Typography>
                <Typography>מצא מתכונים מקטגוריות שונות - מנות ראשונות, עיקריות, קינוחים, מאפים ועוד</Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: "1 1 300px" }}>
              <Paper elevation={0} sx={{ p: 3, height: "100%", textAlign: "center" }}>
                <AccessTime fontSize="large" color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  מתכונים מהירים
                </Typography>
                <Typography>מתכונים מהירים וקלים להכנה, מושלמים לארוחות יומיומיות או לאירוח ספונטני</Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: "1 1 300px" }}>
              <Paper elevation={0} sx={{ p: 3, height: "100%", textAlign: "center" }}>
                <Star fontSize="large" color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  שתף את היצירות שלך
                </Typography>
                <Typography>הוסף את המתכונים האהובים עליך ושתף אותם עם קהילת הבשלנים שלנו</Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  )
}

export default HomePage
