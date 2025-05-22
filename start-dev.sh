#!/bin/bash

# Start the backend server
echo "Starting Flask backend server..."
source .venv/bin/activate
cd backend
flask run &
BACKEND_PID=$!
cd ..

# Start the frontend server
echo "Starting Vite frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Handle shutdown
function cleanup {
  echo "Shutting down servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

trap cleanup SIGINT

echo "Both servers are running!"
echo "Backend: http://127.0.0.1:5000"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop both servers"

# Keep the script running
wait 