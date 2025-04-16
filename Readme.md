# 🎯 Real-Time Polling Application

Welcome to the **Real-Time Polling Application**, an interactive and dynamic web app built with **React** and **Socket.io**. This app allows users to join or create virtual "scenes" (rooms) where they can participate in live polls, view poll descriptions, and see real-time voting updates with graphical representations.

---

## 🚀 Features

- 🔐 **Room/Scene Access** – Create or join rooms using a unique scene ID.
- 👤 **User Identity** – Capture participant names for personalized interactions.
- 🖼️ **Scene Details** – Each scene includes a custom title, description, and image-based poll options.
- ⚡ **Real-Time Updates** – Votes are synced in real-time using Socket.io.
- 📊 **Graphical Voting UI** – Each option displays vote counts and progress bars.
- ✅ **Vote Restriction** – Users can vote only once per session.
- 🔙 **Navigation** – Simple navigation to go back from a poll to the home screen.
- 🧼 **Clean Design** – Responsive and modern UI with CSS styling.

---

## 🧱 Tech Stack

| Frontend     | Backend (WebSocket) |
|--------------|---------------------|
| React        | Node.js + Socket.io |
| React Router |                     |
| CSS Modules  |                     |

---

## 📂 Project Structure

```
/src
  ├── components
  │   ├── Form.js            # For entering user name and room number
  │   └── PollRoom.js       # Display Poll and Polling Result Based on Selected Scene
  │   └── Scenery.js        # Displace Various Polling Scenes
  ├── data
  │   └── pollsData.js       # Static data for poll scenes
  ├── utils
  │   └── socket.js          # Socket.io client setup
  ├── App.js
  └── index.js
```

---

## 🛠️ How It Works

1. Users land on a **Form page** where they enter their name and a room number.
2. Upon submitting, they are redirected to a **Scenery** tied to that roomid.
3. Upon submitting, they are redirected to a **PollRoom** tied to that scene ID.
4. Each scene displays:
   - A title and description.
   - Two image-based options to vote on.
   - Real-time voting bars updating via Socket.io.
5. Once a user votes, the options are disabled, and vote counts are updated across all connected clients.
6. After The Time Has Completed The Votes Will be Get Erased
7. Maintain Persistent Time Towards All Users joins with same room
---

## 📦 Installation & Running Locally

```bash
# Clone the repo
git clone https://github.com/yourusername/polling-app.git
cd polling-app

# Install dependencies
npm install

# Start the app
npm start
```

> Ensure your backend Socket.io server is also running if you're connecting to a custom server.
> To Run the socket server
```
cd server
npm install 
node index.js
```

---

## 🙌 Credits

Made with ❤️ by Chanakya Manas Korada

---
