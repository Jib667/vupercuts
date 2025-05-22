# Vupercuts

A modern website for Vu Tran's haircut business, allowing customers to book appointments, see availability, and leave reviews.

## Features

- Responsive design for mobile and desktop
- Online appointment booking system
- Payment method selection (Venmo, Cash App, Zelle)
- Customer review system
- Modern and clean UI

## Tech Stack

- **Frontend**: React with JavaScript
- **Backend**: Serverless API endpoints (Python)
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

3. Local API testing:
   ```
   # From the root directory
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r api/requirements.txt
   ```

### Admin Access

The website includes basic admin functionality for managing reviews. To access this functionality:

1. Navigate to the Reviews page
2. When logged in as admin, you can delete reviews
3. Admin credentials:
   - Username: `admin`
   - Password: `vupercuts2024`

### Deleting Reviews

As an admin, you can delete reviews directly from the reviews page by clicking on the delete button associated with each review. The system will prompt for confirmation before deleting.

## Deployment

This project is configured to deploy on Vercel. The `vercel.json` file contains the necessary configuration.

To deploy:
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` from the project root
3. Follow the prompts to deploy

## Project Structure

```
vupercuts/
├── frontend/              # React frontend
│   ├── src/               # Source code
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main application component
│   ├── public/            # Static assets
│   │   └── admin.js       # Admin functionality
│   └── package.json       # Frontend dependencies
├── api/                   # Serverless API endpoints
│   ├── reviews.py         # Handles review CRUD operations
│   ├── adminVerify.py     # Admin verification
│   └── requirements.txt   # API dependencies
├── vercel.json            # Vercel deployment configuration
└── README.md              # This file
```

## License

MIT