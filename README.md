# Card Vault

A Yu-Gi-Oh! card collection management system that uses OCR technology to scan and organize your cards.

## Features

- 📸 Card scanning with OCR technology
- 📊 Collection management and organization
- 📱 Responsive design for mobile and desktop
- 🔄 Real-time card validation
- 📥 Batch upload support
- 📋 Spreadsheet export functionality
- 👤 User authentication and profiles

## Tech Stack

### Frontend

- React with TypeScript
- Material-UI for components
- Redux Toolkit for state management
- React Router for navigation
- Axios for API requests

### Backend

- Node.js/Express
- MongoDB Atlas
- Google Cloud Vision API
- JWT Authentication
- (See backend/README.md for more details)

## Getting Started

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd card-vault
   ```

2. Install dependencies:

   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables:

   ```bash
   # Frontend (.env)
   VITE_API_URL=http://localhost:5000

   # Backend (.env)
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLOUD_CREDENTIALS=your_credentials
   ```

4. Start the development servers:

   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm run dev
   ```

## UI Features

- 🎨 Modern, responsive Material-UI design
- 🎮 Yu-Gi-Oh! themed animations and effects
- 📱 Mobile-first approach
- 🌙 Dark mode optimized

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Yu-Gi-Oh! Trading Card Game
- Google Cloud Vision API for OCR capabilities
- Material-UI for the component library
