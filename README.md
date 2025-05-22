# Vupercuts

A modern website for Vu Tran's haircut business, allowing customers to book appointments, see availability, and leave reviews.

## Features

- Responsive design for mobile and desktop
- Online appointment booking system
- Payment method selection (Venmo, Cash App, Zelle)
- Customer review system
- Modern and clean UI

## Tech Stack

- **Frontend**: React with TypeScript, Vite
- **Backend**: Python with Flask
- **Deployment**: Vercel

## Development Setup

### Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/vupercuts.git
   cd vupercuts
   ```

2. Set up the frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```

3. Set up the backend:
   ```
   # From the root directory
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r backend/requirements.txt
   cd backend
   flask run
   ```

### Environment Variables

Create a `.env` file in the backend directory with:
```
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=1
```

### Admin Access

The website includes an admin panel for managing reviews. To access the admin functionality:

1. Navigate to the Reviews page
2. Click on the "Admin" link in the top-right corner
3. Use the following credentials:
   - Username: `admin`
   - Password: `vupercuts2024`

As an admin, you can:
- Delete inappropriate reviews
- Monitor customer feedback
- View aggregate ratings

### Deleting Reviews

#### Using the Admin Interface
1. Log in to the admin panel using the credentials above
2. Navigate to the Reviews page
3. Click the trash icon next to the review you want to delete

#### Using the Command Line
You can also delete reviews directly from the command line:

1. First, get the review ID by listing all reviews:
   ```bash
   # This will show all reviews with their IDs
   curl "https://vupercuts.vercel.app/api/reviews" | grep -o '"id":"[^"]*"'
   ```

2. Delete a specific review by ID (replace YOUR_REVIEW_ID with the actual ID):
   ```bash
   # Basic deletion without admin authentication
   curl -X DELETE "https://vupercuts.vercel.app/api/reviews/YOUR_REVIEW_ID"
   
   # For more reliable deletion with admin authentication
   curl -X DELETE "https://vupercuts.vercel.app/api/reviews/YOUR_REVIEW_ID" \
     -H "Authorization: Basic $(echo -n 'admin:vupercuts2024' | base64)"
   ```

3. For convenience, create this reusable shell script:
   ```bash
   # Create the script
   echo '#!/bin/bash
   REVIEW_ID=$1
   if [ -z "$REVIEW_ID" ]; then
     echo "Usage: ./delete_review.sh REVIEW_ID"
     exit 1
   fi
   curl -X DELETE "https://vupercuts.vercel.app/api/reviews/$REVIEW_ID" \
     -H "Authorization: Basic $(echo -n admin:vupercuts2024 | base64)" \
     -H "Content-Type: application/json"
   ' > delete_review.sh
   
   # Make it executable
   chmod +x delete_review.sh
   
   # Use it
   ./delete_review.sh YOUR_REVIEW_ID
   ```

4. Emergency option - clear all reviews at once:
   ```bash
   curl "https://vupercuts.vercel.app/api/clear-reviews"
   ```

## Deployment

This project is configured to deploy on Vercel. The `vercel.json` file contains the necessary configuration.

To deploy:
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` from the project root
3. Follow the prompts to deploy

## Project Structure

```
vupercuts/
├── frontend/              # React/Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main application component
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── backend/               # Python/Flask backend
│   ├── data/              # JSON data storage
│   ├── app.py             # Main application file
│   └── requirements.txt   # Backend dependencies
├── .venv/                 # Python virtual environment
└── vercel.json            # Vercel deployment configuration
```

## License

MIT