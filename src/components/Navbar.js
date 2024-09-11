import { Link, Outlet, NavLink } from "react-router-dom";
import navStyle from "./Navbar.module.css";
import { useValue} from "../userContext";


function Navbar() {

    const {isLogin, setLogin, username} = useValue();

    function logout() {
        localStorage.removeItem("firebase:authUser");
        localStorage.removeItem("email");
        setLogin();
    }

    return (
        <>
            <div className={navStyle.nav}>
                <div className={navStyle.busybuy}>
                    <Link to="/">
                        <h4>Busy Buy</h4>
                    </Link>
                </div>
                <div className={navStyle.icons}>
                    <NavLink style={({isActive}) => isActive? {color: "red"}: undefined} to="/">
                        <div className={navStyle.home}>
                            <img src="https://img.icons8.com/?size=80&id=gd9JPjrExFqF&format=png"/>
                            <h4>Home</h4>
                        </div>
                    </NavLink>

                    {isLogin ?
                        (<>
                            <NavLink style={({isActive}) => isActive? {color: "red"}: undefined} to="/myOrders">
                                <div className={navStyle.orders}>
                                    <img src="https://img.icons8.com/?size=80&id=5U3rlf7xYLB3&format=png"/>
                                    <h4>My orders</h4>
                                </div>
                                
                            </NavLink>
                            <NavLink style={({isActive}) => isActive? {color: "red"}: undefined} to="/cart">
                                <div className={navStyle.cart}>
                                    <img src="https://img.icons8.com/?size=80&id=5oZaluNJrRzV&format=png"/>
                                    <h4>Cart</h4>
                                </div>
                                
                            </NavLink>
                            <Link to="/">
                                <div className={navStyle.logout} onClick={logout}>
                                    <img src="https://img.icons8.com/?size=80&id=etrhO4C8vhKb&format=png"/>
                                    <h4>Logout</h4>
                                </div>    
                            </Link>
                        </>) : (<Link to="/signIn">
                            <div className={navStyle.signIn}>
                                <img src="https://cdn-icons-png.flaticon.com/128/1329/1329941.png"/>
                                <h4>Sign In</h4>
                            </div>   
                        </Link>)
                    }
                </div>
            </div>
            <Outlet />
        </>
    )
}

export default Navbar;