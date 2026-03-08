"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Home,
  Menu,
  X,
  User,
  LogIn,
  LogOut,
  Building2,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

const navLinks = [
  { href: "/", label: "Home", icon: Home },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dashboardOpen, setDashboardOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate("/")
  }

  const dashboardHref =
    user?.type === "admin" ? "/admin" :
    user?.type === "owner" ? "/owner" :
    "/user/dashboard"

  const dashboardLabel =
    user?.type === "admin" ? "Admin Panel" :
    user?.type === "owner" ? "Owner Dashboard" :
    "My Dashboard"

  const DashboardIcon = user?.type === "admin" ? ShieldCheck : user?.type === "owner" ? Building2 : LayoutDashboard

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            HomeNest
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground",
                pathname === link.href
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}

          {/* Dashboard link — only when logged in */}
          {isAuthenticated && (
            <Link
              to={dashboardHref}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground",
                pathname.startsWith(dashboardHref)
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground"
              )}
            >
              <DashboardIcon className="h-4 w-4" />
              {dashboardLabel}
            </Link>
          )}

          {/* My Properties — only for owners */}
          {user?.type === "owner" && (
            <Link
              to="/owner/properties"
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground",
                pathname === "/owner/properties"
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Building2 className="h-4 w-4" />
              My Properties
            </Link>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                Hi, <span className="font-medium text-foreground">{user?.name}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <User className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <div className="my-1 border-t border-border" />
                <Link
                  to={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname.startsWith(dashboardHref)
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <DashboardIcon className="h-4 w-4" />
                  {dashboardLabel}
                </Link>
                {user?.type === "owner" && (
                  <Link
                    to="/owner/properties"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === "/owner/properties"
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <Building2 className="h-4 w-4" />
                    My Properties
                  </Link>
                )}
              </>
            )}

            <div className="my-1 border-t border-border" />

            {isAuthenticated ? (
              <div className="flex flex-col gap-1">
                <p className="px-3 py-1 text-xs text-muted-foreground">
                  Signed in as <span className="font-medium text-foreground">{user?.name}</span>
                </p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full gap-1.5">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <User className="h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
