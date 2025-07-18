# QTI Playground

A modern web application for viewing, editing, and understanding QTI (Question and Test Interoperability) 3.0 XML content. This tool provides an interactive environment for working with QTI assessment items and comprehensive documentation to learn about the QTI 3.0 standard.

## What is this app?

QTI Playground is an educational tool that allows users to:

- **View and Preview QTI 3.0 Content**: Load QTI XML files and see how they render as interactive assessments
- **Edit QTI XML**: Use a built-in code editor with syntax highlighting to modify QTI 3.0 content
- **Learn QTI 3.0**: Access comprehensive documentation covering all aspects of the QTI 3.0 standard
- **Experiment**: Try sample QTI 3.0 content and modify it to understand how different components work

## How it works

The application consists of three main sections:

1. **Home Page**: Landing page with navigation to all features
2. **Playground**: Interactive editor where you can load, edit, and preview QTI 3.0 XML files
3. **Learn**: Comprehensive documentation system with 13 sections covering everything from QTI 3.0 basics to advanced topics

The playground uses a split-pane interface with a code editor on the left and a live preview on the right, allowing real-time visualization of QTI 3.0 content changes.

## Technologies Used

This project is built with modern web technologies:

- **React 18** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Radix UI** - Accessible component primitives
- **Material-UI** - Additional UI components and styling
- **CodeMirror** - Code editor with XML syntax highlighting
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and state management
- **React Hook Form** - Form handling and validation
- **Zod** - TypeScript-first schema validation
- **React Dropzone** - File upload functionality
- **Next Themes** - Theme switching support
- **Sonner** - Toast notifications

## Local Development Setup

### Prerequisites

- Node.js 18+ (recommended to use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd qti-playground
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run tests with interactive UI
- `npm run test:coverage` - Run tests with coverage report

## Testing

This project includes comprehensive automated tests using [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (for development)
npm run test -- --watch

# Run tests with interactive UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Located in `src/**/__tests__/` directories
- **QTI Parser Tests**: Comprehensive testing of XML parsing logic
- **Template Tests**: Testing of QTI item template generation
- **Component Tests**: React component rendering and interaction tests

### Writing Tests

Tests are written using Vitest syntax (similar to Jest) with React Testing Library for component testing:

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('Component', () => {
  it('should render correctly', () => {
    const { container } = render(<Component />);
    expect(container).toBeInTheDocument();
  });
});
```

## Docker Development Setup

### Using Docker Compose (Recommended)

1. Create a `docker-compose.yml` file in the project root:

```yaml
version: '3.8'
services:
  qti-playground:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
```

2. Create a `Dockerfile.dev` for development:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]
```

3. Run with Docker Compose:
```bash
docker-compose up --build
```

### Using Docker directly

1. Build the development image:
```bash
docker build -f Dockerfile.dev -t qti-playground-dev .
```

2. Run the container:
```bash
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules qti-playground-dev
```

### Production Docker Build

For production deployment, create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t qti-playground .
docker run -p 80:80 qti-playground
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── learn/           # Learning documentation components
│   ├── qti/             # QTI-specific components
│   └── ui/              # shadcn/ui components
├── pages/               # Main page components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
