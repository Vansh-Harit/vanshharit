# Vansh Harit Portfolio

An interactive portfolio built with Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion, React Three Fiber, Matter.js, and OGL.

## Sections

- **Introduction:** animated liquid-glass biography
- **Projects:** terminal-style project browser with responsive effects
- **Experience:** scroll-driven 3D intergalactic career journey
- **Contact:** interactive liquid-ether background and social contact cards

Desktop and mobile experiences are intentionally tailored independently. Expensive visual engines are loaded only when their section and device capabilities require them.

## Local Development

Requirements:

- Node.js 20.9 or newer
- npm 10 or newer

Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Test From a Phone

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_ALLOWED_DEV_ORIGINS` to the laptop's LAN IP.
3. Keep the phone and laptop on the same network.
4. Open `http://<laptop-ip>:3000` on the phone.

Multiple development origins can be comma-separated.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
npm run audit:prod
```

Run the complete release check with:

```bash
npm run check
```

## Security

- Environment files are ignored except for the safe `.env.example` template.
- Production responses include CSP, clickjacking, MIME-sniffing, referrer, resource, and browser-permission protections.
- The application is static and contains no server actions, API routes, authentication state, or committed credentials.
- External links opened in new tabs use `noopener`/`noreferrer`.

## Repository Notes

Local Codex attachments, one-off MCP inspection scripts, build output, editor files, reports, and unused video exports are excluded from Git. The source of truth lives under `src/`, with public runtime assets under `public/images/`.
