"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { Container, Paper, Typography, TextField, Button, Box, Link, Alert, CircularProgress } from "@mui/material"
import { PersonAdd } from "@mui/icons-material"
import { register as registerUser } from "../store/authSlice"
import type { RootState } from "../store/store"
import type { User } from "../types/user"
import { useAppDispatch } from "../store/store"
import "../styles/AuthPages.css"

const RegisterPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<User & { confirmPassword: string }>({
    defaultValues: {
      UserName: "",
      Password: "",
      confirmPassword: "",
      Name: "",
      Email: "",
      Phone: "",
      Tz: "",
    },
  })

  const password = watch("Password")

  useEffect(() => {
    // Reset error when component mounts
    setRegisterError(null)
  }, [])

  const onSubmit = async (data: User & { confirmPassword: string }) => {
    setRegisterError(null)
    setFormSubmitted(true)

    // Remove confirmPassword from data before sending to API
    const { confirmPassword, ...userData } = data

    try {
      console.log("Form data submitted:", userData)
      const resultAction = await dispatch(registerUser(userData))

      if (registerUser.fulfilled.match(resultAction)) {
        console.log("Registration successful:", resultAction.payload)
        navigate("/")
      } else if (registerUser.rejected.match(resultAction) && resultAction.payload) {
        console.error("Registration rejected with payload:", resultAction.payload)
        setRegisterError(resultAction.payload as string)
      } else if (registerUser.rejected.match(resultAction) && resultAction.error) {
        console.error("Registration rejected with error:", resultAction.error)
        setRegisterError("שגיאה בהרשמה. אנא נסה שוב מאוחר יותר.")
      }
    } catch (err) {
      console.error("Registration exception:", err)
      setRegisterError("שגיאה בהרשמה. אנא נסה שוב מאוחר יותר.")
    }
  }

  return (
    <Container maxWidth="sm" className="auth-container">
      <Paper elevation={3} className="auth-paper">
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <PersonAdd color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            הרשמה
          </Typography>
          <Typography variant="body1" color="textSecondary">
            הירשם כדי להתחיל לשתף ולגלות מתכונים
          </Typography>
        </Box>

        {(registerError || error) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {registerError || error}
          </Alert>
        )}

        {formSubmitted && !registerError && !error && !isLoading && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ההרשמה בוצעה בהצלחה! מעביר אותך לדף הבית...
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Controller
                name="Name"
                control={control}
                rules={{
                  required: "שם מלא הוא שדה חובה",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="שם מלא"
                    variant="outlined"
                    fullWidth
                    error={!!errors.Name}
                    helperText={errors.Name?.message}
                  />
                )}
              />
            </Box>
            <Box>
              <Controller
                name="UserName"
                control={control}
                rules={{
                  required: "שם משתמש הוא שדה חובה",
                  minLength: {
                    value: 3,
                    message: "שם משתמש חייב להכיל לפחות 3 תווים",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="שם משתמש"
                    variant="outlined"
                    fullWidth
                    error={!!errors.UserName}
                    helperText={errors.UserName?.message}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="Password"
                  control={control}
                  rules={{
                    required: "סיסמה היא שדה חובה",
                    minLength: {
                      value: 6,
                      message: "סיסמה חייבת להכיל לפחות 6 תווים",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="password"
                      label="סיסמה"
                      variant="outlined"
                      fullWidth
                      error={!!errors.Password}
                      helperText={errors.Password?.message}
                    />
                  )}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required: "אימות סיסמה הוא שדה חובה",
                    validate: (value) => value === password || "הסיסמאות אינן תואמות",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="password"
                      label="אימות סיסמה"
                      variant="outlined"
                      fullWidth
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                    />
                  )}
                />
              </Box>
            </Box>
            <Box>
              <Controller
                name="Email"
                control={control}
                rules={{
                  required: 'דוא"ל הוא שדה חובה',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'כתובת דוא"ל לא תקינה',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="email"
                    label='דוא"ל'
                    variant="outlined"
                    fullWidth
                    error={!!errors.Email}
                    helperText={errors.Email?.message}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="Phone"
                  control={control}
                  rules={{
                    required: "מספר טלפון הוא שדה חובה",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "מספר טלפון לא תקין (10 ספרות)",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="טלפון"
                      variant="outlined"
                      fullWidth
                      error={!!errors.Phone}
                      helperText={errors.Phone?.message}
                    />
                  )}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="Tz"
                  control={control}
                  rules={{
                    required: "תעודת זהות היא שדה חובה",
                    pattern: {
                      value: /^[0-9]{9}$/,
                      message: "תעודת זהות לא תקינה (9 ספרות)",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="תעודת זהות"
                      variant="outlined"
                      fullWidth
                      error={!!errors.Tz}
                      helperText={errors.Tz?.message}
                    />
                  )}
                />
              </Box>
            </Box>
            <Box sx={{ mt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : undefined}
              >
                {isLoading ? "נרשם..." : "הירשם"}
              </Button>
            </Box>
          </Box>
        </form>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2">
            כבר יש לך חשבון?{" "}
            <Link component={RouterLink} to="/login" color="primary">
              התחבר כאן
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default RegisterPage
