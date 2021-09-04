import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyBq__aBYuqn7QJKNJCFlp9ljHbkfrhzyrY",
    authDomain: "react-chat-c2718.firebaseapp.com",
    projectId: "react-chat-c2718",
    storageBucket: "react-chat-c2718.appspot.com",
    messagingSenderId: "582876886291",
    appId: "1:582876886291:web:3ccbdf4a11e845376c16e6",
    measurementId: "G-LF0SC3KMPF"
})
export const auth = firebase.auth();
export const firestore = firebase.firestore();