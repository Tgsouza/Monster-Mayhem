/*
    Toggle/selected function for click
        -If an hexagon is toggled, others must be deselected. OK
        -If an hexagon is selected, the user deselect if clicked again. OK
    Challenge:
        -Other relevant game mechanics such as:
            -Players Turn
            -Character placement
            -Character movement
*/


//variables

//Name form
const nameForm = document.getElementById("name-form");
//Input field
const inputBox = document.getElementById("name");
//Submit button on name form
const submitBtn = document.getElementById("sbmtBtn");
//Input name label
const inputLabel = document.getElementById("form-name-label");
//Name list Display
const nameListDisplay = document.getElementById("name-list");
//Name reset button
const resetNameBtn = document.getElementById("resetBtn");
//Names display list
let listElements = document.getElementById("name-list");
//Board section
const boardSection = document.getElementById("board-section");
//Query selector for all hexes list
let allHex;
//Query selector for monster selection hexagons 
const monsterHex = document.querySelectorAll(".monster-hexagon");
//Query for the players sides
let Player1SideList = [];
let Player2SideList = [];
let Player3SideList = [];
let Player4SideList = [];

//Query for the players monsters;
let player1MonsterList = [];
let player2MonsterList = [];
let player3MonsterList = [];
let player4MonsterList = [];


let gridSize = 10;
let playerNum = 1;
let playerNames = {};
let playerTurn = 1;
let rowStart = 0;

//monster placement
let monsterSelectedName = "";
let monsterHexSelected = "";
let gameOver = false;

//monster movement

nameForm.addEventListener("submit", (e) =>{
    //Prevent the page from refreshing
    e.preventDefault();
    getName();

})

//Reset button to reset the names and clean the list elements as well as reset player number, player names list, and enable the input box and submit buttons again
resetNameBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    playerNum = 1;
    playerNames = {};
    let itemList = listElements.lastElementChild;
    while(itemList) {
        listElements.removeChild(itemList);
        itemList = listElements.lastElementChild;
    }
    inputBox.disabled = false;
    submitBtn.disabled = false;
    inputLabel.innerHTML = `Player <b style="text-decoration: underline;">| ${playerNum} |</b> Name: `;
})

//function to get the name from input and display on the reserved area
function getName(){
    if(!inputBox.value){
        alert("The name input is blank.")
        return;
    }
    let tempValue = inputBox.value;
    let tempDisplayText = "";
    //Switch condition using the playerNum variable to set the player names
    /*
    Switch case takes the player num value (1 is default value)
    
    */
    switch(playerNum){
        case 1:
            playerNames.one = tempValue;
            tempDisplayText = `Player <b style="text-decoration: underline;">| ${playerNum} |</b>: ${playerNames["one"]}`;
            break;
        case 2:
            playerNames.two = tempValue;
            tempDisplayText = `Player <b style="text-decoration: underline;">| ${playerNum} |</b>: ${playerNames["two"]}`;
            break;
        case 3:
            playerNames.three = tempValue;
            tempDisplayText = `Player <b style="text-decoration: underline;">| ${playerNum} |</b>: ${playerNames["three"]}`;
            break;
        case 4:
            playerNames.four = tempValue;
            tempDisplayText = `Player <b style="text-decoration: underline;">| ${playerNum} |</b>: ${playerNames["four"]}`;
            break;
        default:
            return;
    }
    let newListItem = document.createElement("li");
    newListItem.classList.add("name-list-item");
    newListItem.innerHTML = tempDisplayText;
    nameListDisplay.appendChild(newListItem);

    //Increment player number variable.
    playerNum++;
    //Conditional to check the number of player, being 4 the maximum. Then disables the input and button.
    if(playerNum >= 5){
        inputLabel.innerHTML = "All players are listed";
        inputBox.disabled = true;
        submitBtn.disabled = true;
        startGame();
    }else{
        //Changes the label using the playerNum variable top reflect the right player.
        inputLabel.innerHTML = `Player <b style="text-decoration: underline;">| ${playerNum} |</b> Name: `;
    }

    //Reset the input field.
    inputBox.value = "";
}

function setBoard(){
    for(let row = 0; row < 10; row++){
        const newRow = document.createElement("div");
        newRow.classList.add("row");
        for(let col = 0; col < 10; col++){
            const newHexagon = document.createElement("div");
            newHexagon.classList.add("hexagon");
            //Adds the select hex function to all hexagons
            //newHexagon.addEventListener("click", (e)=>{selectHex(e);});
            newRow.appendChild(newHexagon);
        }
        boardSection.appendChild(newRow);
    }
    //forEach loop to remove the hidden attribute from the monster hexagons and show them when the board is presented.
    monsterHex.forEach((monsterHexagon) =>{
        monsterHexagon.removeAttribute("hidden");
    })
    allHex = document.querySelectorAll(".hexagon");
    setBoardSide();
}

/*Main function of the game
    -Set board function will prepare the board
    -Next steps:
        -Player turns function
            -Players will be diferentiate by hex background color
            -
*/
function startGame(){
    setBoard();
    monsterSelection();
    //Here we are going to add a loop that will control the turns and victory condditions
    activeHex(playerTurn);
}

