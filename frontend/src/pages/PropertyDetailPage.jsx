import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft, MapPin, User, CalendarCheck, Home, Check, Phone
} from "lucide-react"
import { toast } from "sonner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { propertyApi, bookingApi, getImageUrl } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

export default function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState({ phone: "" })
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    propertyApi.getById(id)
      .then((data) => setProperty(data.property))
      .catch(() => setProperty(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error("Please login to book this property")
      navigate("/login")
      return
    }
    if (user.type !== "user") {
      toast.error("Only regular users can book properties")
      return
    }
    setBookingLoading(true)
    try {
      await bookingApi.create(property._id, property.ownerId, user.name, booking.phone)
      toast.success("Booking request sent!", { description: "The owner will review your request." })
      setBooking({ phone: "" })
    } catch (err) {
      toast.error("Booking failed", { description: err.message })
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Property not found</h1>
            <Link to="/properties" className="mt-4 inline-block text-primary">Back to Properties</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 lg:px-8">
            <Link to="/properties" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to Properties
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                <img src={getImageUrl(property)} alt={property.propertyAddress}
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800" }} />
                <div className="absolute left-4 top-4 rounded-full bg-primary/90 px-3 py-1.5 text-sm font-medium text-primary-foreground capitalize">
                  {property.propertyAdType}
                </div>
              </div>

              <div className="mt-6">
                <h1 className="text-balance text-2xl font-bold text-foreground md:text-3xl capitalize">
                  {property.propertyType} - {property.propertyAddress}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {property.propertyAddress}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3">
                  <Home className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-card-foreground capitalize">{property.propertyType}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-card-foreground">{property.ownerContact}</span>
                </div>
              </div>

              {property.additionalInfo && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-foreground">About this property</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{property.additionalInfo}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    ${property.propertyAmt.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>

                <div className="border-t border-border" />

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{property.ownerName}</p>
                    <p className="text-xs text-muted-foreground">Property Owner</p>
                  </div>
                </div>

                <div className="border-t border-border" />

                <form onSubmit={handleBook} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-card-foreground">Your Phone Number</label>
                    <input
                      type="tel"
                      value={booking.phone}
                      onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                      placeholder="+1 234 567 8900"
                      required
                      className="rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                    size="lg"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    {bookingLoading ? "Sending..." : "Book Property"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
