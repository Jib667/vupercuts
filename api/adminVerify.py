from http.server import BaseHTTPRequestHandler
import json
import base64
import logging
import traceback
from api.db import verify_admin

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("adminVerify")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        logger.info(f"GET request received: {self.path}")
        logger.info(f"Headers: {self.headers}")
        
        # Check authorization
        auth_header = self.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Basic '):
            logger.error("Missing or invalid Authorization header")
            self.send_error_response(401, "Unauthorized")
            return
        
        try:
            # Extract and check credentials
            encoded_credentials = auth_header[6:]  # Remove 'Basic '
            decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
            username, password = decoded_credentials.split(':')
            
            logger.info(f"Received auth for username: {username}")
            
            if not verify_admin(username, password):
                logger.error(f"Invalid credentials for username: {username}")
                self.send_error_response(401, "Invalid credentials")
                return
            
            logger.info("Admin authentication successful")
            
            # Success response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = {
                "status": "authenticated",
                "message": "Admin authentication successful"
            }
            
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            logger.error(traceback.format_exc())
            self.send_error_response(500, f"Server error: {str(e)}")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_data = {
            "error": message
        }
        
        self.wfile.write(json.dumps(error_data).encode()) 