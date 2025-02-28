import { configureStore } from '@reduxjs/toolkit';
import { 
    persistStore, 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';
import CartReducer from './src/redux/CartReducer';
import storage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
    whitelist: ["Cart"]
};

const persistedReducer = persistReducer(persistConfig, CartReducer);

export const store = configureStore({
    reducer: {
        cart: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;