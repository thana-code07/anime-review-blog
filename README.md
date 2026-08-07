# Anime Review Blog

Anime Review Blog is a full-stack review site for browsing, reading, and engaging with anime write-ups. This package is the React frontend.

## Live Demo

[https://anime-review-blog.vercel.app/](https://anime-review-blog.vercel.app/)

## Features

- Browse published reviews with search, category filter, and pagination
- Read markdown posts with likes, comments, and social sharing
- Authentication: sign up, login, profile and avatar management, password reset
- Admin CMS for articles (draft/publish), categories, post images, and engagement notifications
- Role-aware UI that routes admins into the CMS and keeps public readers on the blog

## Tech Stack

- React 19 + Vite
- React Router
- Tailwind CSS 4 + shadcn/ui
- Axios
- react-markdown

## Architecture

The client is organized around pages and layouts, with shared state and API access layered underneath:

- **Pages & layouts** — public blog, auth flows, account settings, and admin shell
- **Contexts** — `AuthContext` for session/user state; `NotificationsContext` for unread counts and dropdowns
- **API modules** — domain helpers under `src/lib/` (`blogApi`, `auth`, `categoriesApi`, `notificationApi`, and related admin helpers)
- **HTTP client** — Axios instance with a Bearer token interceptor; clears the session on unauthorized responses

## Getting Started

```bash
cd client
npm install
```

Create a `.env` file in `client/` with:

```env
VITE_API_BASE_URL=http://localhost:4000
```

Point `VITE_API_BASE_URL` at your running API (local or deployed).

```bash
npm run dev      # development server (typically http://localhost:5173)
npm run build    # production build
npm run preview  # preview the production build
```

The API must be running for auth, posts, and engagement features to work. See the [server README](../server/README.md) for backend setup.

## Related

- [Server (API)](../server/README.md)
