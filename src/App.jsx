import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
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

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";

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

async function createSession(uid) {
  const sessionRef = await addDoc(collection(firestore, "sessions"), {
    uid,
    title: "Salary Negotiation Practice",
    createdAt: serverTimestamp(),
  });

  return sessionRef.id;
}

function ChatOpening() {
  return (
    <div className="opening">
      <h1 className="opening-text">Ready to negotiate?</h1>
      <p>Select a session or start a new one</p>
    </div>
  );
}

function Sidebar({ sessionId, setSessionId, uid }) {
  const sessionsRef = collection(firestore, "sessions");

  const sessionsQuery = query(sessionsRef);

  const [snapshot, sessionsLoading, sessionsError] =
    useCollection(sessionsQuery);

  const sessions = snapshot?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const sortedSessions = [...(sessions ?? [])].sort(
    (a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0),
  );

  const handleNewChat = async () => {
    const newId = await createSession(uid);
    setSessionId(newId);
  };

  return (
    <div className="sidebar">
      <button onClick={handleNewChat} className="new-chat-btn">
        New Chat
      </button>

      {sessionsLoading && <p className="sidebar-meta">Loading sessions...</p>}
      {sessionsError && (
        <p className="sidebar-meta">Could not load sessions.</p>
      )}

      {sortedSessions.map((s) => (
        <button
          key={s.id}
          onClick={() => {
            console.log(s.id);
            setSessionId(s.id);
          }}
          className={`session-btn ${s.id === sessionId ? "active" : ""}`}
        >
          {s.title}
        </button>
      ))}
    </div>
  );
}

function ChatPage({ user }) {
  const [activeSessionId, setActiveSessionId] = useState(null);

  return (
    <div className="chat-layout">
      {/* Sidebar always visible */}
      <Sidebar
        sessionId={activeSessionId}
        setSessionId={setActiveSessionId}
        uid={user.uid}
      />

      {/* Main area */}
      <div className="chat-main">
        {!activeSessionId ? (
          <ChatOpening />
        ) : (
          <SessionView sessionId={activeSessionId} user={user} />
        )}
      </div>
    </div>
  );
}

function SessionView({ sessionId, user }) {
  const messagesRef = collection(firestore, "sessions", sessionId, "messages");
  const messagesQuery = query(
    messagesRef,
    orderBy("createdAt", "asc"),
    limit(25),
  );
  const [messages] = useCollectionData(messagesQuery, { idField: "id" });
  const dummy = useRef(null);
  const [formValue, setFormValue] = useState("");

  useEffect(() => {
    if (!dummy.current) return;
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, sessionId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!formValue.trim()) return;

    const { uid, photoURL } = user;

    // Prepare short context history for future AI reply generation.
    const lastMessages = (messages ?? []).slice(-5).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      text: m.text,
    }));

    lastMessages.push({
      role: "user",
      text: formValue,
    });

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      sessionId,
      uid,
      photoURL,
      role: "user",
    });

    setFormValue("");

    //const aiReply = await getNegotiationReply(lastMessages);

    /*await addDoc(messagesRef, {
      text: aiReply,
      createdAt: serverTimestamp(),
      role: "model",
    });*/
  };

  return (
    <>
      <div className="message-window">
        {messages?.map((msg) => (
          <ChatMessage key={msg.id} message={msg} currentUserId={user.uid} />
        ))}
        <div ref={dummy}></div>
      </div>

      <div className="send-window">
        <form onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const { currentUserId } = props;

  const messageClass = uid === currentUserId ? "user" : "model";

  return (
    <div className={`message ${messageClass}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} className="text markdown">
        {text}
      </ReactMarkdown>
      {messageClass === "user" && (
        <img src={photoURL} alt="User Avatar" className="avatar" />
      )}
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
    <div className="app-shell">
      <TopBar />
      <section>{user ? <ChatPage user={user} /> : <SignIn />}</section>
    </div>
  );
}
