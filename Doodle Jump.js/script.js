document.addEventListener('DOMContentLoaded', () => {
 const grid = document.querySelector('.grid');
 const doodler = document.createElement('div');
 let doodlerLeftSpace = 50;
 let startPoint = 150;
 let doodlerBottomSpace = startPoint;
 let isGameOver = false;
 let platformCount = 5;
 let platforms = [];
 let upTimeId;
 let downTimeId;
 let isJumping = true;
 let isGoingLeft = false;
 let isGoingRight = false;
 let leftTimerId;
 let rightTimerId;
 let score = 0;

 function createDoodler() {
  grid.appendChild(doodler); // append the doodler to the grid
  doodler.classList.add('doodler');
  doodlerLeftSpace = platforms[0].left + 20; // initiate the position of the doodler
  doodler.style.left = doodlerLeftSpace + 'px'; // left position of the doodler
  doodler.style.bottom = doodlerBottomSpace + 'px'; // bottom position of the doodler
 }

 class Platform {
  constructor(newPlatformBottom) { 
   this.bottom = newPlatformBottom; // new position(height) of each platform
   this.left = Math.random() * 315; // random position between 0- 315 (400px width-85px width)
   this.visual = document.createElement('div'); // create the platform div
   
   const visual = this.visual;
   visual.classList.add('platform'); // assign the platform class
   visual.style.left = this.left + 'px'; // assign the left of the platform from 0-315px
   visual.style.bottom = this.bottom + 'px'; // assign the height of each platform 
   grid.appendChild(visual); // append the platform to the grid
  }
 }
 
 
 function createPlatforms() {
  for(let i = 0; i < platformCount; i++) {
   let platformGap = 600 / platformCount; // gap between each platform
   let newPlatformBottom = 100 + i * platformGap; // bottom first platform is 100 pixel height.
   let newPlatform = new Platform(newPlatformBottom); // create new platform with its new bottom position
   platforms.push(newPlatform); // append platform to array
  }
 }

 function movePlatforms() {
  if(doodlerBottomSpace > 200) { //when the doodler moves higher than 200 pixel move platforms down
   platforms.forEach(platform => {
    platform.bottom -= 4; // move the platform down
    let visual = platform.visual;
    visual.style.bottom = platform.bottom + 'px'; // assign the new height to the platform

    if(platform.bottom < 5) { // if the platform reaches the bottom of the grid
     let firstPlatform = platforms[0].visual;
     firstPlatform.classList.remove('platform'); // remove the first platform class
     platforms.shift() // remove first item in array
     score++; // increase the score
     let newPlatform = new Platform(600); // create a new platform at the top of the grid
     platforms.push(newPlatform); // append new platform at the end of the array
    }
   })
  }
 }

 function jump() {
  clearInterval(downTimeId); // clear interval of fall
  isJumping = true;
  upTimeId = setInterval(function() { // setInterval to run function every 30ms
   doodlerBottomSpace += 20; // increase the height of the doodler
   doodler.style.bottom = doodlerBottomSpace + 'px'; // assign new doodler height
   if(doodlerBottomSpace > startPoint + 200) { // limits the jump height to each new starting point
    fall();
   }
  },30)
 }

 function fall() {
   clearInterval(upTimeId); // clear interval of jump 
   isJumping = false;
   downTimeId = setInterval(function() { // setInterval to run function every 20ms
   doodlerBottomSpace -= 5; // decrease the height of the doodler
   doodler.style.bottom = doodlerBottomSpace + 'px'; // assign the new doodler height
   if(doodlerBottomSpace <= 0) {
    gameOver(); // doodler falls out of the screen, game over
   }
   platforms.forEach(platform => {
    if(doodlerBottomSpace >= platform.bottom && // doodler land on top of platform
       doodlerBottomSpace <= platform.bottom + 15 && // doodler land on platform
       (doodlerLeftSpace + 60) >= platform.left && // doodler land on left edge
       doodlerLeftSpace <= (platform.left + 85 + 40) && // doodler land on right edge
       !isJumping) {
        startPoint = doodlerBottomSpace; // reset the start point after landing on each platform
        jump(); // get the doodler to jump
        isJumping = true;
       }
   })
   },20);
 }

 function gameOver() {
  console.log('Game Over');
  isGameOver = true;
  while(grid.firstChild) {
   grid.removeChild(grid.firstChild);
  }
  grid.innerHTML = score; // display the score
  // clear all intervals
  clearInterval(upTimeId);
  clearInterval(downTimeId);
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
 }


 function control(e) { // controls of the game
  if(e.key === 'ArrowLeft') {
   moveLeft();
  } else if(e.key === 'ArrowRight') {
   moveRight();
  } else if(e.key === 'ArrowUp') {
   moveStraight();
  }
 }

 function moveLeft() {
  if(isGoingRight) {
   clearInterval(rightTimerId); // clear the interval of moving right so doodler doesnt move both directions
   isGoingRight = false;
  }
  isGoingLeft = true;
  leftTimerId = setInterval(function() { // setInterval to run function every 20ms
   if(doodlerLeftSpace >=0) { // not hitting the left wall
    doodlerLeftSpace -=5; // move the doodler left
    doodler.style.left = doodlerLeftSpace + 'px'; // assign the new doodler position
   } else {
    moveRight(); // if hitting the left wall then move right
   }
  },20);
 }

  function moveRight() {
   if(isGoingLeft) { 
    clearInterval(leftTimerId); // clear the interval of moving left so doodler doesnt move both directions
    isGoingLeft = false;
   }
  isGoingRight = true;
  rightTimerId = setInterval(function() { // setInterval to run function every 20ms
   if(doodlerLeftSpace <= 340) { // not hitting the right wall
    doodlerLeftSpace +=5; // move the doodler right
    doodler.style.left = doodlerLeftSpace + 'px'; // assign the new doodler position
   } else { 
    moveLeft(); // if hitting the right wall then move left
   }
  },20);
 }

 function moveStraight() {
  isGoingLeft = false;
  isGoingRight = false;
  // clear the interval of moving left and right so doodler doesnt move both directions
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
 }

 // function to start the game
 function start() {
  if(!isGameOver) {
   createPlatforms();
   createDoodler();
   setInterval(movePlatforms,30); // move platforms down  by 4px for 30ms
   jump();
   document.addEventListener('keyup', control);
  }
 }
 start();

});