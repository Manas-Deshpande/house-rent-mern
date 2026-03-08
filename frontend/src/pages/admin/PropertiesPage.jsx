import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Building2, ArrowLeft, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { propertyApi, getImageUrl } from "@/lib/api"

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProperties = () => {
    setLoading(true)
    propertyApi.adminGetAll().then(d => setProperties(d.properties)).catch(() => setProperties([])).finally(() => setLoading(false))
  }

  useEffect(() => { fetchProperties() }, [])

  const handleDelete = async (id) => {
    if (!confirm("Delete this property?")) return
    try {
      await propertyApi.adminDelete(id)
      toast.success("Property deleted")
      fetchProperties()
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
          <h1 className="mt-4 text-3xl font-bold text-foreground">Manage Properties</h1>
          <p className="mt-2 text-muted-foreground">View and manage all properties on the platform</p>

          {loading ? (
            <div className="mt-12 flex justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <div key={property._id} className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <div className="relative aspect-[4/3]">
                    <img src={getImageUrl(property)} alt={property.propertyAddress}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800" }} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground capitalize">{property.propertyType}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{property.propertyAddress}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">by {property.ownerName}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">${property.propertyAmt.toLocaleString()}/mo</span>
                      <Button variant="outline" size="sm" className="gap-1 text-destructive"
                        onClick={() => handleDelete(property._id)}>
                        <Trash2 className="h-3.5 w-3.5" />Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {properties.length === 0 && (
                <div className="col-span-3 mt-12 text-center">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No properties found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
