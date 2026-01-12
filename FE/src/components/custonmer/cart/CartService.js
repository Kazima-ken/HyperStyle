import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartApi } from "./../../../api/customer/card/CardApi";
const CartContext = createContext();

export function CartService({ children }) {
    const idAccount = sessionStorage.getItem("idAccount")
    const quantityInCartLocal = JSON.parse(localStorage.getItem("cartLocal"))
    const [totalQuantity, setTotalQuantity] = useState(0);

    useEffect(() => {
        console.log(idAccount);
        console.log(totalQuantity);
    }, [totalQuantity]);

    useEffect(() => {
        if (idAccount !== null) {
            getQuantityInCart(idAccount)
        } else {
            if (quantityInCartLocal !== null) {
                const total = quantityInCartLocal.reduce((acc, item) => acc + item.quantity, 0);
                setTotalQuantity(total)
            }
        }
    }, []);

    const updateTotalQuantity = (newCart) => {
        setTotalQuantity(newCart);
    };
    const getQuantityInCart = (id) => {
        CartApi.quantityInCart(id).then(
            (res) => {
                setTotalQuantity(res.data.data);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    return (
        <CartContext.Provider value={{ totalQuantity, updateTotalQuantity }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
