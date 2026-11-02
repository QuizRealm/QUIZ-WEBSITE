/* Existing multiplayer service only. No automatic visit telemetry or cloud profiles. */
import {initializeApp,getApps,getApp} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {getFirestore,doc,setDoc,getDoc,updateDoc,arrayUnion,collection,addDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import {getAuth,signInAnonymously,onAuthStateChanged,GoogleAuthProvider,signInWithPopup} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
const config={apiKey:'AIzaSyDqRiQs_ezSxSpaYo0BO8WAcJF9LKvyOwo',authDomain:'thequizrealm-ef52c.firebaseapp.com',projectId:'thequizrealm-ef52c',storageBucket:'thequizrealm-ef52c.firebasestorage.app',messagingSenderId:'56820951002',appId:'1:56820951002:web:3f7d419d62f6d7ee2102e3'};
const app=getApps().length?getApp():initializeApp(config);
window.db=getFirestore(app);window.auth=getAuth(app);
Object.assign(window,{doc,setDoc,getDoc,updateDoc,arrayUnion,collection,addDoc,serverTimestamp,signInAnonymously,GoogleAuthProvider,signInWithPopup});
window.firebaseReady=new Promise(resolve=>{
  let settled=false;
  onAuthStateChanged(window.auth,user=>{
    if(settled)return;settled=true;
    if(user)resolve(user);
    else if(/\/(?:host-game|play)\.html$/.test(location.pathname))signInAnonymously(window.auth).then(result=>resolve(result.user)).catch(error=>{console.warn('Multiplayer sign-in unavailable:',error.code);resolve(null);});
    else resolve(null);
  });
});
