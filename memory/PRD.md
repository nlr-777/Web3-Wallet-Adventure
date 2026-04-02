# Web3 Wallet Adventure - PRD

## Original Problem Statement
Build a standalone kid-safe Web3 mini-game app called "Web3 Wallet Adventure" for ages 8-12, deployable to Vercel. Theme: Adventure map with BlockQuest squad (Sam the skeptic narrates safety). Core concept: Manage a pretend wallet on a quest map to learn wallets, seed phrases, decentralization, smart contracts — no real keys/money.

## Core Requirements
- 5 linear levels: Seed Phrase Magic, Receive Coins, Send Safely, Smart Contract Promise, Decentralized Escape
- Progress dashboard (XP bar, levels %, badges)
- Return to HQ link (https://blockquestofficial.com?progress=wallet_complete&xp=300)
- Real-World Transaction Simulator (gas fee sliders, hash generation, fake transaction delay)
- Gas Fee Decision Mini-Games (turtle vs rocket animations)
- Safe Seed Phrase Adventure (icon-based recovery mini-game)
- Cross-Game Wallet Link (Shared fake BQ balance, NFT minting, unified XP claim)
- Transaction history log (immutable, exportable as "My Wallet Diary" PDF)

## Tech Stack
- Frontend: React SPA, Tailwind CSS (HSL semantic tokens - retro neon theme), Shadcn UI, Framer Motion
- Backend: FastAPI, Supabase + MongoDB fallback
- Deployment: Vercel (Root Directory = frontend)

## What's Been Implemented (as of April 2, 2026)
- [x] Full 5-level adventure game with interactive map
- [x] BlockQuest retro neon theme (cyan, magenta, orange)
- [x] Icon-based Seed Phrase Game (progressive hints)
- [x] Transaction Simulator with gas fee sliders and hash generation
- [x] Gas Fee Decision Mini-Games (turtle vs rocket)
- [x] Cross-Game Wallet Link (NFT minting, unified XP claim)
- [x] Supabase + MongoDB backend integration
- [x] Progress Dashboard with XP bar, badges, stats
- [x] Transaction History with PDF export ("My Wallet Diary")
- [x] Vercel deployment config fixed (frontend/vercel.json)
- [x] Text readability improvements (lighter grays on dark backgrounds)

## Vercel Deployment
- Root Directory: `frontend` (set in Vercel dashboard)
- Config: `/app/frontend/vercel.json` with SPA rewrites, yarn build, network timeout
- Build: `craco build` (wraps react-scripts)

## Key Files
- `/app/frontend/vercel.json` - Vercel deployment config
- `/app/frontend/src/components/ProgressDashboard.jsx` - Dashboard with transaction history
- `/app/frontend/src/components/wallet/TransactionHistory.jsx` - PDF export feature
- `/app/frontend/src/lib/wallet.js` - Wallet management utilities

## Remaining / Future Tasks
- None explicitly requested. App is feature-complete per PRD.

## Design Rules
- Primary colors: cyan, magenta/pink, orange, purple, green, yellow
- All styling uses HSL design tokens from index.css
- Font: Orbitron for headings, system fonts for body
- Web3 elements are purely educational mocks - no real blockchain logic
