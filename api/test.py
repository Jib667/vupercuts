from http.server import BaseHTTPRequestHandler
import json
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("test")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        logger.info("Test endpoint called")
        
        # Get environment info
        env_info = {
            "tmp_dir_exists": os.path.exists("/tmp"),
            "tmp_dir_writable": os.access("/tmp", os.W_OK),
            "current_dir": os.getcwd(),
            "listdir_tmp": os.listdir("/tmp") if os.path.exists("/tmp") else [],
            "path": self.path,
            "headers": dict(self.headers),
            "vercel_env": os.environ.get("VERCEL_ENV", "not set"),
            "python_version": os.environ.get("PYTHON_VERSION", "not set")
        }
        
        # Create a test file in /tmp
        test_file_path = "/tmp/test-file.txt"
        try:
            with open(test_file_path, "w") as f:
                f.write("Test file created at " + str(os.environ.get("NOW_READY")))
            env_info["test_file_created"] = True
        except Exception as e:
            env_info["test_file_created"] = False
            env_info["test_file_error"] = str(e)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        self.wfile.write(json.dumps(env_info).encode()) 