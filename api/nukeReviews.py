from http.server import BaseHTTPRequestHandler
import json
import os
import glob

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Find all possible review files
        deleted_files = []
        
        # Try multiple possible locations
        locations = [
            "/tmp/reviews.json",
            "/tmp/vupercuts_reviews.json",
            "./reviews.json",
            "/var/task/reviews.json",
            "."
        ]
        
        # Try to delete all possible review files
        for location in locations:
            try:
                if os.path.exists(location):
                    if os.path.isfile(location):
                        os.remove(location)
                        deleted_files.append(location)
                    elif os.path.isdir(location):
                        # Search for review files in directory
                        review_files = glob.glob(f"{location}/*reviews*.json")
                        for file in review_files:
                            os.remove(file)
                            deleted_files.append(file)
            except Exception as e:
                print(f"Error deleting {location}: {str(e)}")
        
        # Create empty reviews files in all standard locations
        for file_path in ["/tmp/reviews.json", "/tmp/vupercuts_reviews.json"]:
            try:
                with open(file_path, "w") as f:
                    json.dump([], f)
                    print(f"Created empty reviews file at {file_path}")
            except Exception as e:
                print(f"Error creating {file_path}: {str(e)}")
        
        # Send response
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.end_headers()
        
        response_data = {
            "message": "ALL reviews completely wiped from system",
            "success": True,
            "deleted_files": deleted_files
        }
        
        self.wfile.write(json.dumps(response_data).encode()) 