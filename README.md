# Habit-Tracking Garden

A cozy gamified habit tracker built with React + Firebase.  
Each habit is represented as a plant. Complete your habit daily to water the plant and grow it from seed to flower. Miss days and the plant gently wilts.

## Features

- Add and delete habits
- Complete habits once per day
- Plant growth stages: seed, sprout, leafy, bud, bloom
- Streak-based health, vibrancy, and size
- Seasonal themes based on real-world month
- Public share garden link
- Friend "sunlight boosts"
- Cozy ambient music toggle
- Particle effects on completion
- Firebase Firestore persistence
- Cute responsive UI

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Then add your Firebase config values to `.env`.

## Firebase

Create a Firebase project, enable Firestore Database, and paste your config into `.env`.

Suggested Firestore rules for a demo portfolio project are included in `firestore.rules`.
