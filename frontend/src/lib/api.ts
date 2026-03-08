const BASE_URL = '/api'

function getToken(): string | null {
  return localStorage.getItem('token')
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isFormData = false
): Promise<T> {
  const headers: Record<string, string> = {}
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (!isFormData && body) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  })

  const contentType = res.headers.get('content-type')
  const data = contentType?.includes('application/json')
    ? await res.json()
    : { message: await res.text() || 'Something went wrong' }
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong')
  }
  return data
}

// ─── Auth ───────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; name: string; email: string; type: string } }>(
      'POST', '/user/login', { email, password }
    ),

  register: (name: string, email: string, password: string, type: string) =>
    request<{ message: string; userId: string }>(
      'POST', '/user/signup', { name, email, password, type }
    ),
}

// ─── Properties (public) ────────────────────────────────
export const propertyApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<{ properties: Property[] }>('GET', `/user/properties${qs}`)
  },

  getById: (id: string) =>
    request<{ property: Property }>('GET', `/user/properties/${id}`),

  // Owner
  getOwnerProperties: () =>
    request<{ properties: Property[] }>('GET', '/owner/properties'),

  create: (formData: FormData) =>
    request<{ property: Property }>('POST', '/owner/property', formData, true),

  update: (id: string, formData: FormData) =>
    request<{ property: Property }>('PUT', `/owner/property/${id}`, formData, true),

  delete: (id: string) =>
    request<{ message: string }>('DELETE', `/owner/property/${id}`),

  // Admin
  adminGetAll: () =>
    request<{ properties: Property[] }>('GET', '/admin/properties'),

  adminDelete: (id: string) =>
    request<{ message: string }>('DELETE', `/admin/property/${id}`),
}

// ─── Bookings ────────────────────────────────────────────
export const bookingApi = {
  create: (propertId: string, ownerID: string, userName: string, phone: string) =>
    request<{ booking: Booking }>('POST', '/user/booking', { propertId, ownerID, userName, phone }),

  getUserBookings: () =>
    request<{ bookings: Booking[] }>('GET', '/user/mybookings'),

  cancelBooking: (id: string) =>
    request<{ message: string }>('DELETE', `/user/booking/${id}`),

  getOwnerBookings: () =>
    request<{ bookings: Booking[] }>('GET', '/owner/bookings'),

  updateStatus: (id: string, bookingStatus: string) =>
    request<{ booking: Booking }>('PUT', `/owner/booking/${id}`, { bookingStatus }),

  adminGetAll: () =>
    request<{ bookings: Booking[] }>('GET', '/admin/bookings'),
}

// ─── Admin ───────────────────────────────────────────────
export const adminApi = {
  getDashboard: () =>
    request<{ stats: DashboardStats }>('GET', '/admin/dashboard'),

  getUsers: () =>
    request<{ users: AdminUser[] }>('GET', '/admin/users'),

  deleteUser: (id: string) =>
    request<{ message: string }>('DELETE', `/admin/user/${id}`),
}

// ─── Types ───────────────────────────────────────────────
export interface Property {
  _id: string
  ownerId: string
  ownerName: string
  ownerContact: string
  propertyType: string
  propertyAdType: string
  propertyAddress: string
  propertyAmt: number
  propertyImage?: { filename: string; path: string; mimetype: string }
  additionalInfo?: string
  createdAt: string
}

export interface Booking {
  _id: string
  propertId: Property | string
  ownerID: string | { _id: string; name: string; email: string }
  userID: string | { _id: string; name: string; email: string }
  userName: string
  phone: string
  bookingStatus: string
  createdAt?: string
}

export interface AdminUser {
  _id: string
  name: string
  email: string
  type: string
  createdAt?: string
}

export interface DashboardStats {
  totalUsers: number
  totalProperties: number
  totalBookings: number
}

export function getImageUrl(property: Property): string {
  if (property.propertyImage?.path) {
    return '/' + property.propertyImage.path.replace(/\\/g, '/')
  }
  return 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'
}
