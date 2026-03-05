# skillRealms

A free GED prep web application designed to help learners prepare for their GED exam at their own pace.

## Tech Stack

- **Frontend**: React 18 + Vite 5
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **Routing**: React Router v6
- **Data Fetching**: TanStack React Query v5
- **Backend/Auth/DB**: Firebase (Auth + Firestore)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Project Structure

```
src/
  app.jsx              - Main app router
  main.jsx             - Entry point with QueryClientProvider
  index.css            - Tailwind CSS import
  firebase.js          - Firebase app initialization
  pages/
    Home.jsx           - Landing page with auth hero
    Dashboard.jsx      - Main user dashboard
    Courses.jsx        - Course catalog
    Lesson.jsx         - Active lesson view
    Games.jsx          - Learning games hub
    Profile.jsx        - User profile & stats
    Resources.jsx      - Support resources directory
    Upgrade.jsx        - Pro upgrade page
    components/
      landings/
        HeroSection.jsx        - Login/register form
        FeaturesSection.jsx    - Feature highlights
        ResourcesFooter.jsx    - Footer with resources
        dashboard/
          StreakCard.jsx        - Daily streak display
          OverallProgress.jsx   - Progress overview
          SubjectCard.jsx       - Subject card
          DailyLessonButton.jsx - Daily lesson CTA
          lesson/
            LessonContent.jsx  - Lesson content renderer
            VideoLesson.jsx    - Video lesson
            MotivationalQuote.jsx - Quotes
            games/             - Interactive learning games
  components/
    ui/
      Button.jsx       - Reusable button component
      Card.jsx         - Reusable card components
```

## Environment

- Dev server: `npm run dev` on port 5000
- Deployment: Static site (build: `npm run build`, public: `dist/`)

## Firebase Config

Firebase credentials are hardcoded in `src/firebase.js` for project `skillrealms`.

## Setup Notes

- Tailwind v4 uses `@import "tailwindcss"` in `src/index.css` and the `@tailwindcss/vite` Vite plugin (no `tailwind.config.js` needed)
- Vite is configured to bind to `0.0.0.0:5000` with `allowedHosts: true` for Replit proxy compatibility
