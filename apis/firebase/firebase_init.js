// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import admin from "firebase-admin";
import { getDatabase } from "firebase/database";
import dotenv from 'dotenv';

dotenv.config();

if (typeof window === "undefined") {
    globalThis.window = {
        location: { protocol: "https:" },
        navigator: {},
        document: { cookie: "" },
    };
}

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DB_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MSG_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASURMENT_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);

import serviceAccount from "./key/Private_Key.json"assert { type: "json" };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DB_URL,
});
export { database, admin };
