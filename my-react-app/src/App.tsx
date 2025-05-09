import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { store } from "./store/store"
import { theme } from "./styles/theme"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import RecipesPage from "./pages/RecipesPage"
import AddRecipePage from "./pages/AddRecipePage"
import EditRecipePage from "./pages/EditRecipePage"
import RecipeDetailPage from "./pages/RecipeDetailPage"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route
              path="/recipes/add"
              element={
                <ProtectedRoute>
                  <AddRecipePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipes/edit/:id"
              element={
                <ProtectedRoute>
                  <EditRecipePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  )
}

export default App
