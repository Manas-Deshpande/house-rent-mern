"use client"

import { Link } from "react-router-dom"
import { MapPin, Star, Bed, Bath, Maximize, Eye, CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Property } from "@/lib/data"

export function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Rating badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-sm font-semibold shadow-sm backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-card-foreground">{property.rating}</span>
        </div>
        {/* Availability */}
        <div
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${
            property.available
              ? "bg-accent text-accent-foreground"
              : "bg-destructive/90 text-primary-foreground"
          }`}
        >
          {property.available ? "Available" : "Booked"}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        <div>
          <h3 className="text-balance text-lg font-semibold leading-tight text-card-foreground transition-colors group-hover:text-primary">
            {property.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {property.location}
          </p>
        </div>

        {/* Details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5" />
            {property.bedrooms} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" />
            {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="h-3.5 w-3.5" />
            {property.sqft.toLocaleString()} sqft
          </span>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div>
            <span className="text-xl font-bold text-primary">
              ${property.price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
          <div className="flex gap-1.5">
            <Link to={`/properties/${property.id}`}>
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <Eye className="h-3.5 w-3.5" />
                Details
              </Button>
            </Link>
            <Button
              size="sm"
              className="gap-1 bg-accent text-xs text-accent-foreground hover:bg-accent/90"
              disabled={!property.available}
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
