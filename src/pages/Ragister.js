import { useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import SignUpStyle from "../Styles/Ragister.module.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useValue} from "../userContext";
import Notification from "./Notification";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseInit";

function SignUp(){

    const nameRef = useRef(null);
    const navigate = useNavigate();

    // contextAPI
    let {setLogin, email, setEmail, name, setName, password, setPassword} = useValue();

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if(storedEmail){
            setEmail(storedEmail);
        }

        nameRef.current.focus();
    }, []);

    useEffect(() => {
        localStorage.setItem("email", email);
    }, [email]);

    function handleSubmit(e){
 
        e.preventDefault();
  
        // validate inputs 
        if(!name || !email || !password) {
            alert("All fields required!!!");
            return navigate("/signUp");
        }

        const auth = getAuth();
        const user = createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
        // Signed up 
            const user = userCredential.user;
            localStorage.setItem("firebase:authUser", JSON.stringify(userCredential._tokenResponse));
            localStorage.setItem("email", email);
            Notification("User is successfully signed up", false);
        // ...
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

            Notification("Please enter valid data!", true);;
            navigate("/signUp");
        });

        nameRef.current.focus();

        setName("");
        setEmail("");
        setPassword("");
    }   

    return (
        <div className={SignUpStyle.register}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" 
                        value={name} 
                        ref={nameRef} 
                        required
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Enter Name"
                /><br/>
                <input type="email" 
                        value={email} 
                        required
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Enter Email"
                /><br/>
                <input type="password" 
                        value={password} 
                        required
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter Password"
                /><br/>
                    <button className={SignUpStyle.signUp}>Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp;