# Discord Clone

A high-fidelity, pixel-perfect recreation of the Discord user interface, built with **React** and **Tailwind CSS**. 

This project serves as a sophisticated frontend simulation that mimics the core functionality of Discord, including server navigation, channel management, messaging interactions, and user settings, all powered by local state management.

**Created by [AuraZod](https://github.com/AuraZod)**

*(Replace this link with a real screenshot of your app once uploaded)*

## 🚀 Features Implemented

This application goes beyond a simple layout and includes interactive logic for a realistic experience:

* **Server & Channel Navigation:**
    * Fully functional server list with tooltips.
    * Expandable channel categories.
    * **Channel Management:** Create, rename, and reorder channels (Move Up/Down).
* **Messaging System:**
    * Real-time feel with optimistic UI updates.
    * **Rich Text:** Tag/Mention highlighting (`@User`).
    * **Interactions:** Edit, Delete, and React to messages.
    * **Grouping:** Messages grouping logic based on timestamps and authors.
    * **Emoji Picker:** Functional emoji selection.
* **User & Profile System:**
    * **Custom Status:** Online, Idle, DND indicators.
    * **Profile Modal:** Click on users to view profiles, send DMs, and see roles.
    * **Avatar Upload:** Upload local images to change your profile picture.
    * **Settings:** Comprehensive User and Server settings modals with tab navigation.
* **Direct Messages (DMs):**
    * Start private conversations from user profiles.
    * Dedicated "Home" dashboard with Friend list.
* **Visual Polish:**
    * Dark mode compliant (Discord's specific color palette).
    * Custom scrollbars.
    * Fluid animations and transitions.

## 🛠️ Tech Stack (Current)

* **Frontend Framework:** React.js
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State Management:** React `useState` / `useEffect` (Local Simulation)

## 🔮 Future Plans & Roadmap

Currently, this project operates as a client-side simulation. To evolve this into a fully functional chat application ("The Proper Way"), the following architectural changes are planned:

1.  **Backend Integration:**
    * Migrate to **Next.js** or **Node.js/Express** for server-side logic.
    * Implement **PostgreSQL** with **Prisma ORM** for persistent data storage.
2.  **Real-Time Communication:**
    * Replace local state with **Socket.io** or **Pusher** for instant message delivery across clients.
3.  **Authentication:**
    * Implement secure auth using **Clerk**, **NextAuth**, or **JWT** (HttpOnly cookies).
4.  **Voice & Video:**
    * Integrate **LiveKit** or **WebRTC** to make the voice channels functional (currently a UI simulation).
5.  **File Storage:**
    * Connect **AWS S3** or **UploadThing** for persistent image/file sharing.

## 💻 Getting Started

To run this project locally:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/AuraZod/Discord-clone.git](https://github.com/AuraZod/Discord-clone.git)
    ```
2.  **Navigate to the project directory**
    ```bash
    cd Discord-clone
    ```
3.  **Install dependencies**
    ```bash
    npm install
    ```
4.  **Start the development server**
    ```bash
    npm start
    # or
    npm run dev
    ```

## 🤝 Contributing

Contributions are highly encouraged! The goal is to turn this frontend masterpiece into a fully functioning full-stack application.

If you have ideas for:
* Connecting a backend.
* Improving accessibility.
* Adding mobile responsiveness.
* Fixing UI bugs.

Please feel free to **fork** the repository and submit a **Pull Request**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Star ⭐ this repository if you find it cool!**
