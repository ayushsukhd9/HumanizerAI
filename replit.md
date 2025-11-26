# Humanizer AI - Project Documentation

## Overview

Humanizer AI is a web application that transforms AI-generated text into natural, human-like writing. The application offers three distinct modes (casual, professional, creative) with adjustable tone controls to help users convert robotic or stilted text into authentic-sounding content. Built as a full-stack TypeScript application, it features a React frontend with a clean, productivity-focused interface and an Express backend integrated with OpenAI's GPT-5 API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for lightweight client-side routing (home page and tool page)

**UI Component System**
- Radix UI primitives for accessible, unstyled component foundations
- shadcn/ui component library with the "new-york" style variant
- Tailwind CSS for utility-first styling with custom design tokens
- Design system inspired by Linear and ChatGPT interfaces, prioritizing clarity and efficiency over visual flourish

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management, caching, and API interactions
- Custom query client with error handling and automatic retries disabled
- React Hook Form with Zod resolvers for form validation

**Key Design Decisions**
- Typography: Inter font family for UI/content, JetBrains Mono for technical elements
- Spacing system based on Tailwind's standard scale (2, 4, 6, 8, 12, 16, 20, 24)
- Two-column layout for input/output on the tool page
- Theme support (light/dark mode) with localStorage persistence

### Backend Architecture

**Server Framework**
- Express.js running on Node.js with TypeScript
- Dual-mode server setup: development mode with Vite middleware, production mode serving static assets
- Custom logging middleware tracking API request duration and responses

**API Design**
- RESTful endpoints for text humanization:
  - `POST /api/humanize` - Single text transformation
  - `POST /api/humanize/batch` - Multiple text transformations
  - `GET /api/history` - Retrieve humanization history
  - `DELETE /api/history/:id` - Remove history entries
- Zod schema validation on all incoming requests with descriptive error messages
- JSON request/response format with proper error handling

**Text Processing**
- OpenAI GPT-5 integration for text humanization
- Three mode-specific system prompts (casual, professional, creative)
- Optional tone adjustment (0-100% formality scale)
- Batch processing support for up to 10 texts simultaneously

### Data Storage

**Database Solution**
- PostgreSQL via Neon serverless database
- Drizzle ORM for type-safe database queries and migrations
- WebSocket-based connection pooling for serverless environments

**Schema Design**
- `humanization_history` table storing:
  - Original and humanized text pairs
  - Mode and tone settings used
  - Timestamp for chronological ordering
  - UUID primary keys
- Maximum 50 most recent entries returned for history queries

**Migration Strategy**
- Drizzle Kit for schema management and migrations
- Migration files stored in `/migrations` directory
- Schema definition in shared TypeScript file for frontend/backend consistency

### External Dependencies

**AI Services**
- OpenAI API (GPT-5 model) for natural language processing and text transformation
- Requires `OPENAI_API_KEY` environment variable

**Database Services**
- Neon PostgreSQL serverless database
- Requires `DATABASE_URL` environment variable
- Uses WebSocket connections via `@neondatabase/serverless` package

**UI Libraries**
- Radix UI component primitives (@radix-ui/react-*)
- Lucide React for iconography
- Embla Carousel for carousel components
- date-fns for date formatting in history display

**Development Tools**
- Replit-specific plugins for development environment integration:
  - Runtime error overlay modal
  - Cartographer for code navigation
  - Development banner
- ESBuild for production server bundling

**Build & Deployment**
- TypeScript compilation with strict mode enabled
- Path aliases for clean imports (@/, @shared/, @assets/)
- Separate build processes for client (Vite) and server (ESBuild)
- Production server expects pre-built static assets in `dist/public`