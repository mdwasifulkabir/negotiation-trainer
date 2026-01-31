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
