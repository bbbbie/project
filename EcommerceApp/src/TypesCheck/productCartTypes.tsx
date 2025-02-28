
export interface ProductListParams {
    _id: string;
    images: string[];
    name: string;
    category?: string;
    price: number
   
    inStock?: boolean;
    color?: string;
    size?: string;
    description?: string;
    quantity: number
}

export interface CartItem {
    cart: ProductListParams[]
    length: number
 }
export interface CartState {
    cart: {
       cart: ProductListParams[]
       length: number
    }
}