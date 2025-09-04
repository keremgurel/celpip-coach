# CELPIP Speaking Coach

An AI-powered mobile app that helps users practice CELPIP Speaking with automated feedback and scoring.

## Features

- **8 CELPIP Speaking Tasks** with official timing
- **AI-Powered Feedback** with CELPIP rubric scoring
- **Audio Recording** with waveform visualization
- **Progress Tracking** and session history
- **Credit System** with in-app purchases
- **Cross-Platform** iOS and Android support

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: OpenAI Whisper (ASR) + GPT-4 (Feedback)
- **Payments**: RevenueCat
- **State Management**: Zustand
- **Navigation**: Expo Router

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn 1.22+
- Expo CLI
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/celpip-coach.git
cd celpip-coach
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cd apps/mobile
cp env.example .env
# Edit .env with your Supabase credentials
```

4. Set up Supabase:
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase
supabase init

# Start local Supabase (optional)
supabase start

# Apply migrations
supabase db push
```

5. Start the development server:
```bash
yarn dev
```

## Project Structure

```
celpip-coach/
├── apps/
│   └── mobile/                 # React Native app
│       ├── app/               # Expo Router pages
│       ├── components/        # Reusable UI components
│       ├── hooks/            # Custom React hooks
│       ├── lib/              # Utilities and configurations
│       ├── stores/           # Zustand stores
│       ├── types/            # TypeScript type definitions
│       └── constants/        # App constants
├── packages/
│   ├── ui/                   # Shared UI components
│   ├── database/             # Database types and utilities
│   └── api/                  # API utilities and types
├── supabase/
│   ├── migrations/           # Database migrations
│   ├── functions/            # Edge Functions
│   └── seed.sql             # Initial data
└── docs/                    # Documentation
```

## Development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn ios` - Run on iOS simulator
- `yarn android` - Run on Android emulator
- `yarn web` - Run on web browser
- `yarn lint` - Run ESLint
- `yarn type-check` - Run TypeScript type checking

### Database Schema

The app uses Supabase with the following main tables:

- `profiles` - User profiles
- `credits` - Credit management
- `sessions` - Practice sessions
- `tasks` - Individual tasks within sessions
- `feedback` - AI-generated feedback
- `prompts` - Task prompts bank

### CELPIP Task Types

1. **Advice** (30s prep, 90s speak)
2. **Personal Experience** (30s prep, 90s speak)
3. **Describe a Scene** (30s prep, 60s speak)
4. **Predictions** (30s prep, 60s speak)
5. **Compare and Persuade** (60s prep, 60s speak)
6. **Difficult Situation** (60s prep, 60s speak)
7. **Express Opinions** (30s prep, 90s speak)
8. **Unusual Situation** (30s prep, 60s speak)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@celpipcoach.com or create an issue in this repository.
