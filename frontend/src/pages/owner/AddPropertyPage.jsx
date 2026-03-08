import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Upload } from "lucide-react"
import { toast } from "sonner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { propertyApi } from "@/lib/api"

export default function OwnerAddPropertyPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [formData, setFormData] = useState({
    propertyType: "apartment",
    propertyAdType: "rent",
    propertyAddress: "",
    ownerContact: "",
    propertyAmt: "",
    additionalInfo: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v))
      if (imageFile) fd.append("propertyImage", imageFile)
      await propertyApi.create(fd)
      toast.success("Property added successfully!")
      navigate("/owner/properties")
    } catch (err) {
      toast.error("Failed to add property", { description: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
          <Link to="/owner" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />Back to Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Add New Property</h1>
          <p className="mt-2 text-muted-foreground">Fill in the details to list your property</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground">Property Type</label>
                <select value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="cabin">Cabin</option>
                  <option value="penthouse">Penthouse</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Ad Type</label>
                <select value={formData.propertyAdType}
                  onChange={(e) => setFormData({ ...formData, propertyAdType: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground">Property Address</label>
                <input type="text" value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                  placeholder="e.g., 123 Main St, Manhattan, New York"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" required />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Price ($)</label>
                <input type="number" value={formData.propertyAmt}
                  onChange={(e) => setFormData({ ...formData, propertyAmt: e.target.value })}
                  placeholder="e.g., 2500"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" required />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Contact Phone</label>
                <input type="tel" value={formData.ownerContact}
                  onChange={(e) => setFormData({ ...formData, ownerContact: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" required />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground">Additional Info</label>
                <textarea value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  placeholder="Describe your property..."
                  rows={4}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground">Property Image</label>
                <div className="mt-1.5 flex justify-center rounded-xl border-2 border-dashed border-border px-6 py-8">
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="mt-2 text-sm text-muted-foreground" />
                    {imageFile && <p className="mt-1 text-sm text-accent">{imageFile.name}</p>}
                    <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => navigate("/owner")}>Cancel</Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Adding..." : "Add Property"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
