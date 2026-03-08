import { MapPin, Home, DollarSign, Bed, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

const locations = [
  "All Locations",
  "Manhattan, New York",
  "Austin, Texas",
  "Malibu, California",
  "Chicago, Illinois",
  "Aspen, Colorado",
  "Miami, Florida",
]

const types = [
  { value: "", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "cabin", label: "Cabin" },
  { value: "penthouse", label: "Penthouse" },
  { value: "loft", label: "Loft" },
]

const priceRanges = [
  { value: "", label: "Any Price" },
  { value: "0-2000", label: "Under $2,000" },
  { value: "2000-4000", label: "$2,000 - $4,000" },
  { value: "4000-6000", label: "$4,000 - $6,000" },
  { value: "6000+", label: "$6,000+" },
]

const bedroomOptions = [
  { value: "", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
]

export function FilterSidebar({ filters, onFilterChange }) {
  const handleReset = () => {
    onFilterChange({ location: "", type: "", priceRange: "", bedrooms: "" })
  }

  return (
    <aside className="flex flex-col gap-6 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">Filters</h2>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Location
        </label>
        <select
          value={filters.location}
          onChange={(e) =>
            onFilterChange({ ...filters, location: e.target.value })
          }
          className="rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc === "All Locations" ? "" : loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
          <Home className="h-3.5 w-3.5 text-primary" />
          Property Type
        </label>
        <select
          value={filters.type}
          onChange={(e) =>
            onFilterChange({ ...filters, type: e.target.value })
          }
          className="rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {types.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
          <DollarSign className="h-3.5 w-3.5 text-primary" />
          Price Range
        </label>
        <select
          value={filters.priceRange}
          onChange={(e) =>
            onFilterChange({ ...filters, priceRange: e.target.value })
          }
          className="rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {priceRanges.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Bedrooms */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
          <Bed className="h-3.5 w-3.5 text-primary" />
          Bedrooms
        </label>
        <div className="flex gap-1.5">
          {bedroomOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                onFilterChange({ ...filters, bedrooms: opt.value })
              }
              className={`flex-1 rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${
                filters.bedrooms === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input bg-secondary text-muted-foreground hover:border-primary/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={() => {}}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Apply Filters
      </Button>
    </aside>
  )
}
