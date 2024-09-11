import { createContext, useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import {  doc, setDoc, onSnapshot} from "firebase/firestore";
import { db } from "./firebaseInit";

const userContext = createContext();

// customHook
function useValue() {
    const value = useContext(userContext);
    return value;
}

function CustomUserContext({children}) {

    const [isLogin, setLogin] = useState();
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]); 
    const [orderDB, setOrdersDB] = useState([]);
    const [total, setTotal] = useState(0);
    const [qty, setQty] = useState(0);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");

    // from App.js
    useEffect(() => {
        let email = JSON.parse(localStorage.getItem("firebase:authUser"));
        setLogin(email);
        // setUsername(email.email);
    }, []);

    useEffect(() => {
        let storedUser = localStorage.getItem("firebase:authUser");
        
        if (storedUser) {
            let emailObj = JSON.parse(storedUser);
            if (emailObj && emailObj.email) {
                setUsername(emailObj.email);
            }
        }
    }, []);

    useEffect(() => {
        // Check if username is valid
        if (username) { 
            const unSub = onSnapshot(doc(db, "users", username), (snapShot) => {
                if (snapShot.exists()) {
                    const data = snapShot.data();
                    const cartArray = data.cart || [];
                    const orderArray = data.order || [];
                    setCart(cartArray);
                    setOrdersDB(orderArray);
                    // console.log("orderArray", orderArray);
                } else {
                    console.log("Document does not exist");
                }
                
                // console.log("snapshotItems", cart);
            });
        
            return () => unSub();
        } else {
            console.error("Invalid username provided");
        }
    }, [username]);



    // useEffect(() => {
    //     let email = JSON.parse(localStorage.getItem("firebase:authUser"));
    //     setUsername(email.email);
    // }, []);

    // from cartpage
   

    return (
        <userContext.Provider value={{isLogin, setLogin, cart, 
                setCart, orders, setOrders, total, setTotal, qty, setQty, email, setEmail, 
                name, setName, password, setPassword, items, setItems,
                username, setUsername, search, setSearch, orderDB, setOrdersDB}}>
            {children}
        </userContext.Provider>
    )   
}

export {userContext, useValue};
export default CustomUserContext;
