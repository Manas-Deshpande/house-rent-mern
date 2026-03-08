import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { CalendarCheck, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { bookingApi } from "@/lib/api"

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = () => {
    setLoading(true)
    bookingApi.getOwnerBookings()
      .then(d => setBookings(d.bookings))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings() }, [])

  const handleStatus = async (id, bookingStatus) => {
    try {
      await bookingApi.updateStatus(id, bookingStatus)
      toast.success("Status updated to " + bookingStatus)
      fetchBookings()
    } catch (err) {
      toast.error("Failed to update", { description: err.message })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <Link to="/owner" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />Back to Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-foreground">My Bookings</h1>
          <p className="mt-2 text-muted-foreground">Manage booking requests for your properties</p>

          {loading ? (
            <div className="mt-12 flex justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="mt-8 overflow-x-auto rounded-xl border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Property</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Guest</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-border">
                      <td className="px-4 py-3 text-sm font-medium text-foreground capitalize">
                        {booking.propertId?.propertyType || "Property"} - {booking.propertId?.propertyAddress || ""}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{booking.userName}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{booking.phone}</td>
                      <td className="px-4 py-3">
                        <span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium " + (
                          booking.bookingStatus === "confirmed" ? "bg-green-100 text-green-800" :
                          booking.bookingStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        )}>{booking.bookingStatus}</span>
                      </td>
                      <td className="px-4 py-3">
                        {booking.bookingStatus === "pending" && (
                          <div className="flex gap-1">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs"
                              onClick={() => handleStatus(booking._id, "confirmed")}>Confirm</Button>
                            <Button size="sm" variant="outline" className="text-destructive text-xs"
                              onClick={() => handleStatus(booking._id, "rejected")}>Reject</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No bookings yet
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {bookings.length === 0 && !loading && (
            <div className="mt-12 text-center">
              <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No bookings yet</h3>
              <p className="mt-2 text-muted-foreground">When guests book your properties, they appear here</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
