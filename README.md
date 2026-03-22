# Nyaya Mitra - AI-Powered Legal Assistance Platform

**Nyaya Mitra** is a comprehensive legal technology platform designed to democratize access to legal information and connect individuals with verified legal professionals in India. Powered by AI and built with modern web technologies, Nyaya Mitra provides intelligent legal assistance, document management, and a curated network of lawyers.

## Features

### 🤖 AI-Powered Legal Chat
- **Intelligent Legal Q&A**: Ask any legal question in English, Hindi, or any Indian language and receive clear, accurate answers grounded in Indian law
- **Multi-language Support**: Supports queries in multiple Indian languages
- **Chat History**: Maintains conversation history organized by chat sessions
- **Real-time Responses**: Powered by Google Generative AI for instant legal insights
- **Session Management**: Create, manage, and delete chat sessions to organize your legal queries

### 📄 Document Management (Legal Desk)
- **Document Upload**: Upload legal documents (PDFs, Word files) for analysis and storage
- **Smart Text Extraction**: Automatically extracts and processes text from uploaded documents
- **Document Organization**: Manage your legal documents in a central repository
- **Document Chat**: Ask questions about your uploaded documents using AI
- **Document Deletion**: Remove documents as needed

### 👨‍⚖️ Lawyer Directory & Verification
- **Browse Lawyers**: Search and discover verified legal professionals across India
- **Filter by Specialization**: Find lawyers by their area of expertise (Corporate Law, Criminal Law, Family Law, etc.)
- **Verified Network**: Only verified lawyers appear in the directory
- **Lawyer Profiles**: View detailed profiles including experience, hourly rates, and specializations
- **Lawyer Onboarding**: Lawyers can create comprehensive profiles with credentials and expertise

### 📋 Form Generation Assistant
- **Interactive Form Wizard**: Step-by-step guide to create legal forms
- **Multiple Form Types**:
  - RTI (Right to Information) Applications
  - Consumer Forum Complaints
  - Bail Applications
  - General Affidavits
- **Customizable Forms**: Generate forms based on user-provided information
- **Print & Export**: Save or print generated forms as PDFs

### 🔐 User Authentication & Roles
- **Secure Authentication**: Supabase-powered user authentication
- **Role-based Access**: Different views and features for regular users and lawyers
- **User Profiles**: Complete user profiles with contact information and role management
- **Lawyer Verification**: Admin system for verifying lawyer credentials through Bar Council registration

### 📊 Admin Dashboard
- **Knowledge Base Management**: Manage AI training documents and legal resources
- **Document Uploads**: Admin can upload knowledge documents to improve AI responses
- **Lawyer Verification**: Review and verify lawyer profiles based on Bar Council registration
- **User Analytics**: Monitor verified vs. pending lawyer profiles
- **Document Management**: Organize and delete knowledge base documents

## Technology Stack

- **Frontend**: 
  - React 19 & Next.js 16 (App Router)
  - TypeScript for type safety
  - Tailwind CSS with custom design system
  - Shadcn UI components

- **Backend**:
  - Next.js API Routes
  - Supabase (PostgreSQL, Authentication, Real-time)

- **AI & NLP**:
  - Google Generative AI (Gemini)
  - Document processing with PDF-Parse and Mammoth.js

- **Document Processing**:
  - PDF parsing and text extraction
  - Word document (.docx) support
  - Chunked text processing for AI training

## Project Structure

```
src/app/
├── page.tsx                          # Public landing page
├── layout.tsx                        # Root layout
├── globals.css                       # Global styles & theme variables
│
├── (auth)/                           # Authentication routes
│   ├── login/page.tsx               # User login
│   └── signup/page.tsx              # User registration & role selection
│
├── dashboard/                        # Main application area
│   ├── layout.tsx                   # Dashboard layout with sidebar
│   ├── page.tsx                     # Dashboard home
│   │
│   ├── chat/page.tsx                # Legal Chat interface
│   ├── lawyers/page.tsx             # Browse verified lawyers
│   ├── lawyers/[lawyerId]/page.tsx  # Lawyer profile detail
│   ├── legal-desk/page.tsx          # Document upload & management
│   ├── legal-desk/[documentId]/page.tsx # Document detail & chat
│   ├── forms/page.tsx               # Form generation assistant
│   └── onboarding/page.tsx          # Lawyer profile setup
│
├── admin/                            # Admin-only features
│   ├── page.tsx                     # Admin dashboard
│   └── knowledge/upload/route.ts    # Knowledge base upload API
│
└── api/                              # Backend API routes
    ├── chat/route.ts                # Chat with AI endpoint
    ├── documents/upload/route.ts    # Document file upload
    ├── documents/chat/route.ts      # Chat about documents
    ├── forms/generate/route.ts      # Generate legal forms
    └── test-gemini/route.ts         # AI integration testing

lib/
├── supabase/
│   ├── client.ts                    # Client-side Supabase instance
│   └── server.ts                    # Server-side Supabase instance
├── embeddings.ts                    # Vector embeddings for documents
├── extractText.ts                   # Text extraction utilities
├── chunkText.ts                     # Text chunking for processing
└── utils.ts                         # Utility functions

components/
├── ui/                              # Reusable UI components
│   ├── button.tsx
│   ├── input.tsx
│   └── label.tsx
├── DeleteSessionButton.tsx          # Delete chat sessions
├── DeleteDocumentButton.tsx         # Delete uploaded documents
├── DeleteLawyerButton.tsx           # Admin: Delete lawyer profiles
├── KnowledgeUpload.tsx              # Admin: Upload knowledge documents
├── VerifyButton.tsx                 # Admin: Verify lawyers
└── LogoutButton.tsx                 # User logout
```

