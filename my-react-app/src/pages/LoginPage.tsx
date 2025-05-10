// "use client"

// import { useState, useEffect } from "react"
// import { useSelector } from "react-redux"
// import { useNavigate, Link as RouterLink } from "react-router-dom"
// import { useForm, Controller } from "react-hook-form"
// import { Container, Paper, Typography, TextField, Button, Box, Link, Alert, CircularProgress } from "@mui/material"
// import { Login } from "@mui/icons-material"
// import { login } from "../store/authSlice"
// import type { RootState } from "../store/store"
// import { useAppDispatch } from "../store/store"
// import "../styles/AuthPages.css"

// interface LoginFormData {
//   UserName: string
//   Password: string
// }

// const LoginPage = () => {
//   const dispatch = useAppDispatch()
//   const navigate = useNavigate()
//   const { isLoading, error } = useSelector((state: RootState) => state.auth)
//   const [loginError, setLoginError] = useState<string | null>(null)
//   const [formSubmitted, setFormSubmitted] = useState(false)

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     defaultValues: {
//       UserName: "",
//       Password: "",
//     },
//   })

//   useEffect(() => {
//     // Reset error when component mounts
//     setLoginError(null)
//   }, [])

//   const onSubmit = async (data: LoginFormData) => {
//     setLoginError(null)
//     setFormSubmitted(true)

//     try {
//       console.log("Login form data:", data)
//       const resultAction = await dispatch(login(data))

//       if (login.fulfilled.match(resultAction)) {
//         console.log("Login successful:", resultAction.payload)
//         navigate("/")
//       } else if (login.rejected.match(resultAction) && resultAction.payload) {
//         console.error("Login rejected with payload:", resultAction.payload)
//         setLoginError(resultAction.payload as string)
//       } else if (login.rejected.match(resultAction) && resultAction.error) {
//         console.error("Login rejected with error:", resultAction.error)
//         setLoginError("שגיאה בהתחברות. אנא נסה שוב מאוחר יותר.")
//       }
//     } catch (err) {
//       console.error("Login exception:", err)
//       setLoginError("שגיאה בהתחברות. אנא נסה שוב מאוחר יותר.")
//     }
//   }

//   return (
//     <Container maxWidth="sm" className="auth-container">
//       <Paper elevation={3} className="auth-paper">
//         <Box sx={{ textAlign: "center", mb: 3 }}>
//           <Login color="primary" sx={{ fontSize: 40 }} />
//           <Typography variant="h4" component="h1" gutterBottom>
//             התחברות
//           </Typography>
//           <Typography variant="body1" color="textSecondary">
//             התחבר כדי לצפות ולשתף מתכונים
//           </Typography>
//         </Box>

//         {(loginError || error) && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {loginError || error}
//           </Alert>
//         )}

//         {formSubmitted && !loginError && !error && !isLoading && (
//           <Alert severity="success" sx={{ mb: 3 }}>
//             ההתחברות בוצעה בהצלחה! מעביר אותך לדף הבית...
//           </Alert>
//         )}

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//             <Box>
//               <Controller
//                 name="UserName"
//                 control={control}
//                 rules={{
//                   required: "שם משתמש הוא שדה חובה",
//                 }}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     label="שם משתמש"
//                     variant="outlined"
//                     fullWidth
//                     error={!!errors.UserName}
//                     helperText={errors.UserName?.message}
//                   />
//                 )}
//               />
//             </Box>
//             <Box>
//               <Controller
//                 name="Password"
//                 control={control}
//                 rules={{
//                   required: "סיסמה היא שדה חובה",
//                   minLength: {
//                     value: 6,
//                     message: "סיסמה חייבת להכיל לפחות 6 תווים",
//                   },
//                 }}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     type="password"
//                     label="סיסמה"
//                     variant="outlined"
//                     fullWidth
//                     error={!!errors.Password}
//                     helperText={errors.Password?.message}
//                   />
//                 )}
//               />
//             </Box>
//             <Box>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 size="large"
//                 disabled={isLoading}
//                 startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : undefined}
//               >
//                 {isLoading ? "מתחבר..." : "התחבר"}
//               </Button>
//             </Box>
//           </Box>
//         </form>

//         <Box sx={{ mt: 3, textAlign: "center" }}>
//           <Typography variant="body2">
//             אין לך חשבון עדיין?{" "}
//             <Link component={RouterLink} to="/register" color="primary">
//               הירשם עכשיו
//             </Link>
//           </Typography>
//         </Box>
//       </Paper>
//     </Container>
//   )
// }

// export default LoginPage
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { Container, Paper, Typography, TextField, Button, Box, Link, Alert, CircularProgress } from "@mui/material"
import { Login } from "@mui/icons-material"
import { login } from "../store/authSlice"
import type { RootState } from "../store/store"
import { useAppDispatch } from "../store/store"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import "../styles/AuthPages.css"

// הגדרת הסכימה
const schema = yup.object().shape({
  UserName: yup.string().required("שם משתמש הוא שדה חובה").transform(value => value.toLowerCase()),
  Password: yup.string().min(6, "סיסמה חייבת להכיל לפחות 6  תווים").required("סיסמה היא שדה חובה"),
});

interface LoginFormData {
  UserName: string
  Password: string
}

const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)
  const [loginError, setLoginError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      UserName: "",
      Password: "",
    },
  })

  useEffect(() => {
    setLoginError(null)
  }, [])

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null)

    try {
      console.log("Login form data:", data)
      const resultAction = await dispatch(login(data))

      if (login.fulfilled.match(resultAction)) {
        console.log("Login successful:", resultAction.payload)
        navigate("/")
      } else if (login.rejected.match(resultAction)) {
        console.error("Login rejected with payload:", resultAction.payload)
        setLoginError(resultAction.payload as string)
      }
    } catch (err) {
      console.error("Login exception:", err)
      setLoginError("שגיאה בהתחברות. אנא נסה שוב מאוחר יותר.")
    }
  }

  return (
    <Container maxWidth="sm" className="auth-container">
      <Paper elevation={3} className="auth-paper">
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Login color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            התחברות
          </Typography>
          <Typography variant="body1" color="textSecondary">
            התחבר כדי לצפות ולשתף מתכונים
          </Typography>
        </Box>

        {(loginError || error) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loginError || error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Controller
                name="UserName"
                control={control}
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
            <Box>
              <Controller
                name="Password"
                control={control}
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
            <Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : undefined}
              >
                {isLoading ? "מתחבר..." : "התחבר"}
              </Button>
            </Box>
          </Box>
        </form>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2">
            אין לך חשבון עדיין?{" "}
            <Link component={RouterLink} to="/register" color="primary">
              הירשם עכשיו
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default LoginPage
