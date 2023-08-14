var Vertical;
var dragging;
var firstTime
removedShips = []
var Randomized = false
var Ready = false //set to true when all the ships have been placed
var Joined = false //if other player has joined you can push the ready button if not, you have to wait  for the player to join
var Startgame = false //set to true when both sides have  hit their ready botton
var Mute = false
var Singleplayer
//////////////////////////////////////// Matrix
// if(m.singleplayer == true){
//     console.log(m.het)
// }

var queryParams = new URLSearchParams(window.location.search);
        
// Get the value of the 'singlePlayer' parameter
var singlePlayerValue = queryParams.get("single");
console.log(singlePlayerValue)
if (singlePlayerValue === "1") {
    Singleplayer = true
    console.log("Single true")
} else {
    Singleplayer = false
    console.log("Single false")
    
}
matrix = []

class Block{
    constructor(filled,type,hit){
        this.filled = filled
        this.type = type
        this.hit = hit
    }
}


for (let i = 0; i < 100; i++) {
    const block = new Block(false, null, false); // Provide initial values for filled, type, and hit
    matrix.push(block);
  }

//////////////////////////////////////// Ships
  

class Ship{
    constructor(name,size,color){
        this.name = name;
        this.size = size;
        this.color = color
    }
}

const carrier = new Ship('Carrier',5,'Grey')
const battleship = new Ship('Battleship',4, 'Yellow')
const submarine = new Ship('Submarine',3, 'Red')
const destroyer = new Ship('Destroyer',3, 'Brown')
const cruiser = new Ship('Cruiser',2, 'Green')

const ships = [carrier,battleship,submarine,destroyer,cruiser]
var dropped //whether the ship was dropped successfully on the board


//////////////////////////////////////// Functions

function gameInit(){
    console.log("salam");
    generateGrid("Enemy");
    generateGrid("Player");

    Vertical = false;
    addEventListener()
}


function generateGrid(side){
    
    id = side+"Grid";
    const board = document.getElementById(id);
    for(x=0; x< 100; x++){
        const cell = document.createElement("div");
        cell.classList.add('cell')
        cell.id = x + side;
        board.appendChild(cell);
        if(side == "Player"){
            //cell.addEventListener('click', gridEventListener);
            cell.addEventListener('dragover', dragOver);
            cell.addEventListener('drop', drop);
        }else{
            cell.addEventListener('click', fire)

        }
        
    }
}

function gridEventListener(event) {
    console.log((event.targetElement || event.srcElement).id);
}

function addEventListener(){
    const fleetpos = document.getElementById("position-B")
    fleetpos.addEventListener('click', changeFleetPosition);

    const randFleet = document.getElementById("randomize-b");
    randFleet.addEventListener('click', randomizeFleet)

    const readyB = document.getElementById("ready-b")
    readyB.addEventListener('click', readyToPlay)

    const muteB = document.getElementById("mute-b")
    muteB.addEventListener('click', mute)
    //event listener for ships
    const ship1 = document.getElementsByClassName("Carrier")[0]
    ship1.addEventListener('dragstart', dragStart)

    const ship2 = document.getElementsByClassName("Battleship")[0]
    ship2.addEventListener('dragstart', dragStart)

    const ship3 = document.getElementsByClassName("Submarine")[0]
    ship3.addEventListener('dragstart', dragStart)

    const ship4 = document.getElementsByClassName("Destroyer")[0]
    ship4.addEventListener('dragstart', dragStart)
    

    const ship5 = document.getElementsByClassName("Cruiser")[0]
    ship5.addEventListener('dragstart', dragStart)

    //event listener to player`s board
    const cells = document.querySelectorAll('#PlayerGrid div')
    cells.forEach(cell=>{
        cell.addEventListener('dragover',dragOver)
        cell.addEventListener('drop', drop)
    })

}

function randomizeFleet(){
    if(!Randomized){
        ships.forEach(ship => addShip(true,ship))
    
        ships.forEach((ship) => {
            element = document.getElementsByClassName(ship.name)[0]
            element.remove()
        });

        Randomized = true //when randomized once the botton cant be hit again and the ship placments will remain the same
        Ready = true //when randomized ready is set to true since all the ships are placed

        
    }
}


function dragStart(e){
    dragging = e.target
    dropped = true
    console.log("started dragging")
}


