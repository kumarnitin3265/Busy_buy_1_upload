import React, {useState} from 'react';
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";

const Auth = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    const auth = getAuth();

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;
            console.log("User Signed Up successfully");
            console.log("New User ID", newUser.user);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSignIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential;
            console.log("User Sign in successfully!");
            console.log("User ID", user.uid);
        } catch (error) {
            setError(error.message);
        }
    };

   

    return (
        <div>
            <input type='text' placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
            <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleSignUp}>Sign Up</button>
            <button onClick={handleSignIn}>Sign In</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Auth;
