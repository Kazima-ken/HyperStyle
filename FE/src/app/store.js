import { configureStore } from "@reduxjs/toolkit";
import AccountReducer from "./reducer/AccountReducer";
import LoadingReducer from "./reducer/LoadingReducer";

export const store = configureStore({
    reducer: {
        account: AccountReducer,
        loading: LoadingReducer,
    },
});
export const dispatch = store.dispatch;
export const getState = store.getState;