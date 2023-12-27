import React, { useState } from 'react';
import {getAuth} from "firebase/auth"; // Import Firebase Auth



function Login({app})  {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const auth = getAuth(app);
    const handleEmailSignIn = async () => {
        try {
            await auth().signInWithEmailAndPassword(email, password);
            // Handle successful login (e.g., redirect to protected routes)
        } catch (error) {
            // Handle sign-in errors
            console.error(error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await auth.signInWithPopup(new auth.GoogleAuthProvider());
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
