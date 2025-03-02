import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, ProductListParams } from "../TypesCheck/productCartTypes";

export const CartSlide = createSlice({
  name: "cart",
  initialState: {
    cart: [] as ProductListParams[],
    length: 0,
  } as CartItem,
  reducers: {
    addToCart: (state: CartItem, action: PayloadAction<ProductListParams>) => {
      const existingItem = state.cart.find(
        (item) =>
          item._id === action.payload._id &&
          item.selectedStorage === action.payload.selectedStorage &&
          item.selectedColor === action.payload.selectedColor
      );
      if (!existingItem) {
        state.cart.push({ ...action.payload, quantity: 1 }); // Giữ nguyên toàn bộ payload, bao gồm images
        state.length = state.cart.length;
      }
    },
    increaseQuantity: (state: CartItem, action: PayloadAction<ProductListParams>) => {
      const existingItem = state.cart.find(
        (item) =>
          item._id === action.payload._id &&
          item.selectedStorage === action.payload.selectedStorage &&
          item.selectedColor === action.payload.selectedColor
      );
      if (existingItem) {
        existingItem.quantity++;
      }
    },
    decreaseQuantity: (state: CartItem, action: PayloadAction<ProductListParams>) => {
      const getItem = state.cart.find(
        (item) =>
          item._id === action.payload._id &&
          item.selectedStorage === action.payload.selectedStorage &&
          item.selectedColor === action.payload.selectedColor
      );
      if (getItem && getItem.quantity > 1) {
        getItem.quantity--;
      } else if (getItem && getItem.quantity === 1) {
        state.cart = state.cart.filter(
          (item) =>
            !(
              item._id === action.payload._id &&
              item.selectedStorage === action.payload.selectedStorage &&
              item.selectedColor === action.payload.selectedColor
            )
        );
        state.length = state.cart.length;
      }
    },
    removeFromCart: (state: CartItem, action: PayloadAction<ProductListParams>) => {
      state.cart = state.cart.filter(
        (item) =>
          !(
            item._id === action.payload._id &&
            item.selectedStorage === action.payload.selectedStorage &&
            item.selectedColor === action.payload.selectedColor
          )
      );
      state.length = state.cart.length;
    },
    clearCart: (state) => {
      state.cart = [];
      state.length = 0;
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = CartSlide.actions;
export default CartSlide.reducer;