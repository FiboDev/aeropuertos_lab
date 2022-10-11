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
    
    first_airport = data[0]
    second_airport = data[1]
    
    addVertex(first_airport[0], first_airport[1])
    addVertex(second_airport[0], second_airport[1])
    
    response = addEdge(first_airport[0], first_airport[1], second_airport[0], second_airport[1])

    return {"distance": response}
