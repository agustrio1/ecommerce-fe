import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shipping } from "@/types/shipping.type";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shippings/StatusBadge";
import { formatRupiah } from "@/utils/currency";
import { convertKgtoGram } from "@/utils/convert";
import { format } from "date-fns";
import { MapPin, Truck, Package, DollarSign, Calendar, ShoppingBag } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const calculateTotalProductCost = (orderItems: Shipping['order']['orderItems']) => {
  return orderItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

const calculateFinalTotal = (productTotal: number, shippingCost: number) => {
  return productTotal + shippingCost;
};

interface ShippingDetailDialogProps {
  shipping: Shipping;
  onClose: () => void;
}

export const ShippingDetailDialog: React.FC<ShippingDetailDialogProps> = ({ shipping, onClose }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "yyyy-MM-dd HH:mm");
  };

  const totalProductCost = calculateTotalProductCost(shipping.order.orderItems);
  const finalTotal = calculateFinalTotal(totalProductCost, shipping.cost);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] w-full max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold">Detail Pengiriman</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="space-y-4 p-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="product-info">
                <AccordionTrigger className="text-lg font-semibold">
                  <ShoppingBag className="mr-2" size={18} />
                  Informasi Produk
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produk</TableHead>
                            <TableHead className="text-right">Harga</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {shipping.order.orderItems.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.product.name}</TableCell>
                              <TableCell className="text-right">{formatRupiah(item.product.price)}</TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">{formatRupiah(item.product.price * item.quantity)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Produk:</span>
                          <span>{formatRupiah(totalProductCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Biaya Pengiriman:</span>
                          <span>{formatRupiah(shipping.cost)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Total Akhir:</span>
                          <span>{formatRupiah(finalTotal)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping-info">
                <AccordionTrigger className="text-lg font-semibold">
                  <MapPin className="mr-2" size={18} />
                  Informasi Pengiriman
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Asal:</span>
                        <span>{shipping.originCity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tujuan:</span>
                        <span>{shipping.destinationCity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Berat:</span>
                        <span>{convertKgtoGram(shipping.weight)} gram</span>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="courier-info">
                <AccordionTrigger className="text-lg font-semibold">
                  <Truck className="mr-2" size={18} />
                  Detail Kurir
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Kurir:</span>
                        <span>{shipping.courier.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Layanan:</span>
                        <span>{shipping.service}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>No. Resi:</span>
                        <span>{shipping.trackingNumber || "-"}</span>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="status-info">
                <AccordionTrigger className="text-lg font-semibold">
                  <Package className="mr-2" size={18} />
                  Status Pengiriman
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Status:</span>
                        <StatusBadge status={shipping.status} />
                      </div>
                      <div className="flex justify-between">
                        <span>Dikirim:</span>
                        <span>{formatDate(shipping.shippedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Diantar:</span>
                        <span>{formatDate(shipping.deliveredAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="total-info">
                <AccordionTrigger className="text-lg font-semibold">
                  <DollarSign className="mr-2" size={18} />
                  Informasi Total
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Total Produk:</span>
                        <span>{formatRupiah(totalProductCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Biaya Pengiriman:</span>
                        <span>{formatRupiah(shipping.cost)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total Akhir:</span>
                        <span>{formatRupiah(finalTotal)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="time-info">
                <AccordionTrigger className="text-lg font-semibold">
                  <Calendar className="mr-2" size={18} />
                  Informasi Waktu
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Dibuat:</span>
                        <span>{formatDate(shipping.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Diperbarui:</span>
                        <span>{formatDate(shipping.updatedAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

