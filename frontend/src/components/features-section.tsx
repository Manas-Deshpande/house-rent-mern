"use client"

import { Shield, CreditCard, Headphones, Star } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Verified Properties",
    description:
      "Every property on our platform is verified by our team to ensure authenticity and quality.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Make payments securely through our platform with multiple payment options and buyer protection.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any queries.",
  },
  {
    icon: Star,
    title: "Best Prices",
    description:
      "We guarantee the best prices on all properties with our price match policy.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Why Choose Us
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Your Trusted Rental Partner
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            We make finding and renting your dream home simple, secure, and
            stress-free with our comprehensive platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
