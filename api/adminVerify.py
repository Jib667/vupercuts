from http.server import BaseHTTPRequestHandler
import json
import base64

# Admin credentials
ADMIN_CREDENTIALS = {"username": "admin", "password": "vupercuts2024"}

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Check authorization
        auth_header = self.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Basic '):
            self.send_error_response(401, "Unauthorized")
            return
        
        # Extract and check credentials
        encoded_credentials = auth_header[6:]  # Remove 'Basic '
        decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
        username, password = decoded_credentials.split(':')
        
        if username != ADMIN_CREDENTIALS["username"] or password != ADMIN_CREDENTIALS["password"]:
            self.send_error_response(401, "Invalid credentials")
            return
        
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