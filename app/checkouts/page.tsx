// 'use client'

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { getToken } from "@/utils/token";
// import { formatRupiah } from "@/utils/currency";
// import { Loader2 } from "lucide-react";

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState('');
//   const [cartItems, setCartItems] = useState([]);
//   const [shippingOptions, setShippingOptions] = useState([]);
//   const [selectedShipping, setSelectedShipping] = useState({
//     courier: '',
//     service: ''
//   });
//   const [discountCode, setDiscountCode] = useState('');

//   useEffect(() => {
//     fetchUserAddresses();
//     fetchCartItems();
//   }, []);

//   const fetchUserAddresses = async () => {
//     try {
//       const token = await getToken();
//       if (!token) {
//         router.push('/login');
//         return;
//       }

//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/user/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
      
//       const data = await response.json();
//       setAddresses(data);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Gagal mengambil data alamat",
//         variant: "destructive",
//       });
//     }
//   };

//   const fetchCartItems = async () => {
//     try {
//       const token = await getToken();
//       if (!token) {
//         router.push('/login');
//         return;
//       }

//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/users/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
      
//       const data = await response.json();
//       setCartItems(data);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Gagal mengambil data keranjang",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleShippingCalculation = async (addressId) => {
//     try {
//       const token = await getToken();
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipping/calculate`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           addressId,
//           items: cartItems
//         })
//       });
      
//       const data = await response.json();
//       setShippingOptions(data);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Gagal menghitung biaya pengiriman",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleCheckout = async () => {
//     setLoading(true);
//     try {
//       const token = await getToken();
      
//       // 1. Create Order
//       const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           addressId: selectedAddress,
//           discountCode,
//         })
//       });
      
//       const orderData = await orderResponse.json();
      
//       // 2. Create Shipment
//       await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipping`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           orderId: orderData.id,
//           courier: selectedShipping.courier,
//           service: selectedShipping.service
//         })
//       });

//       // 3. Create Midtrans Payment
//       const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/midtrans`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           orderId: orderData.id,
//           amount: orderData.total
//         })
//       });

//       const paymentData = await paymentResponse.json();
      
//       // Redirect to Midtrans payment page
//       window.location.href = paymentData.redirectUrl;

//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Gagal memproses checkout",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateTotal = () => {
//     const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
//     const shippingCost = selectedShipping.service ? shippingOptions.find(opt => 
//       opt.courier === selectedShipping.courier && opt.service === selectedShipping.service
//     )?.cost || 0 : 0;
//     return subtotal + shippingCost;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Loader2 className="animate-spin h-8 w-8" />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Alamat Pengiriman</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Select onValueChange={(value) => {
//                 setSelectedAddress(value);
//                 handleShippingCalculation(value);
//               }}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Pilih alamat pengiriman" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {addresses.map((address) => (
//                     <SelectItem key={address.id} value={address.id}>
//                       {address.address1}, {address.city}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </CardContent>
//           </Card>

//           {shippingOptions.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Metode Pengiriman</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Select onValueChange={(value) => {
//                   const [courier, service] = value.split('|');
//                   setSelectedShipping({ courier, service });
//                 }}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Pilih metode pengiriman" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {shippingOptions.map((option) => (
//                       <SelectItem 
//                         key={`${option.courier}-${option.service}`} 
//                         value={`${option.courier}|${option.service}`}
//                       >
//                         {option.courier} - {option.service} ({formatRupiah(option.cost)})
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Ringkasan Pesanan</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {cartItems.map((item) => (
//                 <div key={item.id} className="flex justify-between">
//                   <span>{item.product.name} x {item.quantity}</span>
//                   <span>{formatRupiah(item.product.price * item.quantity)}</span>
//                 </div>
//               ))}
              
//               <div className="border-t pt-4">
//                 <div className="flex justify-between font-bold">
//                   <span>Total</span>
//                   <span>{formatRupiah(calculateTotal())}</span>
//                 </div>
//               </div>

//               <Button 
//                 className="w-full mt-4" 
//                 onClick={handleCheckout}
//                 disabled={!selectedAddress || !selectedShipping.courier || loading}
//               >
//                 {loading ? (
//                   <Loader2 className="animate-spin mr-2" />
//                 ) : null}
//                 Bayar Sekarang
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }