//-----------------------------VARS/CONSTS------------------------------//

const bonbons = document.querySelectorAll(".bonbon");

let gameStages = [];
const statusText = document.getElementById("status-text");

let highScore = 0;
const highScoreText = document.getElementById("highScore-text");
highScoreText.textContent=(`${highScore}`);


//-----------------------------FUNCTIONS------------------------------//


//pause function to stop the program for x milliseconds
function pause(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

//the function that will be used to play the bonbon
function playBonbon(element){
    //goes through the list of bonbons and finds the correct one given what was clicked
    for(i=0; i<bonbons.length; i++){
        
        if(element.id == `bonbon-${i}`){
            element.classList.toggle("idle");
            element.classList.toggle("playing");

            element.src = `bonbon_assets/bonbon-${i}-play.GIF`;
            const audio = new Audio(`sounds/${i}.mp3`);
            audio.play();

            setTimeout(() => {
                element.classList.toggle("idle");
                element.classList.toggle("playing");    
            }, 1000);
        }
    }

    
    
}

function bonbonsUnavailabe(trueOrFalse){
    
    if(trueOrFalse == true){
        bonbons.forEach(bonbon => {
            bonbon.classList.add("unavailable");
        });
    } else {
        bonbons.forEach(bonbon => {
            bonbon.classList.remove("unavailable");
        });
    }

}

//changes the inner text of any element
function changeInnerText(textContainer, desiredText){
    textContainer.textContent = desiredText; 
}

//adds a step to the current pattern
function addGameStage(bonbons,gameStages){
    let bonbonPicked = (Math.floor(Math.random()*(bonbons.length-1-0+1))+0);

        //add current bonbon stage to the game array
        gameStages.push(bonbonPicked);
}

//function that plays through the current steps
async function playThroughGameStages(gameStages,bonbons, statusText){

    bonbonsUnavailabe(true);

    changeInnerText(statusText,"pay attention!");

    for (let i = 0; i < gameStages.length; i++) {
        playBonbon(bonbons[gameStages[i]]);
        await pause(1000);
    }

    bonbonsUnavailabe(false);
}

//returns a promise that's 1 of 3 options
function waitForClick(bonbons) {
    return new Promise(resolve => {
        bonbons[0].addEventListener("click", () => {
            resolve(event.target.getAttribute("order"));
        });

        bonbons[1].addEventListener("click", () => {
            resolve(event.target.getAttribute("order"));
        });

        bonbons[2].addEventListener("click", () => {
            resolve(event.target.getAttribute("order"));
        });
    });

    
}

//an async function that waits for the user to pick and returns the result
async function userTurn(bonbons) {
    userChoice = await waitForClick(bonbons).then(result=>{
        return result;
    });

    return userChoice;
}

//--------------SETTING UP THE PAGE--------------//
//adds clickable options for bonbons
for(let i=0; i<bonbons.length;i++){
    

    bonbons[i].addEventListener("click", (event)=>{
        playBonbon(event.target);
    });

}
bonbonsUnavailabe(true);

//play the game function
async function playGame(bonbons, gameStages, statusText, highScore, highScoreText){
    
    //resets the game
    userLoss = false;
    gameStages = [];

    changeInnerText(statusText,"ready?");
    
    //while the user hasn't lost yet
    while(userLoss==false){
        //add a step!
        addGameStage(bonbons, gameStages);
                
        //changeInnerText(statusText,"pay attention!");

        
        //showcases the user the pattern they need to follow
    await playThroughGameStages(gameStages,bonbons, statusText);

       

        
        
        
        for(index=0; index<gameStages.length; index++){
           changeInnerText(statusText,"your turn!");

            userChoice = await (userTurn(bonbons)).then(result=>{
                
                console.log(result);
                return result;
            });
            
            console.log("the game stage is: " + gameStages[index] + " and the choice is: " + userChoice);
            //if the user gets the current step correct keep going
            if(userChoice == gameStages[index]){
                continue;
            //if they fail break out of the loop
            } else {
                changeInnerText(statusText,"you lose!");
                userLoss = true;
                await pause(1000);
                break;
            }    
        } 
        if(userLoss != true){
            changeInnerText(statusText,"good job!");
            await pause(1000);

            if(highScore <= gameStages.length){
                highScore = gameStages.length;
                changeInnerText(highScoreText,`${highScore}`);
            }
            
        } else{
            changeInnerText(statusText,"press the play button to try again!");
            bonbonsUnavailabe(true);
            await pause(1000);
        }


        

        
   } 
    
}





