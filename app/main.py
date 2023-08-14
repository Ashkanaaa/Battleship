from flask import Flask, render_template, redirect,url_for, request, session
from flask_socketio import SocketIO,join_room,leave_room,send,emit
from string import ascii_uppercase
from datetime import timedelta
import random, json

from __init__ import createApp, createSio
from game import  handle_ready,setUpData,handle_fire,sendMsg


app = createApp()
sio = createSio(app)
app.permanent_session_lifetime = timedelta(minutes=1)


rooms = {}
singleplayers = []

def generateCode(length):
    while True:
        code = "" #initialize code with empty string
        for x in range(length):
            code += random.choice(ascii_uppercase)
        if code not in rooms:
            break
    return code

@app.route("/", methods=["POST","GET"])
def home():
    return render_template("menu.html")

@app.route("/singleplayer")
def singlePlayer():
    print("fetched")

    return render_template("index.html")


@app.route("/room", methods=["POST","GET"])
def room():
    session.clear()
    if request.method == "POST":
        name = request.form.get("name")
        code = request.form.get("code")
        join = request.form.get("join", False) #The second argument of get() is the default value to be returned if the "join" field does not exist in the form data. In this case, if the "join" field is not present, the variable join will be set to False.
        create = request.form.get("create", False) #we are setting the deafult to False so when the value pair of create and join do not exist (which they dont in our case since they are only buttons) we gonna get False

        #if no name was entered
        if not name:
            return render_template("room.html", error="Please enter a name.", code = code, name = name)
        #if Join was hit but no game ID was entered
        if join != False and not code:
            return render_template("room.html", error="Please enter a game ID.", code = code, name = name)
        
        
        room = code
        if create != False: #create new room if they press create button and name is entered
            room = generateCode(5)
            rooms[room] = {"members":0}
        elif code not in rooms: #if they are joining the room but their session ID is not valid
            return render_template("room.html", error="Game ID does not exist", code = code, name = name)
        if join != False and rooms[room]['members']>=2: #if room already has 2 players in it it avoids connection and goes back to room.html
            print("FROM ROOM: " + str(rooms[room]['members']))
            return render_template("room.html", error="This room already has 2 players bruh")
        #store the room and name in the session assiciated with the client
        session["room"] = room
        session["name"] = name
        #load the game 
        return redirect(url_for("game"))
    else:
        return render_template("room.html")


@app.route("/game")
def game():
    room = session.get("room")
    if room is None or session.get("name") is None or room not in rooms:
        return redirect(url_for("room")) 
    
    return render_template("index.html", singleplayer=False)



@sio.on("connect")
def connect(auth):
    print("the id is :" + request.sid)
    room = session.get("room")
    name = session.get("name")
    if not room or not name:
        print("SINGLEPLAYER")
        singleplayers.append(request.sid)
        return
    if room not in rooms:
        print("SINGLEPLAYER22222")
        leave_room(room)
        return
    else:
        join_room(room)

    #when first player joins
    if rooms[room]["members"] == 0:
        rooms[room]["ID"] = request.sid
    #when second player joins    
    if rooms[room]["members"] == 1:
        setUpData(request.sid,rooms,room,name)

    
    emit('connect', "your game ID is: " + room, to=request.sid)
    send({"name": name, "message": "has entered the game" }, to=room)
    rooms[room]["members"] += 1 #incrementing the members in a room after a player has successfully joined
    print(f"{name} joined room {room}")

@sio.on("disconnect")
def disconnect():
    #is its multiplayer leave the room and remove the room if no player  is present in it
    if request.sid not in singleplayers:
        print("desiconnected")
        room = session.get("room")
        name = session.get("name")
        print("room to be left: " + room)
        leave_room(room)
        
        
        #if room is empty distroy it
        if room in rooms:
            print("room exists")
            rooms[room]["members"] -= 1
            if rooms[room]["members"] <=0:
                print("room deleted:" + room)
                del rooms[room]

        #send({"name": name, "message": "has entered the game" }, to=room)
        print(f"{name} has left the room {room}")
    #if single player, just remove the sid from the singleplayer list
    else:
        print("desiconnected singleplayer")
        singleplayers.remove(request.sid)

@sio.on('gameinfo_message')
def handle_message(message):
    # Process the received message on the server-side if needed
    # In this example, we just broadcast the message back to all clients
    message = request.sid
    emit('receive_message', message, to=message)

@sio.on("ready")
def ready(convertedMatrix):
    handle_ready(request.sid,convertedMatrix)   

@sio.on('fire')
def fire(hitcell):
    print("HITCELL ID:" + request.sid + "HITCELL: " + str(hitcell))
    handle_fire(request.sid,hitcell)




if __name__ == "__main__":
    sio.run(app, debug = True)