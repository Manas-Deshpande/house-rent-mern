import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { properties } from "@/lib/data"

export default function HomePage() {
  const featured = properties.filter((p) => p.available).slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />

        {/* Featured Properties */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Featured Listings
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Top Properties
                </h2>
              </div>
              <Link to="/properties">
                <Button variant="outline" className="hidden gap-1.5 md:flex">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="mt-8 flex justify-center md:hidden">
              <Link to="/properties">
                <Button variant="outline" className="gap-1.5">
                  View All Properties
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <FeaturesSection />

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="overflow-hidden rounded-2xl bg-primary p-8 text-center md:p-16">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
                Ready to Find Your New Home?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-primary-foreground/80">
                Join thousands of happy renters who found their perfect home
                through HomeNest. Start your search today.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/properties">
                  <Button
                    size="lg"
                    className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Browse Properties
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
