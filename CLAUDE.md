# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on port 8080
- `npm run build` - Production build for Firebase Hosting
- `npm run preview` - Preview production build

### Firebase Deployment
- `npm run firebase:login` - Login to Firebase CLI
- `npm run firebase:serve` - Serve the app locally using Firebase hosting emulator
- `npm run firebase:deploy` - Build and deploy to Firebase Hosting
- `npm run firebase:init` - Initialize Firebase hosting (run only once)

### Code Quality
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Testing
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once (CI mode)
- `npm run test:coverage` - Generate coverage report
- To run a single test file: `npx vitest run path/to/test.test.tsx`

## Architecture

### Core Pattern: QTI Parser Factory
The application uses a factory pattern to handle multiple QTI versions (2.1 and 3.0). The `QTIParserFactory` in `src/parsers/QTIParserFactory.ts` automatically detects the QTI version and returns the appropriate parser. When adding new QTI features:
1. Check if the feature exists in both QTI 2.1 and 3.0 parsers
2. Implement in the appropriate parser(s) under `src/parsers/qti21/` or `src/parsers/qti30/`
3. Ensure the factory correctly routes to your implementation

### Scoring Engine Architecture
The `ScoringEngine` in `src/scoring/` implements complex scoring logic with:
- Template-based scoring (match_correct, map_response, etc.)
- Custom scoring with conditions, ranges, and string matching
- Partial credit calculation

When modifying scoring:
1. Template processors are in `src/scoring/templates/`
2. Custom scoring logic is in `src/scoring/customScoring.ts`
3. All scoring changes should be tested with the existing test suite

### Component Structure
Components follow a domain-driven organization:
- `src/components/ui/` - MUI Material components and shadcn/ui adapters (consolidated to MUI)
- `src/components/qti/` - QTI-specific interactive components
- `src/components/learn/` - Documentation and tutorial components  
- `src/components/preview/` - Preview and scoring display

When creating new QTI components:
1. Place in `src/components/qti/`
2. Follow existing patterns for handling QTI data structures
3. Use the existing QTI types from `src/types/`
4. Use MUI Material components or the MUI adapter components in `src/components/ui/`

### State Management
- Local state: React hooks and context
- QTI state: Custom hooks in `src/hooks/useQTIPreview.ts`

### Path Aliases
Use these import aliases:
- `@/components` - Component imports
- `@/lib` - Library utilities
- `@/types` - TypeScript types
- `@/utils` - Utility functions

## Key Files and Directories

### Parser System
- `src/parsers/QTIParserFactory.ts` - Entry point for all QTI parsing
- `src/parsers/base/ParserInterfaces.ts` - Parser interface definitions
- `src/parsers/qti21/` - QTI 2.1 implementation
- `src/parsers/qti30/` - QTI 3.0 implementation

### QTI Templates
- `src/utils/qtiTemplates.ts` - Pre-built QTI templates for different question types

### XML Processing
- `src/utils/xmlUtils.ts` - XML parsing and manipulation
- `src/utils/xmlUpdater.ts` - XML update operations
- `src/utils/jsonXmlConversion.ts` - JSON-XML conversion utilities

## Testing Approach

Tests use Vitest with React Testing Library. Key testing patterns:
- Parser tests validate QTI parsing logic
- Component tests use React Testing Library for user interactions
- Scoring tests verify complex scoring calculations
- Mock setup in `src/test/setup.ts` includes window.matchMedia and ResizeObserver

## Development Notes

- The application supports both QTI 2.1 and 3.0 formats
- TypeScript strict mode is partially relaxed (no-unused-vars and no-explicit-any disabled)
- Tailwind CSS with custom theming in `tailwind.config.js`
- GitHub Actions CI runs tests on Node 18.x and 20.x
- **Deployment target**: Firebase Hosting with automatic GitHub Actions deployment

## Recent Refactoring (2025)

The codebase was significantly refactored to reduce complexity and dependencies:

### Changes Made:
- **Dependencies reduced from 85+ to 52** (~39% reduction)
- **Bundle size reduced from 1,610 kB to 1,553 kB** 
- **Consolidated UI libraries**: Migrated from dual shadcn/ui + MUI to MUI Material only
- **Removed unused dependencies**: date-fns, zod, react-hook-form, TanStack Query, next-themes, class-variance-authority, Radix UI packages (27), and others
- **Simplified state management**: Removed server state complexity, kept focused local state
- **Removed duplicate toast system**: Consolidated to single Toaster implementation

### Component Migration:
Created MUI adapter components maintaining API compatibility:
- Badge → Chip (MUI)
- Card → MUI Card
- Button → MUI Button  
- Input → TextField
- Checkbox → MUI Checkbox
- Slider → MUI Slider
- Textarea → TextField

### Remaining Architecture:
- Core shadcn/ui components kept for LearnLayout (sidebar, sheet, skeleton, separator)
- All 439 tests passing after migration
- All existing functionality preserved with improved maintainability

## Firebase Setup (2025)

The application has been migrated from GitHub Pages to Firebase Hosting:

### Initial Setup Required:
1. **Create Firebase Project**: Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. **Update Project ID**: Replace `your-firebase-project-id` in `.firebaserc` with your actual Firebase project ID
3. **Enable Hosting**: Enable Firebase Hosting in your Firebase project console
4. **Login to Firebase**: Run `npm run firebase:login` to authenticate
5. **Deploy**: Run `npm run firebase:deploy` to deploy the app

### GitHub Actions Integration:
The repository includes GitHub Actions workflows for automatic deployment:
- **Main branch**: Automatically deploys to production on push to main
- **Pull requests**: Creates preview deployments for PRs

**Required GitHub Secrets:**
- `FIREBASE_SERVICE_ACCOUNT_QTI_PLAYGROUND`: Service account key from Firebase Console
  1. Go to Project Settings > Service Accounts
  2. Generate new private key
  3. Add the JSON content as a GitHub secret

### Configuration Files:
- `firebase.json`: Firebase Hosting configuration with SPA routing
- `.firebaserc`: Firebase project configuration
- `.github/workflows/`: GitHub Actions for CI/CD