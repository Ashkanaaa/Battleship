from .extentions import sio

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
        

matrix = []

@sio.on("connect")
def handle_connect():
    print("client connected")

@sio.on("ready")
def handle_ready(convertedMatrix):
    matrix = [Block(block['filled'], block['type'], block['hit']) for block in convertedMatrix]
    # matrix = data
    # first_dict = matrix[0]
    # hit_value = first_dict['filled']
    # print(hit_value)
    for x in range(len(matrix)):
        if matrix[x].filled:
            print(x)


@sio.on("hit")
def handle_hit(hitcell):
    print(f"cell number {hitcell} was hit")

