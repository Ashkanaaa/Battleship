from flask import Flask, render_template, redirect, request,session 
from flask_socketio import SocketIO,join_room,leave_room,send
from string import ascii_uppercase
import random

def createApp():
    app = Flask(__name__)
    #app.config["DEBUG"] = True
    app.config["SECRET_KEY"] = "ashy"
    return app
def createSio(app):
    #sio = SocketIO(app)
    sio = SocketIO(app, async_mode='eventlet', ping_interval=10, ping_timeout=10)
    return sio