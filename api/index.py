from http.server import BaseHTTPRequestHandler
import json
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("index")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        logger.info("API root endpoint called")
        
        # Get environment info
        env_info = {
            "vercel_env": os.environ.get("VERCEL_ENV", "not set"),
            "path": self.path,
            "headers": dict(self.headers),
            "cwd": os.getcwd(),
            "files_in_cwd": os.listdir() if os.path.exists(os.getcwd()) else [],
            "tmp_dir_exists": os.path.exists("/tmp"),
            "tmp_dir_writable": os.access("/tmp", os.W_OK) if os.path.exists("/tmp") else False,
        }
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        self.wfile.write(json.dumps(env_info).encode()) 