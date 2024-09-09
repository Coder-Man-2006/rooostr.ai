import express, { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://rooostr-default-rtdb.firebaseio.com" // Adjust if using Firestore
});

const db = admin.firestore(); // Firestore instance

app.get('/', async (req: Request, res: Response) => {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => doc.data());

    return res.json({
        message: "Hello there :)",
        success: true,
        users
    });
});

app.post('/', async (req: Request, res: Response) => {
    const { name, email } = req.body;

    await db.collection('users').add({ name, email });

    return res.json({
        message: "Welcome :>",
        success: true
    });
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
