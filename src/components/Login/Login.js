import React, { useState } from 'react';
import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    getAuth} from "firebase/auth";
import {useNavigate} from "react-router-dom"; // Import Firebase Auth

// import {
//
//     connectAuthEmulator,
//     getAuth,
//     onAuthStateChanged,
//     signInWithPopup,
//     signOut,
// } from 'firebase/auth';

function Login({app})  {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const auth = getAuth(app);
    const navigate = useNavigate();
    const handleEmailSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Handle successful login (e.g., redirect to protected routes)
        } catch (error) {
            // Handle sign-in errors
            console.error(error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
            console.log("User Logged in, redirecting:", auth.currentUser.uid);
            navigate('/');
            // Handle successful Google login
        } catch (error) {
            // Handle Google sign-in errors
            console.error(error);
        }
    };

    return (
        <div className="login-container">
            {/* Login form elements and styling */}
            <h2>Login</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleEmailSignIn}>Sign In</button>

            <button onClick={handleGoogleSignIn}>Sign In with Google</button>
        </div>
    );
};

export default Login;
