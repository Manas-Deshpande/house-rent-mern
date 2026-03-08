export interface Property {
  id: string
  title: string
  location: string
  price: number
  rating: number
  image: string
  type: "apartment" | "house" | "villa" | "cabin" | "penthouse" | "loft"
  bedrooms: number
  bathrooms: number
  sqft: number
  available: boolean
  owner: string
  description: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "owner" | "renter"
  joinedDate: string
  status: "active" | "inactive"
  avatar: string
}

export interface Booking {
  id: string
  propertyId: string
  propertyTitle: string
  renterName: string
  renterEmail: string
  ownerName: string
  checkIn: string
  checkOut: string
  totalPrice: number
  status: "confirmed" | "pending" | "cancelled"
  createdAt: string
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Luxurious Downtown Apartment",
    location: "Manhattan, New York",
    price: 3200,
    rating: 4.8,
    image: "/images/property-1.jpg",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    available: true,
    owner: "Sarah Johnson",
    description:
      "A stunning modern apartment in the heart of Manhattan with floor-to-ceiling windows and breathtaking city views.",
  },
  {
    id: "2",
    title: "Charming Suburban Family Home",
    location: "Austin, Texas",
    price: 2100,
    rating: 4.6,
    image: "/images/property-2.jpg",
    type: "house",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    available: true,
    owner: "Michael Chen",
    description:
      "A beautiful family home with a spacious backyard, modern kitchen, and quiet neighborhood perfect for families.",
  },
  {
    id: "3",
    title: "Oceanfront Beach Villa",
    location: "Malibu, California",
    price: 5500,
    rating: 4.9,
    image: "/images/property-3.jpg",
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4200,
    available: true,
    owner: "Sarah Johnson",
    description:
      "An exquisite beachfront villa with private access to the ocean, infinity pool, and panoramic coastal views.",
  },
  {
    id: "4",
    title: "Industrial Chic Downtown Loft",
    location: "Chicago, Illinois",
    price: 2800,
    rating: 4.5,
    image: "/images/property-4.jpg",
    type: "loft",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 1800,
    available: false,
    owner: "Michael Chen",
    description:
      "A unique industrial loft with exposed brick, high ceilings, and an open floor plan in a vibrant downtown location.",
  },
  {
    id: "5",
    title: "Cozy Mountain Retreat Cabin",
    location: "Aspen, Colorado",
    price: 1800,
    rating: 4.7,
    image: "/images/property-5.jpg",
    type: "cabin",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1600,
    available: true,
    owner: "Emily Rodriguez",
    description:
      "A warm and inviting mountain cabin nestled among pine trees, perfect for a getaway with stunning alpine views.",
  },
  {
    id: "6",
    title: "Skyline Penthouse Suite",
    location: "Miami, Florida",
    price: 7200,
    rating: 4.9,
    image: "/images/property-6.jpg",
    type: "penthouse",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 3500,
    available: true,
    owner: "Emily Rodriguez",
    description:
      "A breathtaking penthouse with panoramic city and ocean views, luxury finishes, and a private rooftop terrace.",
  },
]

export const users: User[] = [
  {
    id: "u1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "owner",
    joinedDate: "2024-01-15",
    status: "active",
    avatar: "SJ",
  },
  {
    id: "u2",
    name: "Michael Chen",
    email: "michael@example.com",
    role: "owner",
    joinedDate: "2024-02-20",
    status: "active",
    avatar: "MC",
  },
  {
    id: "u3",
    name: "Emily Rodriguez",
    email: "emily@example.com",
    role: "owner",
    joinedDate: "2024-03-10",
    status: "active",
    avatar: "ER",
  },
  {
    id: "u4",
    name: "James Wilson",
    email: "james@example.com",
    role: "renter",
    joinedDate: "2024-04-05",
    status: "active",
    avatar: "JW",
  },
  {
    id: "u5",
    name: "Lisa Park",
    email: "lisa@example.com",
    role: "renter",
    joinedDate: "2024-05-12",
    status: "inactive",
    avatar: "LP",
  },
  {
    id: "u6",
    name: "David Brown",
    email: "david@example.com",
    role: "admin",
    joinedDate: "2023-12-01",
    status: "active",
    avatar: "DB",
  },
]

export const bookings: Booking[] = [
  {
    id: "b1",
    propertyId: "1",
    propertyTitle: "Luxurious Downtown Apartment",
    renterName: "James Wilson",
    renterEmail: "james@example.com",
    ownerName: "Sarah Johnson",
    checkIn: "2026-04-01",
    checkOut: "2026-04-07",
    totalPrice: 19200,
    status: "confirmed",
    createdAt: "2026-03-01",
  },
  {
    id: "b2",
    propertyId: "3",
    propertyTitle: "Oceanfront Beach Villa",
    renterName: "Lisa Park",
    renterEmail: "lisa@example.com",
    ownerName: "Sarah Johnson",
    checkIn: "2026-04-15",
    checkOut: "2026-04-22",
    totalPrice: 38500,
    status: "pending",
    createdAt: "2026-03-05",
  },
  {
    id: "b3",
    propertyId: "5",
    propertyTitle: "Cozy Mountain Retreat Cabin",
    renterName: "James Wilson",
    renterEmail: "james@example.com",
    ownerName: "Emily Rodriguez",
    checkIn: "2026-05-01",
    checkOut: "2026-05-05",
    totalPrice: 7200,
    status: "confirmed",
    createdAt: "2026-03-02",
  },
  {
    id: "b4",
    propertyId: "2",
    propertyTitle: "Charming Suburban Family Home",
    renterName: "Lisa Park",
    renterEmail: "lisa@example.com",
    ownerName: "Michael Chen",
    checkIn: "2026-03-20",
    checkOut: "2026-03-25",
    totalPrice: 10500,
    status: "cancelled",
    createdAt: "2026-02-28",
  },
  {
    id: "b5",
    propertyId: "6",
    propertyTitle: "Skyline Penthouse Suite",
    renterName: "James Wilson",
    renterEmail: "james@example.com",
    ownerName: "Emily Rodriguez",
    checkIn: "2026-06-10",
    checkOut: "2026-06-17",
    totalPrice: 50400,
    status: "pending",
    createdAt: "2026-03-04",
  },
]
