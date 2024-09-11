
import { useEffect, useRef } from "react"
import loginStyle from "../Styles/Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebaseInit";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useValue} from "../userContext";
import Notification from "./Notification";

function SignIn(){
    
    const emailRef = useRef(null);
    const navigate = useNavigate();

    let {setLogin, email, setEmail, password, setPassword} = useValue();

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        
    }, []);

    
    function handleSubmit(e) {
        e.preventDefault();

        if(!email || !password) {
            alert("All fields required!!!");
            return navigate("/signIn");
        }

        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) =>  {
            // Handle successful Signed in 
            const user = userCredential.user;
            localStorage.setItem("firebase:authUser", JSON.stringify(userCredential._tokenResponse));
            localStorage.setItem("email", email);
         
            Notification("User is successfully signed in", false);

            // // create collections for cart for a user
            const docRef = doc(db, "users", user.email);
            await setDoc(docRef, {
                cart: [],
                order: []
            });

            setLogin(true);
            navigate("/");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
    
            Notification("Please enter valid data!", true);
            navigate("/signIn");
        });

        

        emailRef.current.focus();
        
        setEmail("");
        setPassword("");
    }




    return (
        <div className={loginStyle.login}>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" 
                        id="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        ref={emailRef} 
                        placeholder="Enter Email"
                /><br/>
                <input type="password" 
                        id="password" 
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                /><br/>
                <button className={loginStyle.signIn} type="submit">Sign In</button>
                
                <Link to="/signUp">
                    <p>Or SignUp instead</p>
                </Link>
            </form>
        </div>
    )
}

export default SignIn;