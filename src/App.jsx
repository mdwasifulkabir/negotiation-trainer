import { initializeApp } from "firebase/app";
import {} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  connectAuthEmulator,
} from "firebase/auth";

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
connectAuthEmulator(auth);

function TopBar() {
  return (
    <header>
      <div className="top-bar">Negotiation Trainer</div>
    </header>
  );
}

function ChatPage() {
  return (
    <>
      <div className="chat-page">
        <div className="message-window"></div>

        <div className="send-window">
          <form>
            <input></input>
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </>
  );
}

function SignIn() {
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  return <button onClick={googleSignIn}>Sign In With Google</button>;
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
