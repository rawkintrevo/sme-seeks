import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    getAuth
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore } from "firebase/firestore";
import { getDoc, doc, setDoc } from "firebase/firestore";

import "./custom.css"

function Login({ app }) {
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
        const db = getFirestore(app);
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
            // User has successfully signed in, now create a Firestore document
            const user = auth.currentUser;
            const userRef = doc(db, "user", user.uid);

            // Check if the user document already exists
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) {
                // If the document doesn't exist, create it
                await setDoc(userRef, {
                    // You can add other user-related data here
                });
            }

            console.log("User Logged in, redirecting:", auth.currentUser.uid);
            navigate('/');
            // Handle successful Google login
        } catch (error) {
            // Handle Google sign-in errors
            console.error(error);
        }
    };

    return (
<div className="login">
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <h2>Login</h2>
                            <Form>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2 mt-3">
                                    <Button variant="primary" onClick={handleEmailSignIn}>Sign In</Button>
                                </div>

                                <div className="d-grid gap-2 mt-3">
                                    <Button variant="primary" onClick={handleGoogleSignIn}>Sign In with Google</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </div>

    );
};

export default Login;