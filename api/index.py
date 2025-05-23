from http.server import BaseHTTPRequestHandler
import json
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("index")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        response = {
            "status": "success",
            "message": "API index route is working",
            "info": "Try accessing /api/google-reviews for reviews data",
            "path": self.path
        }
        
        self.wfile.write(json.dumps(response).encode()) 