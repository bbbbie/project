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
            const existingItem = state.cart.find(item => item._id === action.payload._id);
            if (!existingItem) {
                state.cart.push({ ...action.payload, quantity: 1 });
                state.length = state.cart.length;
            }
        },
        increaseQuantity: (state: CartItem, action: PayloadAction<ProductListParams>) => {
            const existingItem = state.cart.find((item) => item._id === action.payload._id);
            if (existingItem) {
                existingItem.quantity++;
            }
        },
        decreaseQuantity: (state: CartItem, action: PayloadAction<ProductListParams>) => {
            const getItem = state.cart.find((item) => item._id === action.payload._id);
            if (getItem && getItem.quantity > 1) { // Prevent quantity from going below 1
                getItem.quantity--;
            } else if (getItem && getItem.quantity === 1) {
                // Optionally remove the item if quantity reaches 0
                state.cart = state.cart.filter((item) => item._id !== action.payload._id);
                state.length = state.cart.length;
            }
        },
        removeFromCart: (state: CartItem, action: PayloadAction<string>) => { // Change payload to string (_id)
            state.cart = state.cart.filter((item) => item._id !== action.payload);
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