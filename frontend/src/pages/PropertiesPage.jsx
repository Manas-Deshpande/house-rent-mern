import { useState, useEffect } from "react"
import { Building2, SlidersHorizontal, X } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { propertyApi, getImageUrl } from "@/lib/api"

export default function PropertiesPage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    propertyType: "",
    propertyAdType: "",
    minAmt: "",
    maxAmt: "",
  })

  useEffect(() => {
    const params = {}
    if (filters.propertyType) params.propertyType = filters.propertyType
    if (filters.propertyAdType) params.propertyAdType = filters.propertyAdType
    if (filters.minAmt) params.minAmt = filters.minAmt
    if (filters.maxAmt) params.maxAmt = filters.maxAmt

    setLoading(true)
    propertyApi.getAll(params)
      .then((data) => setProperties(data.properties))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false))
  }, [filters])

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const FilterPanel = () => (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      <h3 className="font-semibold text-foreground">Filters</h3>
      <div>
        <label className="text-sm font-medium text-foreground">Property Type</label>
        <select value={filters.propertyType}
          onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="cabin">Cabin</option>
          <option value="penthouse">Penthouse</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Ad Type</label>
        <select value={filters.propertyAdType}
          onChange={(e) => setFilters({ ...filters, propertyAdType: e.target.value })}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
          <option value="">All</option>
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Min Price ($)</label>
        <input type="number" value={filters.minAmt}
          onChange={(e) => setFilters({ ...filters, minAmt: e.target.value })}
          placeholder="Min" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Max Price ($)</label>
        <input type="number" value={filters.maxAmt}
          onChange={(e) => setFilters({ ...filters, maxAmt: e.target.value })}
          placeholder="Max" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
      </div>
      {activeFilterCount > 0 && (
        <Button variant="outline" size="sm" onClick={() => setFilters({ propertyType: "", propertyAdType: "", minAmt: "", maxAmt: "" })}>
          Clear Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 lg:px-8">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground md:text-3xl">
                <Building2 className="h-7 w-7 text-primary" />
                All Properties
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {loading ? "Loading..." : properties.length + " properties found"}
              </p>
            </div>
            <Button variant="outline" className="gap-2 lg:hidden" onClick={() => setShowMobileFilters(!showMobileFilters)}>
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{activeFilterCount}</span>
              )}
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="flex gap-8">
            <div className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-24"><FilterPanel /></div>
            </div>

            {showMobileFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-foreground/40" onClick={() => setShowMobileFilters(false)} />
                <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-background p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                    <button onClick={() => setShowMobileFilters(false)} className="rounded-lg p-1 hover:bg-secondary">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <FilterPanel />
                </div>
              </div>
            )}

            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Building2 className="mb-4 h-12 w-12 text-muted-foreground/40" />
                  <h3 className="text-lg font-semibold text-foreground">No properties found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {properties.map((property) => (
                    <a key={property._id} href={"/properties/" + property._id}
                      className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img src={getImageUrl(property)} alt={property.propertyAddress}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800" }} />
                        <div className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-xs font-medium text-primary-foreground capitalize">
                          {property.propertyAdType}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground capitalize">{property.propertyType}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{property.propertyAddress}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">${property.propertyAmt.toLocaleString()}/mo</span>
                          <span className="text-xs text-muted-foreground">by {property.ownerName}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
