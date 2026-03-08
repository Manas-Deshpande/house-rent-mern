import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Building2, CalendarCheck, Plus, ArrowRight, DollarSign } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { propertyApi, bookingApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

export default function OwnerDashboard() {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    propertyApi.getOwnerProperties().then(d => setProperties(d.properties)).catch(() => {})
    bookingApi.getOwnerBookings().then(d => setBookings(d.bookings)).catch(() => {})
  }, [])

  const totalRevenue = bookings.filter(b => b.bookingStatus === "confirmed")
    .reduce((sum, b) => {
      const amt = b.propertId?.propertyAmt || 0
      return sum + amt
    }, 0)

  const stats = [
    { label: "Total Properties", value: properties.length, icon: Building2 },
    { label: "Active Bookings", value: bookings.filter(b => b.bookingStatus === "confirmed").length, icon: CalendarCheck },
    { label: "Total Revenue", value: "$" + totalRevenue.toLocaleString(), icon: DollarSign },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Owner Dashboard</h1>
              <p className="mt-2 text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
            <Link to="/owner/add-property">
              <Button className="gap-2"><Plus className="h-4 w-4" />Add Property</Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Link to="/owner/properties">
              <div className="group flex items-center justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">My Properties</h3>
                    <p className="text-sm text-muted-foreground">View and manage your listings</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
            <Link to="/owner/bookings">
              <div className="group flex items-center justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <CalendarCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">My Bookings</h3>
                    <p className="text-sm text-muted-foreground">View booking requests</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-foreground">Recent Bookings</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-border">
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
                  {bookings.slice(0, 5).map((booking) => (
                    <tr key={booking._id} className="border-b border-border">
                      <td className="px-4 py-3 text-sm text-foreground capitalize">{booking.propertId?.propertyType || "Property"}</td>
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
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">No bookings yet</td></tr>
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
