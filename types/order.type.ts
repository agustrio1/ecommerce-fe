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
    order_id?: string;
    createdAt: string;
    orderDate: string;
    total: number;
    status: string;
    orderItems: OrderItem[];
    address: {
      name: string;
      phone: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      postalCode: string
      status: string;
      user: {
        name: string;
      }
    };
  }

 export  interface OrdersResponse {
    data: Order[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }