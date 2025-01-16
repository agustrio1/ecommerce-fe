import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Shipping } from "@/types/shipping.type"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { formatRupiah } from "@/utils/currency"

interface ShippingDetailsDialogProps {
    shipping: Shipping | null
    isOpen: boolean
    onClose: () => void
  }
  
  export function ShippingDetailsDialog({ shipping, isOpen, onClose }: ShippingDetailsDialogProps) {
    if (!shipping) return null
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Detail Pengiriman</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Informasi Pelanggan</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Nama:</span> {shipping.order.user.name}</p>
                  <p><span className="font-medium">Email:</span> {shipping.order.user.email}</p>
                  <p><span className="font-medium">Nomor Telepon:</span> {shipping.order.address.phone}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Alamat Pengiriman</h3>
                <div className="space-y-2">
                  <p>{shipping.order.address.address1}</p>
                  {shipping.order.address.address2 && <p>{shipping.order.address.address2}</p>}
                  <p>{shipping.order.address.city}, {shipping.order.address.state} {shipping.order.address.postalCode}</p>
                  <p>{shipping.order.address.country}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Detail Order</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>Gambar</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Kuantiti</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipping.order.orderItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.product.name}</TableCell>
                      <TableCell>
                      {item.product.images && item.product.images[0] ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.product.images[0].image}`}
                          alt={item.product.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-[50px] h-[50px] bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </TableCell>
                      <TableCell>{formatRupiah(item.product.price)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatRupiah(item.product.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-4 text-right text-lg font-semibold">
                Total Order: {formatRupiah(shipping.order.total)}
              </p>
              <p className="mt-4 text-right text-lg font-semibold"><span className="font-medium">Biaya Pengiriman:</span> {formatRupiah(shipping.cost)}</p>
              <p className="mt-4 text-right text-lg font-semibold">Total Seluruh: {formatRupiah(shipping.cost + shipping.order.total)}</p>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Informasi Pengiriman</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-medium">Asal:</span> {shipping.originCity}</p>
                  <p><span className="font-medium">Tujuan:</span> {shipping.destinationCity}</p>
                  <p><span className="font-medium">Berat:</span> {shipping.weight} g</p>
                  <p><span className="font-medium">Kurir:</span> {shipping.courier.toUpperCase()}</p>
                </div>
                <div>
                  <p><span className="font-medium">Layanan:</span> {shipping.service}</p>
                  <p><span className="font-medium">Estimasi Tiba:</span> {shipping.etd}</p>
                  <p><span className="font-medium"> Nomor Tracking:</span> {shipping.trackingNumber || 'Tidak dikirim'}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-medium">Status: </span>
                <Badge variant="outline" className="ml-2">
                  {shipping.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    )
  }
  
  