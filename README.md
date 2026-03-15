# UniTime - AI-Powered Student Timetable Management

UniTime is a comprehensive full-stack web application designed to help students manage their academic schedules efficiently. Leveraging Google's Gemini AI, it analyzes uploaded timetables (PDFs or images) to provide personalized study plans, optimize time usage, and integrate seamlessly with Google Calendar.

## 🚀 Features

- **AI-Powered Schedule Analysis**: Upload PDF or image timetables for intelligent analysis using Gemini AI
- **Personalized Study Plans**: Get AI-generated recommendations for study sessions based on available time
- **Google Calendar Integration**: Sync your schedule with Google Calendar for real-time updates
- **User Authentication**: Secure login/signup system with Firebase
- **Responsive Dashboard**: Modern UI built with React and Tailwind CSS
- **Role-Based Access**: Separate dashboards for students and teachers
- **Chatbot Support**: AI-powered chatbot for academic assistance
- **Analytics**: Track your academic progress and time management

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Declarative routing for React
- **Lucide React** - Beautiful icon library
- **Firebase** - Authentication and real-time database

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Google Generative AI (Gemini)** - AI analysis and chatbot functionality
- **Multer** - Middleware for handling file uploads
- **PDF-parse** - PDF text extraction
- **Firebase Admin** - Server-side Firebase operations
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Git**

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Palash-r26/UniTime-MindFlayers.exe.git
   cd UniTime-MindFlayers.exe-main
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables:**

   Create a `.env` file in the `server` directory with the following variables:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```

   For the client, create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. **Firebase Configuration:**

   - Set up a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Add your Firebase config to `client/src/firebase.js`
   - Download the service account key for Firebase Admin and place it in `server/` directory

## 🚀 Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   npm start
   # or for development with auto-reload:
   npx nodemon index.js
   ```

2. **Start the frontend development server:**
   ```bash
   cd client
   npm run dev
   ```

3. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

## 📡 API Endpoints

### AI Analysis
- `POST /api/analyze` - Analyze uploaded timetable files (PDF/Image) and generate study plans

### Chatbot
- `POST /api/chat` - Interact with the AI chatbot for academic assistance

### Authentication
- Handled through Firebase Authentication on the frontend

## 📁 Project Structure

```
UniTime-MindFlayers.exe-main/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── assets/         # Static assets
│   │   └── firebase.js     # Firebase configuration
│   ├── public/             # Public assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── index.js            # Main server file
│   ├── package.json
│   └── *.json              # Firebase service account key
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powering the intelligent analysis
- Firebase for authentication and database services
- The open-source community for the amazing tools and libraries

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.