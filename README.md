# Instagram Clone

A full-stack social media platform mirroring core Instagram functionalities, featuring secure dual-token authentication, real-time messaging, and robust error handling.

🔗 **Live Demo:** [https://instagram-clone-frontend-seven.vercel.app]

## Features

- Secure authentication using **Access & Refresh Tokens** with automated token rotation and error handling
- Post management (create, view, delete) with image hosting
- Real-time chat system and direct post interactions (likes/comments)
- User profiles, follow/unfollow mechanisms
- media optimization

## Tech Stack

**Frontend:** React, TypeScript, Vite, TanStack Query, Socket.io-client, Tailwind CSS, shadcn/ui, Zod, React Router

## What I Learned

- **Advanced Authentication Flows** — Implemented secure session management using short-lived Access Tokens and long-lived Refresh Tokens with Axios interceptors.
- **Real-Time Communication & UI** — Built persistent bi-directional connections via Socket.io and optimized user experience with optimistic UI updates.
- **Centralized Error Handling** — Designed a uniform API error response schema paired with global error boundary catchers.
