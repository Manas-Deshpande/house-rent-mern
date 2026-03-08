import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Users, ArrowLeft, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/api"

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = () => {
    setLoading(true)
    adminApi.getUsers().then(d => setUsers(d.users)).catch(() => setUsers([])).finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return
    try {
      await adminApi.deleteUser(id)
      toast.success("User deleted")
      fetchUsers()
    } catch (err) {
      toast.error("Failed to delete", { description: err.message })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />Back to Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Manage Users</h1>
          <p className="mt-2 text-muted-foreground">View and manage all users on the platform</p>

          {loading ? (
            <div className="mt-12 flex justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="mt-8 overflow-x-auto rounded-xl border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Joined</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-border">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium " + (
                          user.type === "admin" ? "bg-purple-100 text-purple-800" :
                          user.type === "owner" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        )}>{user.type}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" className="gap-1 text-destructive"
                          onClick={() => handleDelete(user._id)}>
                          <Trash2 className="h-3.5 w-3.5" />Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
