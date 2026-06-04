# FIFA World Cup Simulator

A fun and interactive FIFA World Cup tournament simulator built with React and Vite.

## About

This project allows you to create and simulate FIFA World Cup tournaments. You can manage tournaments, simulate matches, and track results all locally without any backend dependencies.

## Prerequisites

1. Clone the repository using the project's Git URL
2. Navigate to the project directory
3. Install dependencies: `npm install`

## Getting Started

### Run the app locally

```bash
npm run dev
```

This will start the development server on `http://localhost:5173` by default.

### Build for production

```bash
npm run build
```

### Lint and fix code

```bash
npm run lint
npm run lint:fix
```

## Features

- Create and manage FIFA World Cup tournaments
- Simulate tournament phases (Qualification, Group Stage, Knockout, Playoffs, Championships)
- Real-time tournament tracking
- Responsive design with modern UI
- Local storage for tournament data

## Tech Stack

- **Frontend**: React 18, Vite
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: React Context API
- **Data Fetching**: TanStack React Query
- **Routing**: React Router

## Project Structure

```
src/
├── components/       # React components
├── pages/           # Page components
├── core/            # Core tournament logic
├── hooks/           # Custom React hooks
├── lib/             # Utilities and context providers
├── storage/         # Local storage helpers
└── utils/           # Utility functions
```

## Local Development

The app runs completely locally with mock authentication. You can log in with any email/password combination to test the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run typecheck` - Run TypeScript checks

## License

MIT

