import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  //connectAuthEmulator,
} from "firebase/auth";

import { useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZ4SNMLM0RajxvoXdkH3NgT2frn3CHIb0",
  authDomain: "negotiation-trainer-4535e.firebaseapp.com",
  projectId: "negotiation-trainer-4535e",
  storageBucket: "negotiation-trainer-4535e.firebasestorage.app",
  messagingSenderId: "72572267625",
  appId: "1:72572267625:web:b6f3557a3516ebf67cc6f8",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
//connectAuthEmulator(auth);

function TopBar() {
  return (
    <header>
      <div className="top-bar">Negotiation Trainer</div>
    </header>
  );
}

function ChatPage() {
  const messagesRef = collection(firestore, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"), limit(25));

  const [messages] = useCollectionData(q, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
  };

  return (
    <>
      <div className="chat-page">
        <div className="message-window"></div>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div className="send-window">
          <form onSubmit={sendMessage}>
            <input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
            ></input>
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "user" : "other";

  return (
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
      <img src={photoURL} alt="User Avatar" />
    </div>
  );
}

function SignIn() {
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  return <button onClick={googleSignIn}>Sign In With Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>SignOut</button>
  );
}

export default function App() {
  const [user] = useAuthState(auth);
  return (
    <>
      <TopBar />
      <section>{user ? <ChatPage /> : <SignIn />}</section>
    </>
  );
}
