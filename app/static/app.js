var Vertical;
var dragging;
var firstTime
removedShips = []
var Randomized = false

//////////////////////////////////////// Matrix
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
        cell.addEventListener('click', gridEventListener);
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('drop', drop);
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

        Randomized = true
    }
}


function dragStart(e){
    dragging = e.target
    dropped = true
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

//assigns the function gameInit to the onload event of the window object
window.onload = gameInit;