/*
Function to select the hex.
Passes the parameter e, that will be used to get the target hexagon of the click. 
A document query selector all, to get a list with all hexagons (using .class).
With all hexagons on a list, we can run a forEach loop and check if any hexagon has already been selected
if any has been selected wil be deselected and the newly clicked will be selected.

*/
function selectHex(e){
    let currHex = e.target;
    //allHex = document.querySelectorAll(".hexagon");
    if(monsterSelectedName){
        //New Element containing p html with the monster text.
        monsterElement = document.createElement("p");
        monsterElement.classList.add("selected-monster");
        monsterElement.innerText = monsterSelectedName;

        if(currHex.innerHTML){
            alert(`A ${currHex.innerText} is there !`);
        }else{
            currHex.appendChild(monsterElement);
            currHex.classList.add(`selected${playerTurn}`);
            currHex.addEventListener("click", monsterMovement)
            //Switch statement to add the monsters hex element to the players monster list
            switch(playerTurn){
                case 1:
                    player1MonsterList.push(currHex);
                    Player1SideList.push(currHex);
                    break;
                case 2:
                    player2MonsterList.push(currHex);
                    Player2SideList.push(currHex);
                    break;
                case 3:
                    player3MonsterList.push(currHex);
                    Player3SideList.push(currHex);
                    break;
                case 4:
                    player4MonsterList.push(currHex);
                    Player4SideList.push(currHex);
                    break;
            }
            monsterSelectedName = "";
            monsterHexSelected.classList.remove("selected");
            nextPlayerTurn();
            activeHex(playerTurn);
        }
    }
    //This code was used to test the hexagon selection
    else{
        if(currHex.classList.contains(`selected${playerTurn}`)){
            currHex.classList.remove(`selected${playerTurn}`);
        }else{
            allHex.forEach((hexagon) =>{
                if(hexagon.classList.contains(`selected${playerTurn}`)){
                   hexagon.classList.remove(`selected${playerTurn}`); 
                }else{
                    currHex.classList.add(`selected${playerTurn}`); 
                }
            })
        }
    }

    
    //nextPlayerTurn(); This will be controlled on the loop inside the Startgame function
}


//This function will handle the monster movement.
function monsterMovement(e){
    currHex = e.target;
    if(player1MonsterList.includes(currHex) && playerTurn == 1){
        console.log("Ta aqui");
    }else if(player2MonsterList.includes(currHex) && playerTurn == 2){
        console.log("Ta aqui 2");
    }else if(player3MonsterList.includes(currHex) && playerTurn == 3){
        console.log("Ta aqui 3");
    }else if(player4MonsterList.includes(currHex) && playerTurn == 4){
        console.log("Ta aqui 4");
    }

    
}

/*
Set the next player turn
*/
function nextPlayerTurn(){
    if(playerTurn == 4){
        playerTurn = 1;
    }else{
        playerTurn++;
    }

}


/*
User monster Selection:
    -Store the value of the three hexagons with the monster types
    -Event listener to collect the innerHTML/InnerText from the Hexagon clicked.
        -The value to be stored on a variable. OK
        -If the value is stored on a variable I need to change the behavior of the selectHex() function to represent the state of holding the monster selected. OK
        -If the user clicks on the monster hexagon again, he deselect the monster. OK
            -Reset the variable of "holding a monster" to empty. OK
        -If the user clicks on a hexagon on the board, the monster is put on that hexagon, then the variable "holding the monster" is reset. OK
        
        Additional:
            -The user can only put one monster at a time.
            -The user has a select side on the board to put the monster. (This will require a new set of instructions on the setBoard() function to define which side of the board the player controls.)
            -Once the user put the monster his turn is done for now and the next user plays. (This is temporary)
*/

//Function for the monster selection. This function will be used to control when and which player is selecting the monster.
function monsterSelection(){
    monsterHex.forEach((monster) =>{
        monster.addEventListener("click", (e) =>{
            curMonster = e.target;
            if(monsterSelectedName == curMonster.innerText){
                 monsterSelectedName = "";
            }else{
                monsterSelectedName = curMonster.innerText;
            }
            if(monster.classList.contains("selected")){
                monster.classList.remove("selected");
            }else{
                //There is a bug here, for some reason the last element doesn't add the class
                monsterHex.forEach((hex) =>{
                    if(hex.classList.contains("selected")){
                        hex.classList.remove(`selected`); 
                     }else{
                        monster.classList.add(`selected`);
                        monsterHexSelected = monster;
                    }
                })
            }
        })
    })
}

