import { configureStore } from "@reduxjs/toolkit";
import AccountReducer from "./reducer/AccountReducer";
import LoadingReducer from "./reducer/LoadingReducer";
import CategoryReducer from "./reducer/CategoryReducer";
import MaterialReducer from "./reducer/MaterialReducer";
import BrandReducer from "./reducer/BrandReducer";
import SoleReducer from "./reducer/SoleReducer";
import SizeReducer from "./reducer/SizeReducer";
import ColorReducer from "./reducer/ColorReducer";
import BillReducer from "./reducer/BillReducer";
import AddressReducer from "./reducer/AddressReducer";
import CustomerReducer from "./reducer/CustomerReducer";
import UserReducer from "./reducer/UserClientReducer";
import AddressAccountReducer from "./reducer/AddressAccountReducer";




export const store = configureStore({
    reducer: {
        account: AccountReducer,
        loading: LoadingReducer,
        material: MaterialReducer,
        category: CategoryReducer,
        brand: BrandReducer,
        sole: SoleReducer,
        size: SizeReducer,
        color: ColorReducer,
        bill: BillReducer,
        user: UserReducer,
        address: AddressReducer,
        customer: CustomerReducer,
        addressAccount: AddressAccountReducer,
    },
});
export const dispatch = store.dispatch;
export const getState = store.getState;