

## Firestore

### /user/{userId}/

```json
{
  "name": "string",
  "uid": "string",
  "chats": [
    {
      "id": "string",
      "title": "string",
    }
  ],
  "indices": [
    {
      "name": "string",
      "apiKey": "string",
      "type": "string"
    }
  ],
  "models" : [
    {"friendlyName" : "string",
      "apiKey" : "string"}
  ]
}
```

### /chat/{chatId}/

```json
{
  "title": "string",
  "users": [
    "string"
  ],
  "messages": [
    {
      "message": "string",
      "user": "string",
      // or index and params if done by AI
      "timestamp": "string",
      "sources": [
        {
          "url" : "string",
          "title" : "string"
        }
      ]
    }
  ]
}
```

## Functions

### /onCreateUser

### /onCreateIndex

### /onCreateMessage

This is a `GET` request that kicks off the llama-index call, which 
writes to the chat's messages array. And when it returns, you know
the message has finished. 
