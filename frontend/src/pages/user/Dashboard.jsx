import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Building2, CalendarCheck, Search, X } from "lucide-react"
import { toast } from "sonner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { bookingApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingApi.getUserBookings()
      .then(d => setBookings(d.bookings))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id) => {
    try {
      await bookingApi.cancelBooking(id)
      setBookings(prev => prev.filter(b => b._id !== id))
      toast.success("Booking cancelled")
    } catch (err) {
      toast.error("Failed to cancel booking", { description: err.message })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
              <p className="mt-2 text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
            <Link to="/properties">
              <Button className="gap-2">
                <Search className="h-4 w-4" />
                Browse Properties
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <CalendarCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Bookings</p>
                  <p className="text-2xl font-bold text-foreground">{bookings.filter(b => b.bookingStatus !== "completed").length}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed Bookings</p>
                  <p className="text-2xl font-bold text-foreground">
                    {bookings.filter(b => b.bookingStatus === "confirmed").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-foreground">My Bookings</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Property</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Address</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">Loading...</td></tr>
                  )}
                  {!loading && bookings.filter(b => b.bookingStatus !== "completed").map((booking) => (
                    <tr key={booking._id} className="border-b border-border">
                      <td className="px-4 py-3 text-sm text-foreground capitalize">
                        {booking.propertId?.propertyType || "Property"}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {booking.propertId?.propertyAddress || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {booking.propertId?.propertyAmt ? `$${booking.propertId.propertyAmt.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium " + (statusColors[booking.bookingStatus] || "bg-gray-100 text-gray-800")}>
                          {booking.bookingStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {booking.bookingStatus === "pending" && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800"
                          >
                            <X className="h-3 w-3" />
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!loading && bookings.filter(b => b.bookingStatus !== "completed").length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No bookings yet.{" "}
                        <Link to="/properties" className="text-primary hover:underline">Browse properties</Link>
                        {" "}to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