function dragOver(e){
    e.preventDefault();
}


function drop(e){
    const startCell = parseInt(e.target.id) //getting the cell id that the ship is being dropped
    //figuring out which ship is being dropped at that cell
    var ship 
    let found = false
    for(x =0;x<ships.length;x++){
        
        if(dragging.classList.contains(ships[x].name)){
            ship = ships[x]
            //console.log(ship.name)
            found = true
            break
        }
    }

    //prevent the sip that was already drropped change position again
    if(removedShips.includes(ship.name)){
        console.log("cough")
        found = false
    }

    //checks
    if(!found){
        console.log("ERROR: ship was not found")
    }else{
        addShip(false,ship, startCell)
        //if dropped successfully then remove the ship
        if(dropped){
            removedShips.push(ship.name) //add the name of the ship to the removed ship so that "changeFleetPosition doesnt include it when switching from vertical to horizontal
            dragging.remove()
            Randomized = true // set Randomized to true to disable the randomized button after the first ship had been dropped
            if(removedShips.length == 5){
                Ready = true
            }
        }
    }
}

//chenging the fleet position from vertical to horizontal
function changeFleetPosition(e){
    var button = document.getElementById("position-B")
    const container = document.getElementsByClassName('Ships')[0]

    shipArray = []

    //getting all the ships that have not been removed (dropped) yet
    for(let x = 0;x<ships.length;x++){
        let ship =  document.getElementsByClassName(ships[x].name)[0]
        if(!removedShips.includes(ships[x].name)){
            shipArray.push(ship)
        }
        
    }
    
    if(Vertical){
        Vertical = false;
        button.innerText = "Vertical";
        container.style.removeProperty('display')
        
    }else{
        Vertical = true;
        button.innerText="Horizontal";
        container.style.display = 'flex';

    }

    shipArray.forEach((ship) => {
        changeShipPos(ship);
      });

}


function changeShipPos(target){
    const computedStyles = window.getComputedStyle(target);
    const heightValue = computedStyles.getPropertyValue("height");
    const widthValue = computedStyles.getPropertyValue("width");
    target.style.height = widthValue;
    target.style.width = heightValue;
}
 
function addShip(rand,ship,startCell){
    //selecting all the cells
    const cells = document.querySelectorAll('#PlayerGrid div')
    if (rand) {
        let randIndex = Math.floor(Math.random() * 100) //randdom number [0,100)
        let randPos = Math.random() < 0.5 //randomize the position of the ship
        Vertical = randPos
        startIndex = randIndex
    } else{
        startIndex = startCell
    }

    ///////////
    if(Vertical){
        // console.log("vertical")
        if((109 - (10 * ship.size)) < startIndex){
            startIndex = startIndex - ship.size * 10 + 10
        }
    }else{ 
        // console.log("horizontal")
        if((100-ship.size) < startIndex){
            startIndex =  100 - ship.size 
        }
    }

    shipCells = []
    
    for(let x = 0;x<ship.size;x++){
        if(Vertical){
            shipCells.push(cells[Number(startIndex) + x * 10])
        }else{
            shipCells.push(cells[Number(startIndex)+x])
        }
    }
    //console.log(shipCells)

    
    //preventing ships to extend horizontally
    var valid = true
    
    if(!Vertical){
        let index = parseInt(startIndex/10) * 10
        // console.log("index: " + index)
        // console.log("RRRRRRRR INDEX: " + randIndex)
        if((index + (10 - ship.size)) < startIndex){
            valid = false
            //console.log("its false")
        }
    }

    const notFilled = shipCells.every(shipCell => !shipCell.classList.contains('filled'))

    if(valid && notFilled){
        shipCells.forEach(shipCell=>{
            shipCell.classList.add(ship.color)
            shipCell.classList.add('filled')
          })
          addToMatrix(shipCells, ship)
          //console.log("ShipCells: "+shipCells)
    }else{
        if(rand){
            addShip(true,ship)
        }else{
            dropped = false
        }
    }

}

function addToMatrix(shipCells, ship){
    for(x = 0;x<shipCells.length;x++){
        matrix[parseInt(shipCells[x].id)].filled = true
        matrix[parseInt(shipCells[x].id)].type = ship
            
    }

    //print the matrix filled cells
    for(y = 0;y<matrix.length;y++){
        if(matrix[y].filled){
            console.log(y)
        }
    }
        
}

