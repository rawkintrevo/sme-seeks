import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import {doc, updateDoc} from "firebase/firestore";

const AddIndex = ({ onClose, uid, existingIndicies, db }) => {
    const [apiKey, setApiKey] = useState('');
    const [indexName, setIndexName] = useState('');
    const [friendlyName, setFriendlyName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your logic here to handle form submission

        const newIndicies = {
            ...existingIndicies,
            [indexName]: {
                api_key: apiKey,
                friendly_name: friendlyName,
                type: 'pinecone'
            }
        }
        try {
            // Update the Firestore document with the new models data
            updateDoc(doc(db, 'user', uid), {
                indicies: newIndicies,
            });

            // Close the popup
            onClose();
        } catch (error) {
            console.error('Error updating document: ', error);
        }
        // Close the popup
        onClose();
    };

    const handleCancel = () => {
        // Close the popup
        onClose(false); // bad nomenclature, but it works
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="apiKey">
                    <Form.Label>API Key</Form.Label>
                    <Form.Control
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="indexName">
                    <Form.Label>Index Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={indexName}
                        onChange={(e) => setIndexName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="friendlyName">
                    <Form.Label>Friendly Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={friendlyName}
                        onChange={(e) => setFriendlyName(e.target.value)}
                    />
                </Form.Group>

                <div className="buttons" style={{ marginTop: "10px"}}>
                    <Button variant="primary"
                            style={{ marginRight: "10px" }}
                            type="submit">
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>

            </Form>

        </div>
    );
};

export default AddIndex;
