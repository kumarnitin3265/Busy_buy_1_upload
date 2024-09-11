
import { useNavigate } from "react-router-dom";
import cartStyle from "../Styles/Cart.module.css";
import { useValue} from "../userContext";
import { useEffect} from "react";
import { arrayUnion, updateDoc } from "firebase/firestore";
import {  doc, setDoc} from "firebase/firestore";
import { db } from "../firebaseInit";
import Notification from "./Notification";

function Cart() {

    let {cart, setCart, orders, setOrders, username, total, setTotal, orderDB} = useValue();
    const navigate = useNavigate();
    
    async function removeItem(i) {
        const updatedCart = cart.filter((item, index) => i !== index);
        setCart(updatedCart);

         // Update cart in Firestore
        await setDoc(doc(db, "users", username), {
            cart: updatedCart,
            order: [...orders]  // Assuming you also want to keep the existing orders
        });

        Notification("Product Removed Successfully!", false);
    }

    useEffect(() => {
        var totalPrice = 0;
        cart.map((item, i) => (
            totalPrice += item.price*cart[i].multiplier
        ));

        setTotal(totalPrice);
    }, [cart, setTotal]);
    

    async function handleOrder(){
        
        setOrders(cart);
       
        const orderX = {
            total: total,
            orderPlacedDate: new Date().toLocaleDateString(),
            orderPlacedTime: new Date().toLocaleTimeString()
        }

        await updateDoc(doc(db, "users", username), {
            cart: [],
            // order: orderDB.concat(orderX)
            // order: [orderDB, { ...orderX}, /* other items if needed */]
            order: arrayUnion({item: cart, ...orderX}, ...orderDB),
        });

 
        setCart([]);
        navigate("/myOrders");
    }

    async function handleAdd(index) {
        const updateCart = [...cart];
        updateCart[index].multiplier += 1;
        updateCart[index].total += updateCart[index].price
        setCart(updateCart);

        // const updatedCart = cart.filter((item, index) => i !== index);
        // setCart(updatedCart);

         // Update cart in Firestore
          await updateDoc(doc(db, "users", username), {
            cart: updateCart,
        });

        
    }

    async function handleMinus(index){
        const updateCart = [...cart];

        if(updateCart[index].multiplier > 1) {
            updateCart[index].multiplier -= 1;
            updateCart[index].total -= updateCart[index].price 
            setOrders(updateCart);
        }

         // Update cart in Firestore
         await updateDoc(doc(db, "users", username), {
            cart: updateCart,
        });

                
    }


    return (
        <>
            <main className={cartStyle.cartPage}>
                <div className={cartStyle.cartCnt}>
                    <ul className={cartStyle.allcard}>
                        {cart.map((item, i) => (
                            <li className={cartStyle.card} key={i}>
                                {/* <h4>{item.id}</h4> */}
                                <img className={cartStyle.imgcss} src = {item.src}/>
                                <p className={cartStyle.title}>{item.title}</p>
                                <div className={cartStyle.priceTag}>
                                    <div className={cartStyle.price}>
                                        &#8377; {item.price}
                                    </div> 
                                    <div className={cartStyle.icons}>
                                        <div className={cartStyle.add} onClick={() => handleAdd(i)}>
                                            <img src="https://cdn-icons-png.flaticon.com/128/3416/3416075.png"/>
                                        </div>
                                        <div className={cartStyle.multiplier}>
                                            {item.multiplier}
                                        </div>
                                        <div className={cartStyle.minus} onClick={() => handleMinus(i)}>
                                            <img src="https://cdn-icons-png.flaticon.com/128/1828/1828899.png"/>
                                        </div>
                                    </div>           
                                </div>
                                <button className={cartStyle.remove} onClick={() => removeItem(i)}>Remove from Cart</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <aside className={cartStyle.totalPriceTag}>
                    <h4 className={cartStyle.total}>TotalPrice:- &#8377;{total}/-</h4>
                    <button className={cartStyle.purchase} onClick={handleOrder}>Purchase</button> 
                </aside>

            </main>
        </>
    )
}

export default Cart;