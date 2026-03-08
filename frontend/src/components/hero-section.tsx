"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, MapPin, Home, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const navigate = useNavigate()
  const [location, setLocation] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [priceRange, setPriceRange] = useState("")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (propertyType) params.set("type", propertyType)
    if (priceRange) params.set("price", priceRange)
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative flex min-h-[600px] items-center overflow-hidden lg:min-h-[700px]">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.jpg"
          alt="Beautiful modern home"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-3 inline-block rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-sm">
            Trusted by 10,000+ renters
          </p>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Find Your Dream{" "}
            <span className="text-accent">Rental Home</span>
          </h1>
          <p className="mt-4 max-w-lg text-pretty text-lg leading-relaxed text-primary-foreground/80">
            Browse thousands of verified properties across the country. Your
            perfect home is just a search away.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 max-w-4xl">
          <div className="flex flex-col gap-3 rounded-2xl border border-primary-foreground/10 bg-card/95 p-4 shadow-2xl backdrop-blur-md md:flex-row md:items-end md:gap-2 md:rounded-full md:p-2">
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary px-4 py-3 md:rounded-full">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <input
                type="text"
                placeholder="Where do you want to live?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary px-4 py-3 md:rounded-full">
              <Home className="h-4 w-4 shrink-0 text-primary" />
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              >
                <option value="">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="cabin">Cabin</option>
                <option value="penthouse">Penthouse</option>
                <option value="loft">Loft</option>
              </select>
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary px-4 py-3 md:rounded-full">
              <DollarSign className="h-4 w-4 shrink-0 text-primary" />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              >
                <option value="">Price Range</option>
                <option value="0-2000">Under $2,000</option>
                <option value="2000-4000">$2,000 - $4,000</option>
                <option value="4000-6000">$4,000 - $6,000</option>
                <option value="6000+">$6,000+</option>
              </select>
            </div>
            <Button
              onClick={handleSearch}
              size="lg"
              className="gap-2 rounded-xl bg-primary px-8 text-primary-foreground hover:bg-primary/90 md:rounded-full"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 flex flex-wrap gap-8">
          {[
            { label: "Properties", value: "2,500+" },
            { label: "Happy Renters", value: "10,000+" },
            { label: "Cities", value: "150+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-primary-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-primary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
