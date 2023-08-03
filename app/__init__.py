from flask import Flask , jsonify


from .events import sio
from .routes import main

def createApp():
    app = Flask(__name__)
    app.config["DEBUG"] = True
    app.config["SECRET_KEY"] = "ashy"

    app.register_blueprint(main)
    sio.init_app(app)
    return app