var Vertical;
var dragging;
var firstTime
removedShips = []



function gameInit(){
    console.log("salam");
    generateGrid("Enemy");
    generateGrid("Player");

    Vertical = false;
    addEventListener()
}


function generateGrid(side){
    if(side == "Player"){
        id = side+"Grid";
        const board = document.getElementById(id);
        for(x=0; x< 100; x++){
            const cell = document.createElement("div");
            cell.classList.add('cell')
            cell.id =x;
            board.appendChild(cell);
            cell.addEventListener('click', e=>gridEventListener(e));
            cell.addEventListener('dragover', dragOver);
            cell.addEventListener('drop', drop);
        }
    }else{
        id = side+"Grid";
        const board = document.getElementById(id);
        for(x=0; x< 100; x++){
            const cell = document.createElement("div");
            cell.classList.add('cell')
            cell.id = x * -1;
            board.appendChild(cell);
            cell.addEventListener('click', e=>gridEventListener(e));
            cell.addEventListener('dragover', dragOver);
            cell.addEventListener('drop', drop);
        }
    }
    
}

function gridEventListener(event) {
    console.log((event.targetElement || event.srcElement).id);
    console.log("KUSE");
}

function addEventListener(){
    const fleetpos = document.getElementsByClassName("Position-B")[0];
    fleetpos.addEventListener('click', changeFleetPosition);

    const randFleet = document.getElementById("randomize-b");
    randFleet.addEventListener('click', function(){
        ships.forEach(ship => addShip(true,ship))
        
    });

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


function dragStart(e){
    dragging = e.target
    dropped = true
}



function dragOver(e){
    e.preventDefault();
    // console.log("asdajshdgajhgdjhasgdjhasgdjhasgdhjagdjsaghjd")
    
    // if(firstTime && Vertical){
    //     console.log("dragging.style.height")
    //     const computedStyles = window.getComputedStyle(dragging);
    //     const heightValue = computedStyles.getPropertyValue("height");
    //     const widthValue = computedStyles.getPropertyValue("width");
    //     dragging.style.height = widthValue;
    //     dragging.style.width = heightValue;
    //     firstTime = false
    // }
    
}

function drop(e){
    const startIndex = e.target.id; //getting the cell id that the ship is being dropped
    //console.log(startId)
    //figuring out which ship is being dropped at that cell
    var ship 
    let found = false
    for(x =0;x<ships.length;x++){
        
        if(dragging.classList.contains(ships[x].name)){
            ship = ships[x]
            console.log(ship.name)
            found = true
            break
        }
    }
    //checks
    if(!found){
        console.log("ERROR: ship was not found")
    }else{
        addShip(false,ship, startIndex)
        //if dropped successfully then remove the ship
        if(dropped){
            removedShips.push(ship.name) //add the name of the ship to the removed ship so that "changeFleetPosition doesnt include it when switching from vertical to horizontal"
            // console.log("removed ships: " + ship.name)
            // console.log(removedShips)
            dragging.remove()
        }
    }
}

function changeFleetPosition(e){
    var pos = document.getElementsByClassName("Position-B")[0];
    const container = document.getElementsByClassName('Ships')[0]

    shipArray = []

    for(let x = 0;x<ships.length;x++){
        let ship =  document.getElementsByClassName(ships[x].name)[0]
        if(!removedShips.includes(ships[x].name)){
            shipArray.push(ship)
        }
        
    }

    // const ship1 = document.getElementsByClassName("Carrier")[0]
    

    // const ship2 = document.getElementsByClassName("Battleship")[0]
    

    // const ship3 = document.getElementsByClassName("Submarine")[0]
    

    // const ship4 = document.getElementsByClassName("Destroyer")[0]
    
    // const ship5 = document.getElementsByClassName("Cruiser")[0]
    
    if(Vertical){
        Vertical = false;
        pos.innerText = "Vertical";
        container.style.removeProperty('display')
        
    }else{
        Vertical = true;
        pos.innerText="Horizontal";
        container.style.display = 'flex';

    }

    shipArray.forEach((ship) => {
        changeShipPos(ship);
      });

}


function changeShipPos(elm){

    const computedStyles = window.getComputedStyle(elm);
    const heightValue = computedStyles.getPropertyValue("height");
    const widthValue = computedStyles.getPropertyValue("width");
    console.log(heightValue)
    elm.style.height = widthValue;
    elm.style.width = heightValue;
    

}
//////////////////////////////////////// Matrix
class Block{
    constructor(filled,type,hit){
        this.filled = filled
        this.type = type
        this.hit = hit
    }
}

matrix = []

for (let i = 0; i < 100; i++) {
    const block = new Block(false, null, false); // Provide initial values for filled, type, and hit
    matrix.push(block);
  }

///////////////////////////////////////////////
  

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
let dropped //whether the ship was dropped successfully on the board
 
function addShip(rand,ship,startIndex){
    const cells = document.querySelectorAll('#PlayerGrid div')
    if (rand) {
        let randIndex = Math.floor(Math.random() * 100) //randdom number [0,100)
        let randPos = Math.random() < 0.5 //randomize the position of the ship
        Vertical = randPos
        //console.log(randIndex)

        //checking the edges
        if(Vertical){
            // console.log("vertical")
            if((109 - (10 * ship.size)) < randIndex){
                randIndex = randIndex - ship.size * 10 + 10
            }
        }else{ 
            // console.log("horizontal")
            if((100-ship.size) < randIndex){
                randIndex =  100 - ship.size 
            }
        }

        shipCells = []
        
        for(let x = 0;x<ship.size;x++){
            if(Vertical){
                shipCells.push(cells[Number(randIndex) + x * 10])
                // matrix[Number(randIndex) + x * 10].filled = true
                // matrix[Number(randIndex) + x * 10].type = ship
            }else{
                shipCells.push(cells[Number(randIndex)+x])
                // matrix[Number(randIndex)+x].filled = true
                // matrix[Number(randIndex)+x].type = ship
                //console.log(shipCells)
            }
        }
        console.log(shipCells)

        
        //preventing ships to extend horizontally
        var valid = true
        
        if(!Vertical){
            let index = parseInt(randIndex/10) * 10
            // console.log("index: " + index)
            // console.log("RRRRRRRR INDEX: " + randIndex)
            if((index + (10 - ship.size)) < randIndex){
                valid = false
                //console.log("its false")
            }
        }
                // if(Vertical){
        //     shipCells.every((index) =>
        //         //console.log("id" + shipCells[0].id)
        //         valid = Number(shipCells[0].id) < 90 + (10 * index + 1)
                
        //         )
        //         console.log("valid:" + valid)
        // }else{
        //     shipCells.every((index)=>
        //     //console.log("id" + shipCells[0].id)
        //         valid = Number(shipCells[0].id) % 10 !== 10 - (shipCells.length - (index + 1))
                
        //         )
        //         console.log("valid:" + valid)
        // }


                                                                                        /////////////////////    
    } else{
        console.log("startIndex: " + startIndex)
        console.log("ship: " + ship.name)

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
                // matrix[Number(randIndex) + x * 10].filled = true
                // matrix[Number(randIndex) + x * 10].type = ship
            }else{
                console.log("here")
                shipCells.push(cells[Number(startIndex)+x])
                // matrix[Number(randIndex)+x].filled = true
                // matrix[Number(randIndex)+x].type = ship
                //console.log(shipCells)
            }
        }
        console.log(shipCells)

        
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
        
        // console.log("RANDOM INDEX: " + randIndex)
        // console.log("NOT VALID")
    }

}

function addToMatrix(shipCells, ship){
        //console.log("HEYYYYYYYYY:" + shipCells[0].id)
        //firstIndex = shipCells[0].id
        //console.log("asfsdhfgadgfajdg"+firstIndex)

        for(x = 0;x<shipCells.length;x++){
            matrix[shipCells[x].id].filled = true
            matrix[shipCells[x].id].type = ship
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




