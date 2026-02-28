# Negotiation Trainer

Negotiation Trainer is a web app built for **KitaHack 2026** that lets users practice realistic negotiation conversations with an AI opponent, then receive structured feedback on their performance.
It tackles SDG 4 (Quality Education), SDG 8 (Decent Work and Economic Growth), and SDG 10 (Reduced Inequalities). This app acts as a practice opponent for people to practice their negotiating skills and learn to be a better negotiator.

## Technical Architecture

### Frontend

- **React + Vite** single-page application.
- Main UI flow is implemented in `src/App.jsx`.
- Markdown rendering for AI responses uses `react-markdown` + `remark-gfm`.

### AI Layer

- AI integration is isolated in `src/ai.js`.
- Uses `@google/genai` with `gemini-2.5-flash` for:
  - Negotiation replies (`getNegotiationReply`)
  - Scenario generation (`generateScenario`)
  - Session title generation (`generateSessionTitle`)
  - Post-session coaching feedback (`generateFeedback`)

### Backend Services

- **Firebase Authentication** (Google Sign-In) for user identity.
- **Cloud Firestore** for persistent chat/session storage.
- Data model:
  - `sessions` collection (metadata per conversation)
  - `sessions/{sessionId}/messages` subcollection (chat history + feedback entries)

### Deployment/Tooling

- Vite build pipeline for frontend bundling.
- Firebase config/rules included for backend integration and access control (`firebase.json`, `firestore.rules`).

## Implementation Details

### Session Management

- On new chat, a Firestore `session` document is created with `uid`, default title, and `createdAt`.
- Sidebar loads user-specific sessions (`where("uid", "==", uid)`) and sorts by newest.
- Deleting a session removes both subcollection messages and parent session document.

### Messaging Flow

- Chat messages are stored in Firestore with role metadata (`user` or `model`) and timestamps.
- The app loads the latest message history for active sessions and auto-scrolls on update.
- For the first user message:
  - title is generated from user input
  - scenario setup is generated before active negotiation begins
- For subsequent messages:
  - recent conversation context is sent to Gemini for in-character negotiation responses

### Feedback Generation

- Users can end a negotiation explicitly via the `End` action.
- Conversation text is compiled and passed to AI coaching prompt.
- A markdown-formatted feedback report is saved as a model message (`type: "feedback"`).

### Prompt and Behavior Strategy

- Negotiation prompts enforce role consistency, counteroffers, and gradual concessions.
- Feedback prompts return a structured review with strengths, weaknesses, improvement points, and skill ratings.

### Environment and Secrets

- Gemini API key is read from `VITE_API_KEY` in environment variables (`.env`).

## Challenges Faced

Use this section as a template and replace with your own points:

- Challenge 1:
  - Problem: User can only have one chat session with AI
  - Solution: Implemented `sessions` to allow for multiple chats with AI. Session sidebar was implemented to display and switch between different sessions.
- Challenge 2:
  - Problem: AI was readily making concessions, providing little to no resistance and counter-offers to user, leading to very unrealistic negotiations.
  - Solution: Modify `getNegotiation` prompt to make the negotiation replies more realistic.

## Future Roadmap

- Voice mode for a more authentic negotiating experience
- Different personality settings to AI:
  - Competitive (hard bargainer)
  - Collaborative
  - Risk-averse
  - Emotion-driven
  - Data-driven
- Different levels of difficulty
- Adding a Learn Mode
