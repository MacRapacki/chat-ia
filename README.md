# AI Chat Application

A modern React/Next.js chat application with AI integration, file sharing, and speech-to-text capabilities.

![AI Chat App](https://img.shields.io/badge/Next.js-15.5.3-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4)

## 🚀 Features

### ✅ Implemented Features

- **Authentication System**: Secure login with hardcoded credentials for demo purposes
- **Real-time AI Chat**: Integration with OpenAI's GPT models via Vercel AI SDK
- **Message Streaming**: Real-time display of AI responses as they're generated
- **File Upload & Sharing**: Support for images, PDFs, and text files with preview
- **Speech-to-Text**: Voice input functionality using Web Speech API
- **Profile Management**: Editable user profiles with image upload
- **Modern UI/UX**: Clean, responsive design with smooth navigation
- **State Management**: Efficient state handling with Zustand
- **App Router**: Next.js 13+ App Router for modern navigation

### 🎯 Key Technologies

- **Frontend**: React 19, Next.js 15, TypeScript
- **Styling**: Tailwind CSS with modern design system
- **AI Integration**: Vercel AI SDK with OpenAI GPT models
- **State Management**: Zustand with persistence
- **File Handling**: React Dropzone for uploads
- **Icons**: Lucide React for consistent iconography
- **Speech**: Web Speech API for voice input

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key (optional, mock responses work without it)

### Installation

1. **Clone or extract the project**:

   ```bash
   # If you received a git bundle:
   git clone ai-chat-app.bundle ai-chat-app
   cd ai-chat-app

   # Or if you have the source files:
   cd ai-chat-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment setup** (Optional):

   ```bash
   # Copy the environment template
   cp .env.example .env.local

   # Edit .env.local and add your OpenAI API key:
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   **Note**: The app works without an API key using mock responses for demonstration.

4. **Start the development server**:

   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Credentials

Use these credentials to log in:

- **Email**: `test@example.com`
- **Password**: `password123`

## 📱 Usage Guide

### Getting Started

1. **Login**: Use the demo credentials on the homepage
2. **Chat**: Navigate to the chat page and start conversing with the AI
3. **File Upload**: Click the paperclip icon to attach files
4. **Voice Input**: Click the microphone icon to use speech-to-text
5. **Profile**: Visit the profile page to update your information

### Features Overview

#### 🤖 AI Chat

- Send text messages to the AI assistant
- Receive streaming responses in real-time
- View conversation history during the session

#### 📎 File Sharing

- Drag and drop files or click to select
- Support for images (JPEG, PNG, GIF, WebP)
- Support for documents (PDF, DOC, DOCX, TXT, MD)
- File preview before sending
- Maximum file size: 10MB per file

#### 🎤 Speech-to-Text

- Click the microphone icon to start recording
- Speak your message clearly
- The text will appear in the input field
- Works in modern browsers with Web Speech API support

#### 👤 Profile Management

- Edit your name and email
- Upload a custom profile picture
- Changes are saved locally for the demo

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/chat/          # Chat API endpoint
│   ├── chat/              # Chat page
│   ├── profile/           # Profile page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage (login)
├── components/            # React components
│   ├── ChatInterface.tsx  # Main chat component
│   ├── FileUpload.tsx     # File upload component
│   ├── LoginForm.tsx      # Authentication form
│   ├── Navbar.tsx         # Navigation component
│   ├── ProfileForm.tsx    # Profile editing form
│   ├── ProtectedRoute.tsx # Route protection
│   └── SpeechToText.tsx   # Voice input component
├── stores/                # State management
│   ├── authStore.ts       # Authentication state
│   └── chatStore.ts       # Chat state
├── types/                 # TypeScript definitions
│   └── index.ts           # Shared types
└── lib/                   # Utility functions
```

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

The project includes:

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for consistent styling
- Modern React patterns and hooks

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (optional)
- `NEXT_PUBLIC_APP_URL` - Application URL (default: http://localhost:3000)

### Supported File Types

- **Images**: JPEG, JPG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX, TXT, MD
- **Size Limit**: 10MB per file

## 🌐 Browser Support

- **Modern browsers** with ES6+ support
- **Speech-to-Text** requires browsers with Web Speech API:
  - Chrome 25+
  - Edge 79+
  - Safari 14.1+
  - Firefox (limited support)

## 📝 Implementation Notes

### Authentication

- Uses hardcoded credentials for demo purposes
- Session persisted in localStorage
- Protected routes redirect to login when not authenticated

### AI Integration

- Utilizes Vercel AI SDK for OpenAI integration
- Streams responses for real-time user experience
- Falls back to mock responses without API key

### File Handling

- Client-side file processing and preview
- Base64 encoding for image storage
- File validation and size limits

### State Management

- Zustand for lightweight state management
- Persistent auth state across browser sessions
- Session-based chat history (not persisted)

## 🎨 Design System

The application uses a modern design system with:

- **Colors**: Indigo primary, gray neutrals
- **Typography**: Geist Sans and Geist Mono fonts
- **Spacing**: Tailwind's spacing scale
- **Components**: Consistent button and form styles
- **Responsive**: Mobile-first responsive design

## 🚀 Deployment

The application can be deployed to Vercel, Netlify, or any platform supporting Next.js:

```bash
npm run build
npm run start
```

For Vercel deployment:

```bash
vercel deploy
```

## 📄 License

This project is created as a recruitment task and is for demonstration purposes.

## 🤝 Contributing

This is a demonstration project created for a recruitment task. The implementation showcases modern React/Next.js development practices and AI integration patterns.

---

**Built with ❤️ using React, Next.js, and modern web technologies**
