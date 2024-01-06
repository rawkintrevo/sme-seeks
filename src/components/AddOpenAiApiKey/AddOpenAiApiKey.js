import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { updateDoc, doc } from 'firebase/firestore';

function AddOpenAiApiKey({ onClose, uid, existingModels, db }) {
    const [apiKey, setApiKey] = useState('');
    const [checkbox1, setCheckbox1] = useState(true);
    const [checkbox2, setCheckbox2] = useState(true);
    const [checkbox3, setCheckbox3] = useState(true);
    const [checkbox4, setCheckbox4] = useState(true);
    const [checkbox5, setCheckbox5] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newModels = {
            ...existingModels,
            ...(checkbox1 ? {
                'gpt-3.5-turbo': {
                    api_key: apiKey,
                    type: 'openai',
                    friendly_name: "GPT-3.5 Turbo",
            } } : {}),
            ...(checkbox2 ? {
                'gpt-3.5-turbo-16k': {
                    api_key: apiKey,
                    type: 'openai',
                    friendly_name: "GPT-3.5 Turbo - 16k",
                } } : {}),
            ...(checkbox3 ? {
                'gpt-4': {
                    api_key: apiKey,
                    type: 'openai',
                    friendly_name: "GPT-4",
                } } : {}),
            ...(checkbox4 ? {
                'gpt-4-32k': {
                    api_key: apiKey,
                    type: 'openai',
                    friendly_name: "GPT-4 - 32k",
                } } : {}),
            ...(checkbox5 ? {
                'gpt-4-1106-preview': {
                    api_key: apiKey,
                    type: 'openai',
                    friendly_name: "GPT-4 - Turbo - 128k",
                } } : {}),
        };

        try {
            // Update the Firestore document with the new models data
            updateDoc(doc(db, 'user', uid), {
                models: newModels,
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
        <div className="popup">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="apiKey">
                    <Form.Label>API Key:</Form.Label>
                    <Form.Control
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="checkboxes">
                    <Form.Check
                        type="checkbox"
                        label="GPT-3.5-Turbo"
                        checked={checkbox1}
                        onChange={(e) => setCheckbox1(e.target.checked)}
                    />
                    <Form.Check
                        type="checkbox"
                        label="GPT-3.5-Turbo-16k"
                        checked={checkbox2}
                        onChange={(e) => setCheckbox2(e.target.checked)}
                    />
                    <Form.Check
                        type="checkbox"
                        label="GPT-4"
                        checked={checkbox3}
                        onChange={(e) => setCheckbox3(e.target.checked)}
                    />
                    <Form.Check
                        type="checkbox"
                        label="GPT-4 - 32k"
                        checked={checkbox4}
                        onChange={(e) => setCheckbox4(e.target.checked)}
                    />
                    <Form.Check
                        type="checkbox"
                        label="GPT-4-Turbo (128k-Experimental)"
                        checked={checkbox5}
                        onChange={(e) => setCheckbox5(e.target.checked)}
                    />
                </Form.Group>
                <div className="buttons">
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
}

export default AddOpenAiApiKey;