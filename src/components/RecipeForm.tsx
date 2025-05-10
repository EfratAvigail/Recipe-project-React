"use client"

import { useEffect } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { useSelector, useDispatch } from "react-redux"
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  IconButton,
  Paper,
  Divider,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material"
import { Add, Delete } from "@mui/icons-material"
import type { Recipe, Ingredient } from "../types/recipe"
import type { RootState } from "../store/store"
import { fetchCategories } from "../store/categorySlice"
import "../styles/RecipeForm.css"

interface RecipeFormProps {
  initialData?: Recipe
  onSubmit: (data: Recipe) => void
  isLoading: boolean
}

const defaultIngredient: Ingredient = {
  Name: "",
  Count: 1,
  Type: "יחידה",
}

const defaultValues: Recipe = {
  Id: 0,
  Name: "",
  Description: "",
  Instructions: [""],
  Difficulty: 1,
  Duration: 30,
  CategoryId: 1,
  UserId: 0,
  Img: "",
  Ingrident: [defaultIngredient],
}

const RecipeForm = ({ initialData, onSubmit, isLoading }: RecipeFormProps) => {
  const dispatch = useDispatch()
  const { categories } = useSelector((state: RootState) => state.category)
  const { user } = useSelector((state: RootState) => state.auth)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Recipe>({
    defaultValues: initialData || defaultValues,
  })

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "Ingrident",
  })

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: "Instructions" as any, // Type assertion to fix TypeScript error
  })

  useEffect(() => {
    // Fetch categories
    const fetchData = async () => {
      await dispatch(fetchCategories() as any); // Ensure correct typing
    };

    fetchData();

    if (initialData) {
      reset(initialData)
    } else if (user) {
      setValue("UserId", user.Id)
    }
  }, [dispatch, initialData, reset, user, setValue])

  const onFormSubmit = (data: Recipe) => {
    // Make sure UserId is set
    if (user && !data.UserId) {
      data.UserId = user.Id
    }

    onSubmit(data)
  }

  const difficultyLevels = [
    { value: 1, label: "קל" },
    { value: 2, label: "בינוני" },
    { value: 3, label: "מאתגר" },
    { value: 4, label: "קשה" },
  ]

  const measurementTypes = ["יחידה", "כפית", "כף", "כוס", "גרם", "קילוגרם", "מיליליטר", "ליטר", "חבילה", "קופסה"]

  return (
    <Paper elevation={3} className="recipe-form-container">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {initialData ? "עריכת מתכון" : "הוספת מתכון חדש"}
            </Typography>
            <Divider />
          </Box>

          {/* Basic Recipe Information */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Controller
                name="Name"
                control={control}
                rules={{ required: "שם המתכון הוא שדה חובה" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="שם המתכון"
                    fullWidth
                    error={!!errors.Name}
                    helperText={errors.Name?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Controller
                name="Img"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="קישור לתמונה" fullWidth placeholder="הזן URL לתמונה" />
                )}
              />
            </Box>
          </Box>

          <Box>
            <Controller
              name="Description"
              control={control}
              rules={{ required: "תיאור המתכון הוא שדה חובה" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="תיאור המתכון"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.Description}
                  helperText={errors.Description?.message}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Controller
                name="CategoryId"
                control={control}
                rules={{ required: "קטגוריה היא שדה חובה" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.CategoryId}>
                    <InputLabel>קטגוריה</InputLabel>
                    <Select {...field} label="קטגוריה">
                      {categories.map((category) => (
                        <MenuItem key={category.Id} value={category.Id}>
                          {category.Name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.CategoryId && <FormHelperText>{errors.CategoryId.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Controller
                name="Duration"
                control={control}
                rules={{
                  required: "זמן הכנה הוא שדה חובה",
                  min: { value: 5, message: "זמן הכנה מינימלי הוא 5 דקות" },
                  max: { value: 300, message: "זמן הכנה מקסימלי הוא 300 דקות" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="זמן הכנה (דקות)"
                    type="number"
                    fullWidth
                    error={!!errors.Duration}
                    helperText={errors.Duration?.message}
                    InputProps={{ inputProps: { min: 5, max: 300 } }}
                  />
                )}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Controller
                name="Difficulty"
                control={control}
                rules={{ required: "רמת קושי היא שדה חובה" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.Difficulty}>
                    <InputLabel>רמת קושי</InputLabel>
                    <Select {...field} label="רמת קושי">
                      {difficultyLevels.map((level) => (
                        <MenuItem key={level.value} value={level.value}>
                          {level.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.Difficulty && <FormHelperText>{errors.Difficulty.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Box>
          </Box>

          {/* Ingredients Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              מרכיבים
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {ingredientFields.map((field, index) => (
              <Box key={field.id} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: "center" }}>
                  <Box sx={{ flex: { xs: 1, md: 5 } }}>
                    <Controller
                      name={`Ingrident.${index}.Name`}
                      control={control}
                      rules={{ required: "שם המרכיב הוא שדה חובה" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="שם המרכיב"
                          fullWidth
                          error={!!errors.Ingrident?.[index]?.Name}
                          helperText={errors.Ingrident?.[index]?.Name?.message}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ flex: { xs: 1, md: 2 } }}>
                    <Controller
                      name={`Ingrident.${index}.Count`}
                      control={control}
                      rules={{
                        required: "כמות היא שדה חובה",
                        min: { value: 0.1, message: "כמות מינימלית היא 0.1" },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="כמות"
                          type="number"
                          fullWidth
                          inputProps={{ step: 0.1 }}
                          error={!!errors.Ingrident?.[index]?.Count}
                          helperText={errors.Ingrident?.[index]?.Count?.message}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ flex: { xs: 1, md: 3 } }}>
                    <Controller
                      name={`Ingrident.${index}.Type`}
                      control={control}
                      rules={{ required: "סוג המידה הוא שדה חובה" }}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.Ingrident?.[index]?.Type}>
                          <InputLabel>סוג</InputLabel>
                          <Select {...field} label="סוג">
                            {measurementTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.Ingrident?.[index]?.Type && (
                            <FormHelperText>{errors.Ingrident?.[index]?.Type?.message}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "center" } }}>
                    <IconButton
                      color="error"
                      onClick={() => removeIngredient(index)}
                      disabled={ingredientFields.length === 1}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}

            <Button
              startIcon={<Add />}
              onClick={() => appendIngredient(defaultIngredient)}
              variant="outlined"
              sx={{ mt: 1 }}
            >
              הוסף מרכיב
            </Button>
          </Box>

          {/* Instructions Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              הוראות הכנה
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {instructionFields.map((field, index) => (
              <Box key={field.id} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Box sx={{ flex: 1 }}>
                    <Controller
                      name={`Instructions.${index}`}
                      control={control}
                      rules={{ required: "הוראה היא שדה חובה" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={`שלב ${index + 1}`}
                          fullWidth
                          multiline
                          rows={2}
                          error={!!errors.Instructions?.[index]}
                          helperText={errors.Instructions?.[index]?.message}
                        />
                      )}
                    />
                  </Box>
                  <Box>
                    <IconButton
                      color="error"
                      onClick={() => removeInstruction(index)}
                      disabled={instructionFields.length === 1}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}

            <Button startIcon={<Add />} onClick={() => appendInstruction("" as any)} variant="outlined" sx={{ mt: 1 }}>
              הוסף שלב
            </Button>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="outlined" color="secondary" onClick={() => reset(initialData || defaultValues)}>
                נקה טופס
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {initialData ? "עדכן מתכון" : "הוסף מתכון"}
              </Button>
            </Box>
          </Box>
        </Box>
      </form>
    </Paper>
  )
}

export default RecipeForm
