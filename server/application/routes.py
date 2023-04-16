import sys 
sys.path.insert(1,"server/run.py")

from run import app
from flask import request, make_response
from flask import redirect, send_file
from flask import render_template

from application.static.python.main import *

@app.route("/")
def root():
    
    return render_template("index.html")

@app.route("/api/v1/", methods = ["GET"])
def get_request():
    
    return ""

@app.route("/api/v1", methods = ["POST"])
def get_post():
    
    data = request.get_json()
    
    method = data.get("method")
    
    response = "OK"
    
    if method == "prim":
        
        ... 
    
    if method == "kruskal":
        
        ...
    
    return response
