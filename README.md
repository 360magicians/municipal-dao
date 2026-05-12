# Municipal DAO

A decentralized autonomous organization (DAO) platform for municipal governance, part of the MBTQ ecosystem. 

## Overview

Municipal DAO enables community-driven decision making and governance at the municipal level, with blockchain integration and real-time collaboration features.

## Tech Stack

- **Framework**: Next. js 14 + TypeScript
- **Auth**: [DeafAUTH](https://github.com/pinkycollie/deafauth-ecosystem) (SSO for deaf services ecosystem)
- **Database**: Supabase
- **Blockchain**: Ethers.js
- **Styling**:  TailwindCSS + Radix UI
- **Real-time**: WebSocket + Redis

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up Supabase
pnpm supabase:start
pnpm db:migrate

# Start development
pnpm dev
```

## Key Features

- 🗳️ **Voting System** - Decentralized governance and proposal voting
- 🔐 **DeafAUTH SSO** - Unified authentication across deaf services
- 💬 **Real-time Collaboration** - WebSocket-powered communication
- ⛓️ **Blockchain Integration** - Ethereum-based smart contracts
- 📊 **Municipal Governance** - Transparent community decision-making

## Deaf Accessibility Ecosystem

This platform integrates with the broader deaf accessibility infrastructure:

- **[DeafAUTH Ecosystem](https://github.com/pinkycollie/deafauth-ecosystem)** - SSO & identity management (includes DeafOS deployment target)
- **[PinkFlow](https://github.com/pinkycollie/pinkflow)** - Test container for qualifying deaf accessibility products/services/apps
- **[PinkFlowAI](https://github.com/pinkycollie/pinkflowai)** - AI model validation and qualification pipeline

### Integration Flow

```
Deaf Accessibility Products/Services/Apps
    ↓
PinkFlow + PinkFlowAI (Testing & AI Model Qualification)
    ↓
Deploy to DeafOS (via DeafAUTH Ecosystem)
    ↓
Enable SSO & Voting Access → Municipal DAO
```

Once products pass PinkFlow/PinkFlowAI qualification, they're containerized and deployed to DeafOS, enabling:
- Single Sign-On across all qualified deaf services
- Internal voting rights for governance
- Cross-platform identity and participation

## Scripts

```bash
pnpm dev              # Development server
pnpm build            # Production build
pnpm test             # Run tests
pnpm db:migrate       # Database migrations
pnpm supabase:start   # Start local Supabase
```

## Project Structure

```
├── app/              # Next.js pages
├── components/       # UI components
├── services/         # DeafAUTH API & microservices
├── server/           # Backend logic
├── supabase/         # Database configs
└── tests/            # Test suites
```

## Contributing

This is a fork of [360magicians/municipal-dao](https://github.com/360magicians/municipal-dao). Contributions welcome! 

## License

[Your License]
