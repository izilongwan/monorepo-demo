# my-next-app

Next.js application integrated into the monorepo.

## Getting Started

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Features

- **SSG (Static Generation)**: Blog posts are pre-rendered at build time
- **SSR (Server-Side Rendering)**: Dynamic pages are rendered on each request
- **API Routes**: Built-in backend API endpoints
- **TypeScript**: Full TypeScript support
- **Monorepo Integration**: Shared packages from the monorepo

## Project Structure

```
src/
├── pages/          # Next.js pages (routes)
│   ├── api/       # API routes
│   ├── blog/      # Blog pages
│   ├── _app.tsx   # App wrapper
│   ├── _document.tsx  # HTML structure
│   └── index.tsx  # Home page
├── components/    # React components
├── lib/          # Utility functions
└── styles/       # Global styles
```

## Scripts

- `pnpm run dev`: Start development server
- `pnpm run build`: Build for production
- `pnpm start`: Start production server
- `pnpm run lint`: Run ESLint

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js GitHub](https://github.com/vercel/next.js)
