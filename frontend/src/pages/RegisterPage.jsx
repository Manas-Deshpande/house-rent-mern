import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Home, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "renter",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      const type = form.role === "owner" ? "owner" : "user"
      await register(form.name, form.email, form.password, type)
      const user = await login(form.email, form.password)
      toast.success("Account created successfully!", {
        description: `Welcome to HomeNest, ${user.name}!`,
      })
      if (user.type === "owner") navigate("/owner")
      else navigate("/user/dashboard")
    } catch (err) {
      toast.error("Registration failed", { description: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Home className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-card-foreground">Create Account</h1>
              <p className="mt-1 text-sm text-muted-foreground">Join HomeNest and find your dream home</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-card-foreground">Full Name</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-secondary px-4 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-ring">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <input id="name" type="text" placeholder="John Doe" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-card-foreground">Email Address</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-secondary px-4 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-ring">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <input id="email" type="email" placeholder="you@example.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-card-foreground">I want to</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ value: "renter", label: "Rent a Home" }, { value: "owner", label: "List Property" }].map((option) => (
                    <button key={option.value} type="button" onClick={() => setForm({ ...form, role: option.value })}
                      className={"rounded-xl border px-4 py-3 text-sm font-medium transition-colors " + (form.role === option.value ? "border-primary bg-primary/10 text-primary" : "border-input bg-secondary text-muted-foreground hover:border-primary/50")}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-card-foreground">Password</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-secondary px-4 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-ring">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required minLength={8} className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-card-foreground">Confirm Password</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-secondary px-4 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-ring">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <input id="confirmPassword" type="password" placeholder="Confirm your password"
                    value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="mt-2 w-full rounded-xl bg-accent py-6 text-accent-foreground hover:bg-accent/90">
                {loading ? (<span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />Creating account...</span>) : "Create Account"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
