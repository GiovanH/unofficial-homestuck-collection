#!/bin/python3
from http.server import BaseHTTPRequestHandler, HTTPServer, SimpleHTTPRequestHandler
import sys
import os

root_dir = os.environ['ROOT_DIR']

host = sys.argv[2] if len(sys.argv) > 2 else '0.0.0.0'
port = int(sys.argv[3]) if len(sys.argv) > 1 else 8413


class CORSRequestHandler(SimpleHTTPRequestHandler):

    def __init__(self, *args, directory=None, **kwargs):
        directory = root_dir
        self.directory = os.fspath(directory)
        super(BaseHTTPRequestHandler, self).__init__(*args, **kwargs)
        
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        # self.send_header('Access-Control-Allow-Headers', '*')
        # self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(CORSRequestHandler, self).end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

print("Listening on {}:{} at root {}".format(host, port, root_dir))
httpd = HTTPServer((host, port), CORSRequestHandler)
httpd.serve_forever()
