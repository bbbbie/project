import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductListParams, CartItem, CartState } from "../TypesCheck/productCartTypes";

export const CartSlide = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    length: 0,
  },
  reducers: {
    addToCart: (state: CartItem, action: PayloadAction<ProductListParams>) => {
      const existingItem = state.cart.find((item) => item._id === action.payload._id);
      if (!existingItem) {
        state.cart.push({ ...action.payload, quantity: 1 }); //Thêm quantity khi thêm sản phẩm mới
       
      }
    },
    increaseQuantity: (state: CartItem, action: PayloadAction<ProductListParams>) => {
      const existingItem = state.cart.find((item) => item._id === action.payload._id);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + 1; // Xử lý trường hợp quantity undefined
      }
    },
    decreaseQuantity: (state: CartItem, action: PayloadAction<ProductListParams>) => {
      const existingItem = state.cart.find((item) => item._id === action.payload._id);
      if (existingItem && existingItem.quantity && existingItem.quantity > 1) {
        existingItem.quantity--; // Giảm quantity chỉ khi > 1
      }
    },
    removeFromCart: (state: CartItem, action: PayloadAction<string>) => {
      const removeItem = state.cart.filter((item) => item._id !== action.payload);
      state.cart = removeItem;
     
    },
    clearCart: (state) => {
      state.cart = [];
     
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = CartSlide.actions;
export default CartSlide.reducer;