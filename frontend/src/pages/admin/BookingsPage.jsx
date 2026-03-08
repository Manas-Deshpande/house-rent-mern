import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { bookingApi } from "@/lib/api"

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingApi.adminGetAll()
      .then(d => setBookings(d.bookings))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />Back to Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Manage Bookings</h1>
          <p className="mt-2 text-muted-foreground">View and manage all bookings on the platform</p>

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
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-border">
                      <td className="px-4 py-3 text-sm text-foreground capitalize">
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
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">No bookings found</td></tr>
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
