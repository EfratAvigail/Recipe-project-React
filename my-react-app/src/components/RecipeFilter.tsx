"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import {
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Slider,
  Chip,
  type SelectChangeEvent,
} from "@mui/material"
import { FilterAlt, Clear } from "@mui/icons-material"
import type { RootState } from "../store/store"
import type { RecipeFilters } from "../types/recipe"
import "../styles/RecipeFilter.css"

interface RecipeFilterProps {
  onFilterChange: (filters: RecipeFilters) => void
}

const RecipeFilter = ({ onFilterChange }: RecipeFilterProps) => {
  const { categories } = useSelector((state: RootState) => state.category)
  const { users } = useSelector((state: RootState) => state.user)

  const [filters, setFilters] = useState<RecipeFilters>({
    search: "",
    categoryId: "",
    difficulty: "",
    duration: [0, 300],
    userId: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleDurationChange = (_event: Event, newValue: number | number[]) => {
    setFilters((prev) => ({ ...prev, duration: newValue as number[] }))
  }

  const applyFilters = () => {
    onFilterChange(filters)
  }

  const clearFilters = () => {
    const resetFilters: RecipeFilters = {
      search: "",
      categoryId: "",
      difficulty: "",
      duration: [0, 300],
      userId: "",
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  useEffect(() => {
    // Apply filters when component mounts
    onFilterChange(filters)
  }, [])

  const difficultyLevels = [
    { value: "1", label: "קל" },
    { value: "2", label: "בינוני" },
    { value: "3", label: "מאתגר" },
    { value: "4", label: "קשה" },
  ]

  return (
    <Paper elevation={2} className="filter-container">
      <Typography variant="h6" gutterBottom>
        סינון מתכונים
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              name="search"
              label="חיפוש"
              variant="outlined"
              fullWidth
              value={filters.search}
              onChange={handleInputChange}
              placeholder="חפש לפי שם או תיאור"
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth>
              <InputLabel>קטגוריה</InputLabel>
              <Select name="categoryId" value={filters.categoryId} label="קטגוריה" onChange={handleSelectChange}>
                <MenuItem value="">הכל</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.Id} value={category.Id.toString()}>
                    {category.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth>
              <InputLabel>רמת קושי</InputLabel>
              <Select name="difficulty" value={filters.difficulty} label="רמת קושי" onChange={handleSelectChange}>
                <MenuItem value="">הכל</MenuItem>
                {difficultyLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box>
          <Typography gutterBottom>
            זמן הכנה (דקות): {filters.duration[0]} - {filters.duration[1]}
          </Typography>
          <Slider
            value={filters.duration}
            onChange={handleDurationChange}
            valueLabelDisplay="auto"
            min={0}
            max={300}
            step={5}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth>
              <InputLabel>יוצר המתכון</InputLabel>
              <Select name="userId" value={filters.userId} label="יוצר המתכון" onChange={handleSelectChange}>
                <MenuItem value="">הכל</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.Id} value={user.Id.toString()}>
                    {user.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1, display: "flex", gap: 2, height: "100%", alignItems: "center" }}>
            <Button variant="contained" color="primary" startIcon={<FilterAlt />} onClick={applyFilters} fullWidth>
              סנן
            </Button>
            <Button variant="outlined" startIcon={<Clear />} onClick={clearFilters} fullWidth>
              נקה
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {filters.search && (
            <Chip
              label={`חיפוש: ${filters.search}`}
              onDelete={() => {
                setFilters((prev) => ({ ...prev, search: "" }))
              }}
            />
          )}
          {filters.categoryId && (
            <Chip
              label={`קטגוריה: ${categories.find((c) => c.Id.toString() === filters.categoryId)?.Name}`}
              onDelete={() => {
                setFilters((prev) => ({ ...prev, categoryId: "" }))
              }}
            />
          )}
          {filters.difficulty && (
            <Chip
              label={`רמת קושי: ${difficultyLevels.find((d) => d.value === filters.difficulty)?.label}`}
              onDelete={() => {
                setFilters((prev) => ({ ...prev, difficulty: "" }))
              }}
            />
          )}
          {(filters.duration[0] > 0 || filters.duration[1] < 300) && (
            <Chip
              label={`זמן: ${filters.duration[0]}-${filters.duration[1]} דקות`}
              onDelete={() => {
                setFilters((prev) => ({ ...prev, duration: [0, 300] }))
              }}
            />
          )}
          {filters.userId && (
            <Chip
              label={`יוצר: ${users.find((u) => u.Id.toString() === filters.userId)?.Name}`}
              onDelete={() => {
                setFilters((prev) => ({ ...prev, userId: "" }))
              }}
            />
          )}
        </Box>
      </Box>
    </Paper>
  )
}

export default RecipeFilter
