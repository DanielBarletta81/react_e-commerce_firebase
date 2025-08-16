# Agent Commands and Setup

## Development Commands
- **Start dev server**: `npm run dev` (runs on http://localhost:3000)
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

## Testing Commands
- **Run all tests**: `npm test -- --run`
- **Watch mode**: `npm run test:watch`
- **Test coverage**: `npm run test:coverage`
- **Test UI**: `npm run test:ui`

## Database Commands
- **Seed database**: `npm run seed` (requires service account key)
- **Client-side seeding**: Use 🌱 button on `/debug` page

## Project Structure
- **Frontend**: React 19 + Vite
- **Database**: Firebase Firestore
- **Styling**: Custom CSS with cyberpunk theme
- **Testing**: Vitest + React Testing Library
- **CI/CD**: GitHub Actions + Vercel

## Key Routes
- `/` - Home page
- `/products` - Product catalog
- `/cart` - Shopping cart
- `/profile` - User profile (requires login)
- `/debug` - Debug tools and database seeding
- `/simple-test` - Simple product testing

## Testing Coverage
- **Unit Tests**: ProductList, UserProfile components
- **Integration Tests**: Cart functionality end-to-end
- **TDD Approach**: Tests written first, then implementation
- **Mocked Dependencies**: Firebase, React Router, localStorage

## CI/CD Pipeline
- **Triggers**: Push to main branch
- **Steps**: Install → Test → Build → Deploy
- **Platform**: GitHub Actions → Vercel
- **Fail Conditions**: Any test failure prevents deployment

## Firebase Setup
- **Client SDK**: Web app configuration
- **Admin SDK**: Server-side operations (requires service account)
- **Security Rules**: Firestore permissions
- **Collections**: products, users, orders

## Custom Features
- **Cursor tracking**: Interactive hover effects
- **Raised cards**: 3D visual effects with glow
- **Dark theme**: Cyberpunk-inspired design
- **Light theme**: User profile sections
- **Responsive**: Mobile-friendly layouts
