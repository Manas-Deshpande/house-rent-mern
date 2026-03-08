import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Building2, Users, CalendarCheck, ArrowRight, DollarSign } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { adminApi, bookingApi } from "@/lib/api"

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalProperties: 0, totalBookings: 0 })
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    adminApi.getDashboard().then(d => setStats(d.stats)).catch(() => {})
    bookingApi.adminGetAll().then(d => setBookings(d.bookings)).catch(() => {})
  }, [])

  const statCards = [
    { label: "Total Properties", value: stats.totalProperties, icon: Building2 },
    { label: "Total Users", value: stats.totalUsers, icon: Users },
    { label: "Total Bookings", value: stats.totalBookings, icon: CalendarCheck },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Manage the platform</p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {statCards.map((stat) => (
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

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { to: "/admin/users", icon: Users, title: "Manage Users", desc: "View and manage users" },
              { to: "/admin/properties", icon: Building2, title: "Manage Properties", desc: "View all listings" },
              { to: "/admin/bookings", icon: CalendarCheck, title: "Manage Bookings", desc: "View all bookings" },
            ].map((item) => (
              <Link key={item.to} to={item.to}>
                <div className="group flex items-center justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
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
