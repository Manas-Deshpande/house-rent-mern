import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Home, ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock submission - in real app would send reset email
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Home className="h-7 w-7 text-primary-foreground" />
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Forgot password?</h1>
          <p className="mt-2 text-muted-foreground">
            No worries, we'll send you reset instructions
          </p>
        </div>

        {submitted ? (
          <div className="mt-8 rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">Check your email</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a password reset link to<br />
              <span className="font-medium text-foreground">{email}</span>
            </p>
            <Button 
              onClick={() => navigate("/login")} 
              variant="outline" 
              className="mt-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <Button type="submit" className="w-full gap-2">
              <Mail className="h-4 w-4" />
              Reset Password
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
