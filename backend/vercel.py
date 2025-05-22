from app import app
from flask import Response
import json

# This adapts the Flask app to Vercel's serverless function format
def handler(request):
    """Handle a request to a serverless function."""
    
    # Convert Vercel's request format to WSGI format for Flask
    environ = {
        'wsgi.input': '',
        'wsgi.errors': '',
        'wsgi.version': (1, 0),
        'wsgi.multithread': False,
        'wsgi.multiprocess': False,
        'wsgi.run_once': False,
        'wsgi.url_scheme': 'https',
        'SERVER_SOFTWARE': 'Vercel',
        'REQUEST_METHOD': request['method'],
        'PATH_INFO': request['path'],
        'QUERY_STRING': '',
        'CONTENT_TYPE': request.get('headers', {}).get('content-type', ''),
        'CONTENT_LENGTH': request.get('headers', {}).get('content-length', ''),
        'HTTP_AUTHORIZATION': request.get('headers', {}).get('authorization', ''),
    }
    
    # Add query string parameters
    if request.get('query'):
        environ['QUERY_STRING'] = '&'.join([f"{k}={v}" for k, v in request.get('query', {}).items()])
    
    # Handle request body
    if request.get('body'):
        body_data = request.get('body')
        if isinstance(body_data, dict):
            body_data = json.dumps(body_data).encode('utf-8')
        elif isinstance(body_data, str):
            body_data = body_data.encode('utf-8')
        environ['wsgi.input'] = [body_data]
        environ['CONTENT_LENGTH'] = str(len(body_data))
    
    # Capture the response from Flask
    response_headers = []
    status_code = [200]
    response_body = []
    
    def start_response(status, headers):
        status_code[0] = int(status.split(' ')[0])
        response_headers.extend(headers)
    
    # Call the Flask app with our WSGI environ
    response_data = app(environ, start_response)
    for data in response_data:
        if isinstance(data, bytes):
            response_body.append(data.decode('utf-8'))
        else:
            response_body.append(data)
    
    # Format the response for Vercel
    formatted_headers = {k: v for k, v in response_headers}
    
    return {
        'statusCode': status_code[0],
        'headers': formatted_headers,
        'body': ''.join(response_body)
    } 