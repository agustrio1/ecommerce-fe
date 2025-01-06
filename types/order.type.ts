export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      images: { image: string }[];
    };
  }
  
  export interface Order {
    id: string;
    createdAt: string;
    orderDate: string;
    total: number;
    status: string;
    orderItems: OrderItem[];
  }