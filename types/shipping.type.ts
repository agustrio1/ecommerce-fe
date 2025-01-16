export enum ShipmentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}

export interface Shipping {
  id: string;
  orderId: string;
  originCity: string;
  destinationCity: string;
  weight: number;
  courier: string;
  service: string;
  cost: number;
  etd: string;
  trackingNumber: string | null;
  status: ShipmentStatus;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    total: number;
    orderItems: Array<{
      product: {
        name: string;
        price: number;
        images?: { image: string }[];
      };
      quantity: number;
    }>;
    user: {
      name: string;
      email: string;
    };
    address: {
      id: string;
      userId: string;
      address1: string;
      address2: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone: string;
      type: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  shipmentHistory: any[]; 
}