## Navigation Guide

### 📍 User Navigation

#### Landing Page (`/`)
- Public page showcasing platform features
- Sign Up and Login buttons
- Learn about Nyaya Mitra's benefits

#### Authentication (`/login`, `/signup`)
- **Login**: Existing users sign in
- **Signup**: New users register with email and password
  - Choose role: Regular User or Lawyer
  - Set up profile information

#### Dashboard (`/dashboard`)
**Home Page**
- Quick access cards to all features
- Recent documents and chat sessions overview

**Legal Chat** (`/dashboard/chat`)
- Ask legal questions in natural language
- View chat history and previous conversations
- Start new chat sessions
- Real-time AI responses with legal citations

**Legal Desk** (`/dashboard/legal-desk`)
- Upload documents (PDF, Word)
- View uploaded documents
- Chat with AI about specific documents
- Delete documents
- Download or reference documents

**Find Lawyers** (`/dashboard/lawyers`)
- Search lawyers by name or specialization
- Filter verified lawyers
- View hourly rates and specializations
- Click "View Profile" for detailed information
- **Lawyer Profile** (`/dashboard/lawyers/[lawyerId]`)
  - Full lawyer details (bio, experience, specializations)
  - Contact information
  - Hourly rates

**Form Assistant** (`/dashboard/forms`)
- Select form type (RTI, Consumer Complaint, Bail, Affidavit)
- Answer step-by-step questions
- Generate customized legal forms
- Print or save forms as PDF

**My Lawyer Profile** (`/dashboard/onboarding`) *[Lawyers only]*
- Complete professional profile
- Add Bar Council registration
- Set specializations and hourly rate
- Add professional bio
- Track verification status

### 👤 Admin Navigation

#### Admin Dashboard (`/admin`)
**Knowledge Base Tab**
- View total uploaded documents
- Manage legal knowledge database
- Upload new documents for AI training
- Delete outdated documents
- Search and organize documents

**Lawyer Verification Tab**
- View all lawyer profiles
- See verified vs. pending counts
- Review lawyer credentials
- Approve/verify lawyers
- Delete invalid profiles
- Track lawyer statistics

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (for backend)
- Google API key (for Generative AI)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/nyaya-mitra.git
cd nyaya-mitra
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_API_KEY=your_google_generative_ai_key
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production
```bash
npm run build
npm start
```

## Key Use Cases

### For Regular Users
1. **Get Legal Advice**: Ask questions about Indian law instantly
2. **Manage Documents**: Upload and organize legal documents
3. **Find Lawyers**: Discover and contact verified legal professionals
4. **Generate Forms**: Create legal forms with AI assistance
5. **Document Analysis**: Get AI insights about uploaded legal documents

### For Lawyers
1. **Onboarding**: Register with Bar Council credentials
2. **Profile Management**: Maintain professional profile
3. **Directory Presence**: Appear in lawyer search results
4. **Client Connection**: Connect with users seeking legal help

### For Admins
1. **Verification**: Verify lawyer credentials
2. **Knowledge Management**: Curate legal knowledge base
3. **Platform Oversight**: Monitor platform activity

## Design System

The application uses a **GitHub Light theme** with the following color palette:
- **Background**: `#f6f8fa` (soft off-white)
- **Cards**: `#ffffff` (white)
- **Primary Text**: `#24292e` (deep navy)
- **Secondary Text**: `#57606a` (muted gray)
- **Borders**: `#d0d7de` (light gray)
- **Primary Action**: `#24292e` (dark navy buttons)

## Security Features

- **Secure Authentication**: Supabase authentication with token management
- **Role-based Access Control**: Different features for different user types
- **Verification System**: Lawyers must be verified before appearing in directory
- **Admin Verification**: Only verified lawyers can use lawyer features
- **Data Protection**: Secure document uploads and storage

## API Endpoints

### Chat & AI
- `POST /api/chat` - Send legal query to AI
- `POST /api/test-gemini` - Test Gemini API integration

### Documents
- `POST /api/documents/upload` - Upload document file
- `POST /api/documents/chat` - Chat about uploaded documents

### Forms
- `POST /api/forms/generate` - Generate legal form

### Admin
- `POST /api/admin/knowledge/upload` - Upload knowledge documents

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary. For licensing inquiries, contact the development team.

## Support

For issues, features requests, or support, please reach out to the development team.

---

**Nyaya Mitra** - Making Legal Assistance Accessible to Everyone
