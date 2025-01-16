import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { getToken } from '@/utils/token';
import { Address, ShippingOption, CartItem } from '@/types/chekcout.type';

export const useCheckout = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
    const [selectedShipping, setSelectedShipping] = useState("SHIPPING");
    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);
    const [discountCode, setDiscountCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [validatingDiscount, setValidatingDiscount] = useState(false);
    const [isCreatingAddress, setIsCreatingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
      type: "SHIPPING",
      address1: "",
      address2: "",
      phone: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    });
    const { cartItems } = useCart();
    const { toast } = useToast();
    const router = useRouter();
  
    useEffect(() => {
      const fetchAddresses = async () => {
        try {
          const token = await getToken();
  
          // Validasi jika token undefined atau null
          if (!token) {
            throw new Error("Token tidak ditemukan. Silakan login ulang.");
          }
  
          // Decode token untuk mendapatkan userId
          const userPayload = JSON.parse(atob(token.split(".")[1]));
          const userId = userPayload.id;
  
          if (!userId) {
            throw new Error("Token tidak valid. Tidak ditemukan userId.");
          }
  
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/addresses/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (!response.ok) {
            throw new Error("Gagal mengambil data alamat.");
          }
  
          const result = await response.json();
          setAddresses(result);
        } catch (error) {
          if (error instanceof Error) {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          }
        }
      };
  
      fetchAddresses();
    }, [toast]);
  
    const validateDiscountCode = async () => {
      if (!discountCode) {
        setDiscountAmount(0);
        return;
      }
    
      try {
        setValidatingDiscount(true);
        const subtotal = calculateSubtotal();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/discounts/code/${discountCode}?totalOrder=${subtotal}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
    
        if (!response.ok) throw new Error("Kode diskon tidak valid.");
        const data = await response.json();
    
        setDiscountAmount(data.value || 0);
        toast({
          title: "Sukses",
          description: "Kode diskon berhasil diterapkan.",
        });
      } catch (error) {
        setDiscountAmount(0);
        if (error instanceof Error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } finally {
        setValidatingDiscount(false);
      }
    };
    const calculateSubtotal = () => {
      return cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
    };
  
    const calculateTotal = () => {
      const shippingCost =
        shippingOptions.find((option) => option.courier === selectedShipping)
          ?.cost || 0;
      return calculateSubtotal() - discountAmount + shippingCost;
    };
  
    const createOrder = async () => {
      try {
        setLoading(true);
        const token = await getToken();
  
        if (!token) {
          console.error("Token tidak ditemukan. User diarahkan ke login.");
          toast({
            title: "Error",
            description:
              "Token tidak ditemukan. Anda akan diarahkan ke halaman login.",
            variant: "destructive",
          });
          router.push("/login");
          return;
        }
  
        const userPayload = JSON.parse(atob(token.split(".")[1]));
        const userId = userPayload.id;
  
        if (!userId) {
          console.error("Token tidak valid. Tidak ditemukan userId.");
          toast({
            title: "Error",
            description: "Token tidak valid. Silakan login ulang.",
            variant: "destructive",
          });
          router.push("/login");
          return;
        }
  
        const orderData = {
          userId,
          addressId: selectedAddress,
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          discountCode: discountCode || null,
        };
  
        // console.log("Order Data yang dikirim:", orderData);
  
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
          }
        );
  
        console.log("Status respons backend:", response.status);
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error dari backend:", errorData);
  
          if (
            errorData.error &&
            errorData.error.includes("Unique constraint failed")
          ) {
            throw new Error(
              "Pesanan dengan alamat ini sudah dibuat. Silakan pilih alamat lain atau hubungi admin."
            );
          }
  
          throw new Error(errorData.message || "Gagal membuat pesanan.");
        }
  
        const data = await response.json();
        // console.log("Data respons sukses:", data);
  
        setOrderId(data.data.id);
        setCurrentStep(3);
        toast({
          title: "Sukses",
          description: "Pesanan berhasil dibuat.",
        });
      } catch (error) {
        // console.error("Error saat membuat pesanan:", error);
        if (error instanceof Error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };
  
    const createShipment = async () => {
      try {
        if (!orderId) {
          throw new Error("Order ID tidak ditemukan. Pastikan Anda telah membuat pesanan.");
        }
    
        if (!selectedShipping) {
          throw new Error("Metode pengiriman belum dipilih.");
        }
    
        setLoading(true);
        const token = await getToken();
    
        console.log("Mengirimkan data shipment:", {
          orderId,
          courier: selectedShipping.toLowerCase(), // Format lowercase
          service: "REG",
        });
    
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shippings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId,
            courier: selectedShipping.toLowerCase(),
            service: "REG",
          }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Terjadi kesalahan saat membuat pengiriman.");
        }
    
        const data = await response.json();
        console.log("Pengiriman berhasil:", data);
    
        toast({
          title: "Sukses",
          description: "Pengiriman berhasil dibuat.",
        });
    
        setCurrentStep(4);
      } catch (error: any) {
        console.error("Error saat membuat pengiriman:", error);
        toast({
          title: "Error",
          description: error.message || "Terjadi kesalahan saat membuat pengiriman.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
  
    const createPayment = async () => {
      try {
        if (!orderId) {
          throw new Error(
            "Order ID tidak ditemukan. Pastikan Anda telah menyelesaikan pengiriman."
          );
        }
  
        setLoading(true);
        const token = await getToken();
  
        console.log("Mengirimkan data pembayaran dengan orderId:", orderId);
  
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/midtrans`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderId,
            }),
          }
        );
  
        const responseData = await response.json();
        console.log("Response dari backend pembayaran:", responseData);
  
        if (!response.ok) {
          throw new Error(
            responseData.message || "Terjadi kesalahan saat membuat pembayaran."
          );
        }
  
        const redirectUrl = responseData.redirectUrl;
        if (!redirectUrl) {
          throw new Error("Redirect URL tidak ditemukan dalam respons backend.");
        }
  
        console.log("Redirect URL untuk pembayaran:", redirectUrl);
  
        window.location.href = redirectUrl;
      } catch (error) {
        console.error("Error saat membuat pembayaran:", error);
        if (error instanceof Error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };
  
    const createNewAddress = async () => {
      try {
        setLoading(true);
        const token = await getToken();
    
        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login ulang.");
        }
    
        // Decode token untuk mendapatkan userId
        const userPayload = JSON.parse(atob(token.split(".")[1]));
        const userId = userPayload.id;
    
        if (!userId) {
          throw new Error("Token tidak valid. Tidak ditemukan userId.");
        }
    
        // Tambahkan userId ke dalam payload
        const addressPayload = { ...newAddress, userId };
    
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/addresses`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(addressPayload),
          }
        );
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server Error:", errorData);
          throw new Error(errorData.message || "Gagal membuat alamat baru.");
        }
    
        const createdAddress = await response.json();
        setAddresses((prev) => [...prev, createdAddress]);
        setSelectedAddress(createdAddress.id);
        setIsCreatingAddress(false);
        toast({
          title: "Sukses",
          description: "Alamat baru berhasil dibuat.",
        });
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

  return {
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
    cartItems,
    validateDiscountCode,
    calculateSubtotal,
    calculateTotal,
    createOrder,
    createShipment,
    createPayment,
    createNewAddress,
  };
};
