// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZ4SNMLM0RajxvoXdkH3NgT2frn3CHIb0",
  authDomain: "negotiation-trainer-4535e.firebaseapp.com",
  projectId: "negotiation-trainer-4535e",
  storageBucket: "negotiation-trainer-4535e.firebasestorage.app",
  messagingSenderId: "72572267625",
  appId: "1:72572267625:web:b6f3557a3516ebf67cc6f8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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

export default function App() {
  return (
    <>
      <TopBar />
      <ChatPage />
    </>
  );
}
