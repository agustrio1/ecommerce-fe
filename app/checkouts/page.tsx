"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { formatRupiah } from "@/utils/currency";
import { useCheckout } from "@/hooks/useCheckout";
import {
  Check,
  Truck,
  CreditCard,
  Home,
  Loader2,
  ShoppingBag,
  Plus,
} from "lucide-react";

const CheckoutPage = () => {
  const {
    currentStep,
    setCurrentStep,
    addresses,
    selectedAddress,
    setSelectedAddress,
    shippingOptions,
    selectedShipping,
    setSelectedShipping,
    orderId,
    loading,
    discountCode,
    setDiscountCode,
    discountAmount,
    validatingDiscount,
    isCreatingAddress,
    setIsCreatingAddress,
    newAddress,
    setNewAddress,
    validateDiscountCode,
    calculateSubtotal,
    calculateTotal,
    createOrder,
    createShipment,
    createPayment,
    createNewAddress,
  } = useCheckout();
  const { cartItems } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const renderStepIndicator = () => (
    <div className="flex justify-between mb-8">
      {[
        { icon: Home, label: "Alamat" },
        { icon: ShoppingBag, label: "Order" },
        { icon: Truck, label: "Pengiriman" },
        { icon: CreditCard, label: "Pembayaran" },
      ].map((step, index) => (
        <div key={index} className="flex flex-col items-center w-1/4">
          <div
            className={`rounded-full p-3 mb-2 ${
              currentStep > index + 1
                ? "bg-green-500"
                : currentStep === index + 1
                ? "bg-blue-500"
                : "bg-gray-200"
            } text-white`}>
            {currentStep > index + 1 ? (
              <Check size={24} />
            ) : (
              <step.icon size={24} />
            )}
          </div>
          <span className="text-sm text-center">{step.label}</span>
        </div>
      ))}
    </div>
  );

  const renderAddressSelection = () => (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Pilih Alamat Pengiriman</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
          {addresses && addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-center space-x-2 mb-4 p-3 border rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={address.id} id={address.id} />
                <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                  <div className="font-medium">{address.type}</div>
                  <div className="text-sm text-gray-500">
                    {address.address1}, {address.city}, {address.state},{" "}
                    {address.postalCode}
                  </div>
                </Label>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Tidak ada alamat yang tersedia.</p>
          )}
        </RadioGroup>
        {!isCreatingAddress ? (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setIsCreatingAddress(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Alamat Baru
          </Button>
        ) : (
          <div className="mt-4 space-y-4">
            <Input
              placeholder="Tipe Alamat"
              value={newAddress.type || "SHIPPING"}
              readOnly
              onChange={(e) =>
                setNewAddress({ ...newAddress, type: e.target.value })
              }
            />
            <Input
              placeholder="Alamat 1"
              value={newAddress.address1}
              onChange={(e) =>
                setNewAddress({ ...newAddress, address1: e.target.value })
              }
            />
            <Input
              placeholder="Alamat 2 (Opsional)"
              value={newAddress.address2}
              onChange={(e) =>
                setNewAddress({ ...newAddress, address2: e.target.value })
              }
            />
            <Input
              placeholder="Nomor Telepon"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
            />
            <Input
              placeholder="Kota"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />
            <Input
              placeholder="Provinsi"
              value={newAddress.state}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
            />
            <Input
              placeholder="Negara"
              value={newAddress.country}
              onChange={(e) =>
                setNewAddress({ ...newAddress, country: e.target.value })
              }
            />
            <Input
              placeholder="Kode Pos"
              value={newAddress.postalCode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, postalCode: e.target.value })
              }
            />
            <Button
              className="w-full"
              onClick={createNewAddress}
              disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              Simpan Alamat Baru
            </Button>
          </div>
        )}
        <Button
          className="w-full mt-4"
          disabled={!selectedAddress || loading}
          onClick={() => setCurrentStep(2)}>
          Lanjutkan
        </Button>
      </CardContent>
    </Card>
  );

  const renderOrderSummary = () => (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Ringkasan Pesanan</CardTitle>
      </CardHeader>
      <CardContent>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between mb-4 p-3 border-b">
            <div>
              <div className="flex items-center mb-1">
                <Image
                  src={
                    item.product.images && item.product.images.length > 0
                      ? item.product.images[0]?.image
                      : "/placeholder-card.svg"
                  }
                  alt={item.product.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 mr-2"
                />
              </div>
              <div className="font-medium">{item.product.name}</div>
              <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
            </div>
            <div className="font-medium">
              {formatRupiah(item.product.price * item.quantity)}
            </div>
          </div>
        ))}
        <Separator className="my-4" />
        <div className="mb-4">
          <Label htmlFor="discountCode">Kode Diskon (opsional):</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="text"
              id="discountCode"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Masukkan kode diskon"
            />
            <Button
              variant="outline"
              onClick={validateDiscountCode}
              disabled={validatingDiscount || !discountCode}>
              {validatingDiscount ? (
                <Loader2 className="animate-spin mr-2" />
              ) : null}
              Validasi
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatRupiah(calculateSubtotal())}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Diskon</span>
              <span>-{formatRupiah(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatRupiah(calculateTotal())}</span>
          </div>
        </div>
        <Button
          className="w-full mt-4"
          disabled={loading || !selectedAddress}
          onClick={createOrder}>
          {loading ? <Loader2 className="animate-spin mr-2" /> : null}
          Buat Pesanan
        </Button>
      </CardContent>
    </Card>
  );

  const renderShippingSelection = () => (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Pilih Metode Pengiriman</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedShipping}
          onValueChange={setSelectedShipping}>
          {["JNE", "TIKI", "POS"].map((courier) => (
            <div key={courier} className="flex items-center space-x-2 mb-4">
              <RadioGroupItem value={courier} id={courier} />
              <Label htmlFor={courier}>{courier}</Label>
            </div>
          ))}
        </RadioGroup>
        <Button
          className="w-full mt-4"
          disabled={!selectedShipping || loading}
          onClick={createShipment}>
          {loading ? <Loader2 className="animate-spin mr-2" /> : null}
          Pilih Pengiriman
        </Button>
      </CardContent>
    </Card>
  );

  const renderPayment = () => (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Pembayaran</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Anda akan diarahkan ke halaman pembayaran Midtrans untuk menyelesaikan
          pesanan.
        </p>       
        <p>Total Order: {formatRupiah(calculateTotal())}</p>
        <Button className="w-full" disabled={loading} onClick={createPayment}>
          {loading ? <Loader2 className="animate-spin mr-2" /> : null}
          Bayar Sekarang
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Checkout
      </h1>
      {renderStepIndicator()}
      <div className="max-w-2xl mx-auto">
        {currentStep === 1 && renderAddressSelection()}
        {currentStep === 2 && renderOrderSummary()}
        {currentStep === 3 && renderShippingSelection()}
        {currentStep === 4 && renderPayment()}
      </div>
    </div>
  );
};

export default CheckoutPage;
