
import { useState, useEffect} from "react";
import { ITEMS } from "../data/itemData";
import homeStyle from "../Styles/Home.module.css";
import {  doc, setDoc, onSnapshot} from "firebase/firestore";
import { db } from "../firebaseInit";
import { useValue} from "../userContext";
import Notification from "./Notification";

function Home() {

    let {cart, setCart, username, orderDB} = useValue();

    // for search funtionality
    const [searchItem, setSearchItem] = useState("");

    // for checkbox filter functionality
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(ITEMS);

    // for slider filter functionality
    const [minPrice, setMinPrice] = useState(1);
    const [maxPrice, setMaxPrice] = useState(75000);

    // Combine checkbox and search filters
    useEffect(() => {
        let filtered = ITEMS;

        // Apply category filter if categories are selected
        if(selectedCategories.length > 0) {
            filtered = filtered.filter(item => selectedCategories.includes(item.category));
        }

        // Apply search filter if search query is provided
        if(searchItem){
            filtered = filtered.filter(item => item.title.toLowerCase().includes(searchItem.toLowerCase()));
        }

        // Apply slider filter
        console.log("max", maxPrice);
        filtered = filtered.filter(filtered => 
            filtered.price >= minPrice && filtered.price <= maxPrice    
        );

        setFilteredProducts(filtered);
    }, [selectedCategories, searchItem, maxPrice]);

    useEffect(() => {
        // Check if username is valid
        if (username) { 
            const unSub = onSnapshot(doc(db, "users", username), (snapShot) => {
                if (snapShot.exists()) {
                    const cartData = snapShot.data();
                    const cartArray = cartData.cart || [];
                    setCart(cartArray);
                } else {
                    console.log("Document does not exist");
                }
                
                console.log("snapshotItems", cart);
            });
        
            return () => unSub();
        } else {
            console.error("Invalid username provided");
        }
    }, [username]);

    async function handleCart(item){
        
        // Check if the item already exists in the cart
        const existingCartItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

        if(existingCartItemIndex !== -1) {
            // set data in firebase cart and order
            const updateCart = [...cart];
            updateCart[existingCartItemIndex] = {
                ...updateCart[existingCartItemIndex],
                multiplier: updateCart[existingCartItemIndex].multiplier+1,
                total: updateCart[existingCartItemIndex].total + updateCart[existingCartItemIndex].price
            };
                
            // Update the cart in Firestore
            await setDoc(doc(db, "users", username), {
                cart: updateCart,
                // cart: [item, ...cart, new Date()],
                order: [...orderDB]
            });
            Notification("Increase product count!", false);
        } else {
            await setDoc(doc(db, "users", username), {
                cart: [item, ...cart],
                order: [...orderDB]
            });
            Notification("Product Added Successfully!", false);
        }
        
    }

    // searchBar
    const handleSearch = (query) => {
        setSearchItem(query);

        let filtered = ITEMS;

        // Apply category filter if categories are selected
        if(selectedCategories.length > 0) {
            filtered = filtered.filter(item => 
                selectedCategories.includes(item.category)  
            );
        }

        // Apply search filter
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase())    
        );

        console.log("filterMaxPrice", maxPrice)
        // Apply slider filter
        filtered = filtered.filter(filtered => 
            filtered.price >= minPrice && filtered.price <= maxPrice    
        );

        setFilteredProducts(filtered);
    }

    // for checkbox filter
    const handleCheckBox = (e) => {
        const category  = e.target.value;
        if(e.target.checked) {
            setSelectedCategories(prev => [...prev, category]);
        } else {
            setSelectedCategories(prev => prev.filter(cat => cat !== category));
        }
    };

    // for slider filter
    const handleSlider = (price) => {
        setMaxPrice(Number(price));
        setMinPrice(1);
        console.log("min", minPrice);
    }



    return (
        <>
        <div className={homeStyle.head}>
            <aside className={homeStyle.filterBar}>
                <div className={homeStyle.filter}>
                    <h4>Filter</h4>
                </div>
                <form>
                    <div className={homeStyle.price}>
                        <label for="price">
                            Price: {maxPrice}
                        </label>
                    </div>
                    <input type="range" min={1} max={99991} value={maxPrice} className={homeStyle.slider} onChange={(e) => handleSlider(e.target.value)}/>
                    <div className={homeStyle.ctg}>
                        <h2>Category</h2>
                    </div>
                    <div className={homeStyle.categoryCtn}>
                        <div>
                            <input type="checkbox" value="Men" onChange={handleCheckBox}/>
                            <lable for="mensFashion">
                                Men's Clothing
                            </lable>
                        </div>
                        <div>
                            <input type="checkbox" value="Women" onChange={handleCheckBox}/>
                            <lable for="womensFashion">
                                Women's Clothing
                            </lable>
                        </div>
                        <div>
                            <input type="checkbox" value="Jewelery" onChange={handleCheckBox}/>
                            <lable for="jewelery">
                                Jewelery
                            </lable>
                        </div>
                        <div>
                            <input type="checkbox" value="Electronics" onChange={handleCheckBox}/>
                            <lable for="electronics" >
                                Electronics 
                            </lable>
                        </div>
                    </div>
                </form>
            </aside>
            <form className={homeStyle.homeSearch}>
                <input type="text" placeholder="Search By Name" 
                    className={homeStyle.search} value={searchItem} onChange={(e) => handleSearch(e.target.value)}/>
            </form>
            <div className={homeStyle.cartCtn}>
                <ul className={homeStyle.allcard}>
                    {filteredProducts.map((item, i) => (
                        <li className={homeStyle.card} key={i}>
                            <img className= {homeStyle.imgcss} src={item.src}/>
                            <p className={homeStyle.title}>{item.title}</p>
                            <h4>&#8377; {item.price}</h4>
                            <button className={homeStyle.add} onClick={() => handleCart(item)}>Add to Cart</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </>
    )
}

export default Home;