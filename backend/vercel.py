from app import app
from flask import Flask, request

# Vercel serverless function handler
def handler(request, **kwargs):
    # This adapts the Flask app to Vercel's serverless function format
    return app(request['method'], request['path'], request.get('query', {}), request.get('body', {})) 