/*
Define which nodes belongs to each player.
    -Player one can put monsters only on the nodes on the first row.
        - For this I can add a class first-row for the divs on the first row.
    -Player two can put monsters only on the first column.
        - For this I can add a class first-column for the first child divs on each row.
    -Player three can put monsters only on the last row.
        - For this I can add a class last-row on the divs on the last row.
    -Player four can put monsters only on the last column.
        -For this I can add a class last-column on the for the last child divs on each row.

    Add-on:
        -The loops now also adds the hex elements to their respective player lists (This will allow me to manipulate the hexagons that are available for the player, maybe even help me with movement of monsters in the future.)
*/
function setBoardSide(){
    //Sets the starting position for player 1
    for(rowStart = 0; rowStart < gridSize; rowStart++){
        allHex[rowStart].classList.add("player-1-side");
        Player1SideList.push(allHex[rowStart]);
    }
    //Set the starting position for player 2
    for(rowStart = 0; rowStart < gridSize * gridSize; rowStart += gridSize){
        if(allHex[rowStart].classList.contains("player-1-side")){
            allHex[rowStart].classList.remove("player-1-side");
            allHex[rowStart].classList.add("player-1-2-side");
        }else{
            allHex[rowStart].classList.add("player-2-side");
        }
        Player2SideList.push(allHex[rowStart]);
    }
    //set the starting position for player 3
    for(rowStart = gridSize-1; rowStart < gridSize * gridSize; rowStart += gridSize){
        if(allHex[rowStart].classList.contains("player-1-side")){
            allHex[rowStart].classList.remove("player-1-side");
            allHex[rowStart].classList.add("player-1-3-side");
        }else{
            allHex[rowStart].classList.add("player-3-side");
        }
        Player3SideList.push(allHex[rowStart]);
    }
    //Set the starting position for player 4
    for(rowStart = gridSize*9; rowStart < gridSize * gridSize; rowStart++){
        if(allHex[rowStart].classList.contains("player-2-side")){
            allHex[rowStart].classList.remove("player-2-side");
            allHex[rowStart].classList.add("player-2-4-side");
        }else if(allHex[rowStart].classList.contains("player-3-side")){
            allHex[rowStart].classList.remove("player-3-side");
            allHex[rowStart].classList.add("player-3-4-side");
        }else{
            allHex[rowStart].classList.add("player-4-side");
        }
        Player4SideList.push(allHex[rowStart]);
    }
}

/*
Based on the player turn activate functionalities.
    -Activate the available hexagons for the player
    -Deactivate (if needed, the other hexagons)
    !!!CURRENTLY WORKING ON THIS!!!
*/
function activeHex(turn){
    switch(turn){
        case 1:
            Player1SideList.forEach((hex) =>{
                hex.addEventListener("click", selectHex);
            })
            Player4SideList.forEach((hex) =>{
                hex.removeEventListener("click", selectHex);
            })
            break;
        case 2:
            Player2SideList.forEach((hex) =>{
                hex.addEventListener("click", selectHex)
            })
            Player1SideList.forEach((hex) =>{
                hex.removeEventListener("click", selectHex);
            })
            break;
        case 3:
            Player3SideList.forEach((hex) =>{
                hex.addEventListener("click", selectHex)
            })
            Player2SideList.forEach((hex) =>{
                hex.removeEventListener("click", selectHex);
            })
            break;
        case 4:
            Player4SideList.forEach((hex) =>{
                hex.addEventListener("click", selectHex)
            })
            Player3SideList.forEach((hex) =>{
                hex.removeEventListener("click", selectHex);
            })
            break;
        default:
            console.log("It shouldn't get to 5.")
            playerTurn = 1;
            break;

    }

    // if(currHex.classList.contains(`selected${playerTurn}`)){
    //     currHex.classList.remove(`selected${playerTurn}`);
    // }else{
    //     allHex.forEach((hexagon) =>{
    //         if(hexagon.classList.contains(`selected${playerTurn}`)){
    //             hexagon.classList.remove(`selected${playerTurn}`); 
    //         }else{
    //             currHex.classList.add(`selected${playerTurn}`);
    //         }
    //     })
    // }
}


/*
Testing the implementation from this https://stackoverflow.com/questions/20075234/is-it-possible-to-append-an-element-to-a-javascript-nodelist
In order to manipulate the functionalities on the hexagons It will be good to learn how to manipulate the array of elements that I'm getting with the querySelectorAll classes:
    -The NodeList generated seems to be read only, which means I can't manipulate.
    -I need to manipulate the array, the reason is I have (player-1-side, player-1-2-side...) and I need a list to contain all possibilities for movement of player-1.
    -Since I can't manipulate the nodelist I can't joing the elements using different classes (?Maybe JSON help with this?)
    -From the stackoverflow website it seems that a workaround what I want to do is to create an array "manually" and push the elements from the nodelist into this array.
*/
//The code worked, so I'm adding this code to the setBoardSide() function.
// function playerSideList(){
//     let player1Side = document.querySelectorAll(".player-1-side");
//     Player1SideList = [];
//     player1Side.forEach((hex) =>{
//         Player1SideList.push(hex);
//     })
//     player1Side = document.querySelector(".player-1-3-side");
//     Player1SideList.push(player1Side);
//     player1Side = document.querySelector(".player-1-2-side");
//     Player1SideList.push(player1Side);
//     console.log(Player1SideList);
// }

//Start the game, this function will be used 
startGame();
