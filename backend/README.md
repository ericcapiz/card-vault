# Card Vault Backend

A Node.js backend service that provides OCR capabilities for Yu-Gi-Oh! cards using Google Cloud Vision API and MongoDB for data storage.

## Technologies Used

- Node.js/Express
- MongoDB Atlas
- Google Cloud Vision API
- Fly.io for deployment
- JWT Authentication
- Multer for file uploads

## Setup

### Prerequisites

- Node.js installed
- MongoDB Atlas account
- Google Cloud account with Vision API enabled
- Fly.io account

### Local Development

1. Clone the repository
   git clone [your-repo-url]
   cd backend

2. Install dependencies
   npm install

3. Create a `.env` file with:
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_TYPE=service_account
   GOOGLE_PROJECT_ID=your_project_id
   GOOGLE_CLIENT_EMAIL=your_service_account_email
   GOOGLE_PRIVATE_KEY=your_private_key

## API Routes

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Collections

- `POST /api/collections` - Create new collection
- `GET /api/collections` - Get all collections
- `GET /api/collections/:id` - Get specific collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection

### Card Upload & OCR

- `POST /api/upload/image` - Upload and process card image

## Google Cloud Vision Integration

The backend uses Google Cloud Vision API for OCR (Optical Character Recognition) to read card names from images. The process includes:

1. Image upload handling with Multer
2. Text detection using Vision API
3. Card name extraction and cleaning
4. Verification against Yu-Gi-Oh! card database

## Deployment

### Fly.io Deployment Steps

1. Install Fly CLI:
   curl -L https://fly.io/install.sh | sh

2. Login to Fly:
   fly auth login

3. Initialize app:
   fly launch

4. Set environment secrets:
   fly secrets set MONGODB_URI="your_uri"
   fly secrets set JWT_SECRET="your_secret"
   fly secrets set GOOGLE_TYPE="service_account"
   fly secrets set GOOGLE_PROJECT_ID="your_project_id"
   fly secrets set GOOGLE_CLIENT_EMAIL="your_email"
   fly secrets set GOOGLE_PRIVATE_KEY="your_key"

5. Deploy:
   fly deploy

### MongoDB Atlas Configuration

1. Create cluster in MongoDB Atlas
2. Add IP whitelist entry (`0.0.0.0/0` for development)
3. Create database user
4. Get connection string

## Error Handling

The API includes comprehensive error handling for:

- Invalid uploads
- OCR processing errors
- Database connection issues
- Authentication failures

## Security

- JWT authentication for protected routes
- Environment variables for sensitive data
- File type validation for uploads
- MongoDB Atlas IP whitelisting

## Development Notes

- OCR includes custom scoring system for card name matching
- Supports multiple image uploads
- Automatic card verification against Yu-Gi-Oh! database
- Configurable image processing parameters

## Additional Notes

The backend implements a sophisticated OCR system that not only detects text but also verifies it against the Yu-Gi-Oh! card database. The scoring system helps ensure accurate card identification by:

- Matching individual words
- Checking word order
- Applying bonuses for exact matches
- Handling partial matches with penalties

The deployment process using fly.io provides a robust and scalable hosting solution, with automatic SSL certification and global CDN distribution. The MongoDB Atlas integration ensures reliable data persistence with proper security measures in place.
