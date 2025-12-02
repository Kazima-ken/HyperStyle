import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        SetAccount: (state, action) => {
            return action.payload
        },
        CreateAccount: (state, action) => {
            const account = action.payload;
            const createAccount = {
                stt: state.length + 1,
                id: account.id,
                fullName: account.fullName,
                email: account.email,
                phoneNumber: account.phoneNumber,
                dateOfBirth: account.dateOfBirth,
                avata: account.avata,
                gender: account.gender,
                status: account.status,
                citizenIdentity: account.citizenIdentity,
            }
            state.unshift(createAccount);
        },
        updateAccount: (state, action) => {
            const updateAccount = action.payload;
            const accountIndex = state.findIndex(account => account.id === updateAccount.id);

            if (accountIndex !== -1) {
                state[accountIndex].fullName = updateAccount.fullName;
                state[accountIndex].email = updateAccount.email;
                state[accountIndex].phoneNumber = updateAccount.phoneNumber;
                state[accountIndex].dateOfBirth = updateAccount.dateOfBirth;
                state[accountIndex].password = updateAccount.password;
                state[accountIndex].avata = updateAccount.avata;
                state[accountIndex].status = updateAccount.status;
                state[accountIndex].gender = updateAccount.gender;
                state[accountIndex].citizenIdentity = updateAccount.citizenIdentity;
            }
        },
        getAccount: (state, action) => {
            const accountId = action.payload;
            return state.find(account => account.id === accountId);
        }
    }
});

export const { SetAccount, CreateAccount, UpdateAccount } =
    accountSlice.actions;
export default accountSlice.reducer;
export const GetAccount = (state) => state.account;
export const GetAccountById = (state, id) =>
    state.account.find(account => account.id === id);
