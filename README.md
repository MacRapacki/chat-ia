# AI Chat Application

A React/Next.js chat application with AI integration and speech-to-text capabilities.

### Prerequisites

-   Node.js 18+ installed
-   npm or yarn package manager
-   OpenAI API key (optional, mock responses work without it)

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
    NEXT_PUBLIC_API_KEY=your_openai_api_key_here
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

-   **Email**: `test@example.com`
-   **Password**: `password123`
