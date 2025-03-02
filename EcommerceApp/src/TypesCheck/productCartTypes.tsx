export interface ProductListParams {
    _id: string;
    images: string[];
    name: string;
    category?: string;
    price: number;
    oldPrice?: number;
    inStock?: boolean;
    description?: string;
    quantity: number;
    storage?: string[];
    color?: string[];
    selectedStorage?: string | null;
    selectedColor?: string | null;
}

export interface CartItem {
    cart: ProductListParams[];
    length: number;
}

export interface CartState {
    cart: {
        cart: ProductListParams[];
        length: number;
    };
}