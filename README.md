# Vupercuts

A modern website for Vu Tran's haircut business, allowing customers to book appointments, see availability, and leave reviews.

## Local Development Setup

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

2. Starting the Frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be accessible at http://localhost:3000

3. Starting the Backend:
   ```
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```
   The backend API will be accessible at http://localhost:5000

## Vercel Deployment Settings

When deploying to Vercel, configure the following settings:

### Environment Variables

Make sure to set these environment variables in your Vercel project settings:

- `FLASK_APP`: app.py
- `FLASK_ENV`: development
- `GOOGLE_API_KEY`: your google maps API key
- `GOOGLE_PLACE_ID`: ChIJrQaIzQZNtokRES2hzHsMEhI

### Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Development Command**: `npm run dev`

### API Configuration

The serverless API endpoints are configured in the `vercel.json` file. Make sure this file is included in your deployment.

### Custom Domain Setup (Optional)

You can configure a custom domain in the Vercel dashboard under Domain Settings. 