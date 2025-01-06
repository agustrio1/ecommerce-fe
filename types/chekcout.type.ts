export type Address = {
    id: string;
    type: string;
    address1: string;
    address2?: string;
    phone: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  
  export type CartImage = {
    image: string;
  }
  
  export type CartItem  = {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      images?: CartImage[];
    };
  }
  
  export type ShippingOption  = {
    courier: string;
    service: string;
    cost: number;
    etd: string;
  }
  