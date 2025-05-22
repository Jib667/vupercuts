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