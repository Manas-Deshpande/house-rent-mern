import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from './api'

interface AuthUser {
  id: string
  name: string
  email: string
  type: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  initializing: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  register: (name: string, email: string, password: string, type: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setInitializing(false)
  }, [])

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const data = await authApi.login(email, password)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (name: string, email: string, password: string, type: string) => {
    await authApi.register(name, email, password, type)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
