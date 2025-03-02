export interface ProductListParams {
    _id: string;
    name: string;
    images: string[];
    price: number;
    oldPrice?: number;           // Optional để khớp với dữ liệu thực tế
    description?: string;        // Optional
    quantity: number;
    inStock?: boolean;           // Optional
    isFeatured?: boolean;        // Optional
    category?: string;           // Optional
    storage?: string[] | undefined;  // Thay vì string[], cho phép undefined
    color?: string[] | undefined;    // Thay vì string[], cho phép undefined
    selectedStorage?: string | null;
    selectedColor?: string | null;
  }
  
  export interface FetchProductsParams {
    data: {
      Product: ProductListParams[];
      results: ProductListParams[];
    };
  }