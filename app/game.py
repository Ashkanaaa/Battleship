from flask_socketio import send,emit

import copy, json

data = {}



class Block:
    def __init__(self, filled, type,hit):
        self.filled = filled
        self.type = type
        self.hit = hit
class Ship:
    def __init__(self, name, size, color):
        self.name = name
        self.size = size
        self.color = color

class User:
    def __init__(self, matrix, opponent, fleet, totalcount,ready, turn):
        self.matrix = matrix
        self.opponent = opponent
        self.fleet = fleet
        self.totalcount = totalcount
        self.ready = ready
        self.turn = turn
     
carrier = Ship('Carrier',5,'Grey')
battleship = Ship('Battleship',4, 'Yellow')
submarine = Ship('Submarine',3, 'Red')
destroyer = Ship('Destroyer',3, 'Brown')
cruiser = Ship('Cruiser',2, 'Green')

ships = [carrier,battleship,submarine,destroyer,cruiser]   

def decrementShip(sid,name):
    for ship in data[opponent(sid)].fleet:
        if ship.name == name:
            ship.size -=1
            return ship.size

def opponent(sid):
    return data[sid].opponent

def switchTurns(sid):
    temp = data[sid].turn
    data[sid].turn = data[opponent(sid)].turn
    data[opponent(sid)].turn = temp

def sendMsg(sid,message,broadcast):
    if broadcast:
        emit('gameinfo_message', message, broadcast=True)
    else:
        emit('gameinfo_message', message, to=sid)
#gets called to set up data once the second player has joined the game
def setUpData(sid,rooms,room,name):
    playerID = rooms[room]["ID"] #id of opponent (player that created the room)
    player = User(None, sid, None, 17, False, True)
    enemy = User(None, playerID, None, 17 ,False, False)

    data[playerID] = player
    data[sid] = enemy

    #let the first player know that the second player has joined
    msg = name + ' has joined the game'
    sendMsg(playerID, msg, False)
    #enable clicking on the ready button after both players have joined, effectively submitting their matrix to the server
    emit('joined', 'Joined', to=sid)
    emit('joined', 'Joined', to=playerID)


def handle_ready(sid, convertedMatrix):
    opID = data[sid].opponent # id of opponent
    #matrix = [Block(block['filled'], block['type'], block['hit']) for block in convertedMatrix]
    matrix = json.loads(convertedMatrix)
    print("this is matrix")
    print(matrix)
    data[sid].matrix = matrix
    data[sid].fleet = copy.deepcopy(ships)
    data[sid].ready = True

    if data[opID].ready == False:
        sendMsg(sid,'waiting for opponent to get ready...', False)
    elif data[opID].ready:
        sendMsg(None,'Game Started Good Luck!!!', True)
        #enable clicking on the enemy board by setting the Startgame var in client side to True
        emit('startgame', 'Start', to=sid)
        emit('startgame', 'Start', to=opID)


def missed(sid,hitcell):
    info1 = {
        "hitcell": str(hitcell),
        "side": 'enemy'
    }
    info2 = {
        "hitcell": str(hitcell),
        "side": 'player'
    }
    emit('missed', info1, to=sid)
    emit('missed',info2, to=opponent(sid))
    msg = 'you have missed!'
    sendMsg(sid, msg, False)
    switchTurns(sid)

def getShipCells(sid, name):
    array = []
    for x in range (100):
        if data[opponent(sid)].matrix[x]['type'] is not None and data[opponent(sid)].matrix[x]['type']['name'] == name:
            array.append(str(x))
    return array



def damaged (sid,hitcell):
    data[opponent(sid)].matrix[hitcell]['hit'] = True
    shipsize = decrementShip(sid,data[opponent(sid)].matrix[hitcell]['type']['name'])
    data[opponent(sid)].totalcount -= 1
    info1 = {}
    if shipsize == 0:
        array = getShipCells(sid, data[opponent(sid)].matrix[hitcell]['type']['name'])
        info1 = {
            "hitcell": str(hitcell),
            "side": 'enemy',
            "enemyShipColor": data[opponent(sid)].matrix[hitcell]['type']['color'],
            "array": array
        }
    else:
        info1 = {
            "hitcell": str(hitcell),
            "side": 'enemy',
            "enemyShipColor": None,
            "array": None
        }
    
    
    info2 = {
        "hitcell": str(hitcell),
        "side": 'player'

    }
    emit('damage', info1, to=sid)
    emit('damage',info2, to=opponent(sid))
    #if all opponent`s the ships are drwon
    if data[opponent(sid)].totalcount == 0:
        gameOver(sid)
    #if one opponent`s ship is fully drown    
    elif shipsize == 0:
        msg = 'you have drown enemy`s ' + data[opponent(sid)].matrix[hitcell]['type']['name'] + ' ship'
        sendMsg(sid, msg, False)
        msg2 = 'your ' + data[opponent(sid)].matrix[hitcell]['type']['name'] + ' was drawn'
        sendMsg(opponent(sid), msg2, False)
    elif shipsize > 0:
        msg = 'you have hit enemy`s ship!'
        sendMsg(sid, msg, False)
        msg2 = 'your ' + data[opponent(sid)].matrix[hitcell]['type']['name'] + ' was hit!'
        sendMsg(opponent(sid), msg2, False)

    switchTurns(sid)


def gameOver(sid):
    sendMsg(sid, 'GameOver! Congrats, You have WON!!!', False )    
    sendMsg(opponent(sid), 'GameOver! You have LOST!!!', False )  


def handle_fire(sid,hitcell):
    
    #print(data[opponent(sid)].matrix[hitcell])
    
    if data[sid].turn:
        if data[opponent(sid)].matrix[hitcell]['hit']:
            sendMsg(sid,'This cell was already hit!', False)
        elif data[opponent(sid)].matrix[hitcell]['filled']:
            damaged(sid,hitcell) 
        else:
            missed(sid,hitcell)    
        # elif data[opponent(sid)].matrix[hitcell].filled == False:
        #     missed(sid,hitcell)   
    else:
        sendMsg(sid,'Not your turn yet!',False)    



