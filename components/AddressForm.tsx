import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

interface AddressFormProps {
  editData: {
    address1: string
    address2?: string
    city: string
    state: string
    country: string
    postalCode: string
    phone: string
    type: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSave: () => void
}

export function AddressForm({ editData, handleInputChange, handleSave }: AddressFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address1">Alamat 1</Label>
          <Input
            id="address1"
            name="address1"
            value={editData.address1}
            onChange={handleInputChange}
            placeholder="Alamat 1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address2">Alamat 2</Label>
          <Input
            id="address2"
            name="address2"
            value={editData.address2}
            onChange={handleInputChange}
            placeholder="Alamat 2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Kota</Label>
          <Input id="city" name="city" value={editData.city} onChange={handleInputChange} placeholder="Kota" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Provinsi</Label>
          <Input id="state" name="state" value={editData.state} onChange={handleInputChange} placeholder="Provinsi" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Negara</Label>
          <Input
            id="country"
            name="country"
            value={editData.country}
            onChange={handleInputChange}
            placeholder="Negara"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Kode Pos</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={editData.postalCode}
            onChange={handleInputChange}
            placeholder="Kode Pos"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telepon</Label>
          <Input id="phone" name="phone" value={editData.phone} onChange={handleInputChange} placeholder="Telepon" />
        </div>
      </div>
      <Button onClick={handleSave} className="w-full">
        <Save className="mr-2" size={16} />
        Simpan
      </Button>
    </div>
  )
}