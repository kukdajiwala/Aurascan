# AURASCAN - AI-Powered HR Assessment Platform

## Overview

AURASCAN is a full-stack web application designed for AI-powered HR assessments. The platform allows users to upload resumes (PDF format) and images for comprehensive candidate evaluation, including mood analysis, trust assessment, and risk evaluation. The application features a modern cyberpunk-inspired UI with customizable branding and real-time assessment processing.

## System Architecture

The application follows a monorepo structure with separate client and server directories, utilizing a full-stack TypeScript approach:

- **Frontend**: React with Vite, TypeScript, and Tailwind CSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **File Processing**: Multer for uploads, PDF parsing capabilities
- **UI Framework**: Radix UI components with shadcn/ui styling
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite build system
- **Styling**: Tailwind CSS with custom cyberpunk theme (cyber cyan accent)
- **UI Components**: Comprehensive shadcn/ui component library based on Radix UI
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query for server state and caching

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **File Handling**: Multer middleware for multipart form uploads
- **Database**: PostgreSQL accessed via Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with proper error handling

### Database Schema
- **Assessments Table**: Stores candidate assessments with scores, recommendations, and file references
- **App Config Table**: Manages customizable application settings (branding, colors, labels)
- **File Storage**: Local file system storage for uploaded PDFs and images

### Core Features
1. **Assessment Form**: Multi-step form for candidate data and file uploads
2. **File Processing**: PDF text extraction and image analysis
3. **AI Analysis**: Mood, trust, and risk scoring algorithms
4. **Results Display**: Interactive dashboard with circular progress indicators
5. **Customization Panel**: Real-time application branding and theme management

## Data Flow

1. **Assessment Creation**:
   - User fills assessment form with candidate details
   - Files (PDF resume, image) are uploaded via multipart form
   - Form validation using Zod schemas

2. **File Processing**:
   - PDF content extraction for resume analysis
   - Image processing for facial emotion detection
   - Files stored in local uploads directory

3. **AI Analysis**:
   - Resume content analysis for skills and experience
   - Sentiment analysis using VADER sentiment analyzer
   - Risk assessment based on multiple factors
   - Trust scoring algorithm

4. **Results Generation**:
   - Comprehensive scoring (mood, trust, risk)
   - Recommendation generation (HIRE/REVIEW/REJECT)
   - Data persistence to PostgreSQL database

5. **Results Display**:
   - Real-time progress indicators
   - Interactive score visualizations
   - Detailed analysis breakdown

## External Dependencies

### Core Runtime Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe ORM for database operations
- **express**: Web application framework
- **multer**: File upload handling
- **pdf-parse**: PDF text extraction
- **vader-sentiment**: Sentiment analysis library
- **axios**: HTTP client for external API calls

### Frontend Dependencies
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **react-hook-form**: Form state management
- **wouter**: Lightweight routing
- **zod**: Schema validation

### UI and Styling
- **@radix-ui/***: Comprehensive UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional class name utility

## Deployment Strategy

### Development Environment
- **Build Tool**: Vite with hot module replacement
- **Development Server**: Express with Vite middleware integration
- **Database**: PostgreSQL with Drizzle Kit migrations
- **File Storage**: Local uploads directory

### Production Build
- **Frontend Build**: Vite production build to `dist/public`
- **Backend Build**: ESBuild compilation to `dist/index.js`
- **Database Migrations**: Drizzle Kit push for schema updates
- **Environment**: Node.js production server

### Configuration Management
- **Environment Variables**: DATABASE_URL for database connection
- **Build Scripts**: Separate development and production workflows
- **Static Assets**: Served from build output directory

## Changelog

```
Changelog:
- July 06, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```