# from flask import Flask, render_template
# from flask_socketio import SocketIO

# app = Flask(__name__)
# app.config['SECRET_KEY'] = 'ashy'
# sio = SocketIO(app)

# @app.route("/")
# def home():
#     return render_template("index.html")

# if __name__ == "__main__":
#     sio.run(app)

from app import createApp, sio

app = createApp()

sio.run(app)