function mute(){
    var element = document.getElementById("mute-b")
    if(Mute){
        element.style.backgroundImage = "url(../static/mute.jpg)"
        element.style.backgroundSize = "cover"
        element.style.backgroundRepeat = "no-repeat"
    }else{
        element.style.backgroundImage = "url(../static/unmute.png)"
        element.style.backgroundSize = "cover"
        element.style.backgroundRepeat = "no-repeat"
    }
    Mute = !Mute
}
////////singleplayer


//////////////////////////////////////// Socketio



function readyToPlay(){
    //if ships were placed and other player has joined
    
    
    if(Ready  && Joined){
        
        element = document.getElementById('ready-b')
        element.style.backgroundColor = 'green'
        
        var convertedMatrix = JSON.stringify(matrix)
        socket.emit("ready",convertedMatrix)
    }
    
}

socket.on('damage',data=>{
    
    if(data.side == 'player'){
        console.log("hit-player")
        //playing sound when your ship is hit
        if(!Mute){
            audio = new Audio("../static/hit-player.mp3")
            audio.play()
        }
        

        //adding fire to the cell that was hit
        elementId = data.hitcell + 'Player'
        element = document.getElementById(elementId)
        element.style.backgroundImage = "url(../static/fire.gif)"
        element.style.backgroundSize = "cover"
        element.style.backgroundRepeat = "no-repeat"
        
    }else if(data.side == 'enemy'){
        console.log("hit-enemy")

        //playing sound when you him enemy`s ship
        if(!Mute){
            audio = new Audio("../static/hit-enemy.mp3")
            audio.play()
        }
        
        //if the ship is fully drown, color the corresponding cell on the enemy board
        if(data.array !==null && data.enemyShipColor !== null){
            data.array.forEach((cell)=>{
                elementId = cell + 'Enemy'
                element = document.getElementById(elementId)
                element.classList.add(data.enemyShipColor)
            })
        }
        
        elementId = data.hitcell + 'Enemy'
        element = document.getElementById(elementId)
        element.style.backgroundImage = "url(../static/fire.gif)"
        element.style.backgroundSize = "cover"
        element.style.backgroundRepeat = "no-repeat"
    }
})

socket.on('missed',data=>{

    if(data.side == 'player'){
        elementId = data.hitcell + 'Player'
        element = document.getElementById(elementId)
        console.log(element)
        element.style.backgroundColor = "#68AEB8";
        element.style.borderColor = "#68AEB8"
    }else if(data.side == 'enemy'){
        elementId = data.hitcell + 'Enemy'
        element = document.getElementById(elementId)
        console.log(element)
        element.style.backgroundColor = "#68AEB8";
        element.style.borderColor = "#68AEB8"
    }
    if(!Mute){
        audio = new Audio("../static/missed.mp3")
        audio.play()
    }
    
})



socket.on('gameinfo_message', message => {
    // Update the content of the messageDiv with the received message
    if (message) {
        // Update the content of the messageDiv with the received message
        var messageDiv = document.getElementById('dynamic_info')
        //console.log("this is message: " + message);
        messageDiv.innerHTML = '<p>' + message + '</p>';
    } else {
        // Handle the absence of a message (optional)
        console.log("No message received from the server.");
    }
});

socket.on('joined',data=>{
    Joined = true
});

socket.on('startgame', data=>{
    Startgame = true
});

function fire(e){
    hitcell = parseInt((e.targetElement || e.srcElement).id)
    console.log("hit" + hitcell)
    if(Startgame){
        socket.emit('fire',hitcell)
    }
    //socket.emit('fire',hitcell)
}

socket.on('connect', message => {
    // Update the content of the messageDiv with the received message
    if (message) {
        // Update the content of the messageDiv with the received message
        var messageDiv = document.getElementById("roomID");
        console.log("this is message: " + message);
        messageDiv.innerHTML += '<p>' + message + '</p>';
    } else {
        // Handle the absence of a message (optional)
        console.log("No message received from the server.");
    }
});




//assigns the function gameInit to the onload event of the window object
window.onload = gameInit;



// const socket = io({autoConnect:false})//making the socket object and setting autoConnetcted to false so that it does not connect automatically
// socket.connect()//connecting the client to server manually

