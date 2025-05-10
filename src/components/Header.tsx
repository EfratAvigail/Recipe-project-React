"use client"

import type React from "react"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Menu as MenuIcon, RestaurantMenu } from "@mui/icons-material"
import type { RootState } from "../store/store"
import { logout } from "../store/authSlice"

const Header = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl)

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMobileMenuAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    handleMenuClose()
    navigate("/")
  }

  const menuId = "primary-search-account-menu"
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {isAuthenticated
        ? [
            <MenuItem key="profile" onClick={handleMenuClose}>
              פרופיל
            </MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>
              התנתק
            </MenuItem>,
          ]
        : [
            <MenuItem
              key="login"
              onClick={() => {
                handleMenuClose()
                navigate("/login")
              }}
            >
              התחברות
            </MenuItem>,
            <MenuItem
              key="register"
              onClick={() => {
                handleMenuClose()
                navigate("/register")
              }}
            >
              הרשמה
            </MenuItem>,
          ]}
    </Menu>
  )

  const mobileMenuId = "primary-search-account-menu-mobile"
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={() => setMobileMenuAnchorEl(null)}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose()
          navigate("/")
        }}
      >
        דף הבית
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose()
          navigate("/recipes")
        }}
      >
        מתכונים
      </MenuItem>
      {isAuthenticated && (
        <MenuItem
          onClick={() => {
            handleMenuClose()
            navigate("/recipes/add")
          }}
        >
          הוסף מתכון
        </MenuItem>
      )}
      {isAuthenticated ? (
        <MenuItem onClick={handleLogout}>התנתק</MenuItem>
      ) : (
        [
          <MenuItem
            key="login"
            onClick={() => {
              handleMenuClose()
              navigate("/login")
            }}
          >
            התחברות
          </MenuItem>,
          <MenuItem
            key="register"
            onClick={() => {
              handleMenuClose()
              navigate("/register")
            }}
          >
            הרשמה
          </MenuItem>,
        ]
      )}
    </Menu>
  )

  return (
    <AppBar position="static" color="primary" sx={{ direction: "rtl" }}>
      <Container>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
              alignItems: "center",
            }}
          >
            <RestaurantMenu sx={{ mr: 1 }} />
            מתכונים טעימים
          </Typography>

          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={handleMobileMenuOpen}>
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: "flex" }}>
                <Button color="inherit" component={RouterLink} to="/">
                  דף הבית
                </Button>
                <Button color="inherit" component={RouterLink} to="/recipes">
                  מתכונים
                </Button>
                {isAuthenticated && (
                  <Button color="inherit" component={RouterLink} to="/recipes/add">
                    הוסף מתכון
                  </Button>
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                {isAuthenticated ? (
                  <>
                    <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                      שלום, {user?.Name || "משתמש"}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                      התנתק
                    </Button>
                  </>
                ) : (
                  <>
                    <Button color="inherit" component={RouterLink} to="/login">
                      התחברות
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/register">
                      הרשמה
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
      {renderMobileMenu}
      {renderMenu}
    </AppBar>
  )
}

export default Header
