//play_state = 0 = menu
//play_state = 1 = gameplay
//play_state = 2 = win screen
//play_state = 3 = lose screen
let play_state = 0

//player
let playerx = 0
let playery = 0
let player_size = 10
let x_vel = 0
let y_vel = 0
let max_speed = 2

//enemy
let enemyx = 0
let enemyy = 0
let enemy_size = 20
let enemy_max_speed = 1.9
let enemy_x_vel = 0
let enemy_y_vel = 0

//sonar
sonar_size = 500
let sonar_length = 125
let sonar_height = 2
let sonarx = sonar_length/2
let sonary = 0
let sonar_scaling = 2.7
let sonar_rate = 180 //frames
let sonar_fade = 0

//tile images + sound
function preload() {
tile1 = loadImage('tile1.png')
tile2 = loadImage('tile2.png')
tile3 = loadImage('tile3.png')
tile4 = loadImage('tile4.png')
tile_change = loadSound('clink_noise.m4a')
}

//lose screen
let fade_in = 0
let text_size = 50

//menu screen
let play_buttonRGB = [50,60,0]

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  rectMode(CENTER)
  textAlign(CENTER)
  imageMode(CENTER)
}

function draw() {

  correct_tiles = 0

  //main menu
  if (play_state == 0){
    background(10,60,0)
    //title
    strokeWeight(10)
    fill(150,100,0)
    textSize(100)
    text("AREA ZERO",windowWidth/2,300)
    //play button
    stroke(0)
    strokeWeight(5)
    fill(play_buttonRGB)
    rect(windowWidth/2,windowHeight/2,300,100)
    textSize(40)
    text("PLAY",windowWidth/2,windowHeight/2)
    //instructions
    textSize(20)
    fill(150)
    text("Controls: \nmovement: WASD keys. \nChanging the tiles of the puzzle: Press enter while your avatar is on the tile you wish to change. \n\nThere is an invisible entity in these woods. You must use the sonar, displayed in the bottom left corner of your high-tech display, to tell where it is. \nThe sonar updates every time the scan passes the line marked on it. (You should know how your own gadgets work soldier...) \nWhile avoiding the creature, you must also complete the puzzle in the middle of the area. \nTo complete it, you need to match the tiles to the example solution we provided you with, shown on the bottom right of your display. \nThis is a dangerous mission, we sent in many soldiers already just like you who failed us. But hey, you're all expendable. \nHowever, the greater the risk, the greater the reward: \nWe have reason to believe this invisible beast and the puzzle are security measures, protecting highly valuable extraterrestreal technology. \nIf you accomplish in unlocking the puzzle, getting the tech for us, you will be given a hefty percentage of it's value. (0.0001%). \n I hope you're luckier than your late comrades. \nBriefing over. Get going soldier. (press play)",windowWidth/2,windowHeight-400)


    //x and y distances of mouse from play button
    mouse_button_distx = mouseX - windowWidth/2
    mouse_button_disty = mouseY - windowHeight/2
    //making distances only positive
    if (mouse_button_distx < 0){
      mouse_button_distx = mouse_button_distx*-1
    }
    if (mouse_button_disty < 0){
      mouse_button_disty = mouse_button_disty*-1
    }
    //checks if mouse is on button, then if mouse is clicked
    if ((mouse_button_distx<150)&&(mouse_button_disty<50)){
      play_buttonRGB = [70,100,0]
      if (mouseIsPressed) {
        //setting game values to start
        playerx = random(0,windowWidth/4)
        playery = random(0,windowHeight-300)
        enemyx = random(windowWidth*3/4,windowWidth)
        enemyy = random(0,windowHeight-300)
        x_vel = 0
        y_vel = 0
        enemy_x_vel = 0
        enemy_y_vel = 0
        sonar_fade = 0
        fade_in = 0
        tile_array = [[600,200],[800,200],[1000,200],[1200,200],[600,400],[800,400],[1000,400],[1200,400]]
        tile_image = [tile1,tile1,tile1,tile1,tile1,tile1,tile1,tile1]
        tile_size = 150
        tile_solution_array = [[windowWidth-250,windowHeight-200],[windowWidth-190,windowHeight-200],[windowWidth-130,windowHeight-200],[windowWidth-70,windowHeight-200],[windowWidth-250,windowHeight-140],[windowWidth-190,windowHeight-140],[windowWidth-130,windowHeight-140],[windowWidth-70,windowHeight-140]]
        tile_solution_image = [random([tile2,tile3,tile4]),random([tile2,tile3,tile4]),random([tile2,tile3,tile4]),random([tile2,tile3,tile4]),random([tile2,tile3,tile4]),random([tile2,tile3,tile4]),random([tile2,tile3,tile4]),random([tile2,tile3,tile4])]
        tile_solution_size = 50

        play_state = 1
      }
    }
    else (play_buttonRGB = [50,60,0])
  }

  //gameplay
  if (play_state == 1){
    background(220)

    //sets speed of rotation (for the sonar display)
    let angle = frameCount

    //used for delaying of the fade in of the win/lose screens
    tick = millis()

    //HUD (bottom part of screen displaying the sonar)
    noStroke()
    fill(50,60,0,200)
    rect(windowWidth/2,windowHeight-150,windowWidth,300)
    fill(60,60,60)
    stroke(0)
    strokeWeight(0.5)
    square(150,windowHeight-150,300)
    fill(10,60,0,100)
    circle(150,windowHeight-150,250)
    //rotation for sonar
    push()
    noStroke()
    translate(150,windowHeight-150)
    push()
    rotate(angle*2)
    for (let i = 0; i < 90; i++) {
      rotate(-0.5)
      fill(10,60,0,200-(i*200/90))
      rect(sonarx,sonary,sonar_length,sonar_height)
    }
    pop()
    //line indicating sonar going off
    fill(10)
    rect(sonarx,sonary,sonar_length,sonar_height)
    pop()
    fill(0,30,0,255)
    noStroke()
    circle(150,windowHeight-150,10)
    
    //detection of enemy when the sonar makes a full rotation
    if (angle % sonar_rate == 0) {
      if ((dist(enemyx,enemyy,playerx,playery) < sonarx + sonar_size/2 + enemy_size/2)) {
        readingx = ((enemyx-playerx)/sonar_scaling)
        readingy = ((enemyy-playery)/sonar_scaling)
        sonar_fade = 200
      }
    }
    //display of detected enemy on sonar
    if (sonar_fade != 0) {
      sonar_fade += -1
      fill(255,0,0,sonar_fade)
      push()
      translate(150,windowHeight-150)
      circle(readingx,readingy,10)
      pop()
    }

    //drawing tile solution in corner of screen
    for (let u = 0; u<8; u++){
      image(tile_solution_image[u],tile_solution_array[u][0],tile_solution_array[u][1],tile_solution_size,tile_solution_size)
    }

    // //enemy
    // noFill()
    // circle(enemyx,enemyy,enemy_size)

    //enemy movement
    enemy_to_player = dist(enemyx,enemyy,playerx,playery)
    enemy_to_player_x = playerx - enemyx
    enemy_to_player_y = playery - enemyy
    //(scales down/up the measurements of x and y distances, to ensure the enemy has a constant max speed, not one that increases with distance from player)
    scaled_speed = enemy_to_player / enemy_max_speed 
    enemy_x_vel += enemy_to_player_x/scaled_speed
    enemy_y_vel += enemy_to_player_y/scaled_speed
    //limit on enemy speed
    if (enemy_x_vel > enemy_max_speed) {
      enemy_x_vel = enemy_max_speed
    }
    if (enemy_x_vel < -enemy_max_speed) {
      enemy_x_vel = -enemy_max_speed
    }
    if (enemy_y_vel > enemy_max_speed) {
      enemy_y_vel = enemy_max_speed
    }
    if (enemy_y_vel < -enemy_max_speed) {
      enemy_y_vel = -enemy_max_speed
    }
    enemyx += enemy_x_vel*0.8
    enemyy += enemy_y_vel*0.8
    
    // player movement
    if (keyIsDown(68) == true){
      x_vel += 0.1
    }
    if (keyIsDown(65) == true){
      x_vel -= 0.1
    }
    if (keyIsDown(87) == true){
      y_vel -= 0.1
    }
    if (keyIsDown(83) == true){
      y_vel += 0.1
    }
    //limit on player speed
    if (x_vel > max_speed) {
      x_vel = max_speed
    }
    if (x_vel < -max_speed) {
      x_vel = -max_speed
    }
    if (y_vel > max_speed) {
      y_vel = max_speed
    }
    if (y_vel < -max_speed) {
      y_vel = -max_speed
    }
    playerx = playerx + x_vel
    playery = playery + y_vel

    //keeps player in screen
    if (playerx < player_size/2) {
      playerx = player_size/2
    }
    if (playery < player_size/2) {
      playery = player_size/2
    }
    if (playerx > windowWidth-player_size/2) {
      playerx = windowWidth-player_size/2
    }
    if (playery > windowHeight-300-player_size/2) {
      playery = windowHeight-300-player_size/2
    }

    //keeps enemy in screen
    if (enemyx < enemy_size/2) {
      enemyx = enemy_size/2
    }
    if (enemyy < enemy_size/2) {
      enemyy = enemy_size/2
    }
    if (enemyx > windowWidth-enemy_size/2) {
      enemyx = windowWidth-enemy_size/2
    }
    if (enemyy > windowHeight-300-enemy_size/2) {
      enemyy = windowHeight-300-enemy_size/2
    }

    //player loses
    if (dist(enemyx,enemyy,playerx,playery)<(player_size+enemy_size)/2) {
      play_state = 3
    }

    //drawing tile in centre of screen
    for (let u = 0; u<8; u++){
      image(tile_image[u],tile_array[u][0],tile_array[u][1],tile_size,tile_size)
    }

    //checks if all tiles match solution so player wins
    for (let i=0; i<8; i++) {
      if (tile_image[i] == tile_solution_image[i]){
        correct_tiles += 1
      }
    }
    //player wins
    if (correct_tiles == 8){
    play_state = 2
    }
    //player
    fill(50,150,20)
    square(playerx, playery, player_size)
  }

  //shows player they win 
  if (play_state == 2) {
    if (fade_in < 255){
      fill(220)
      rect(windowWidth/2,windowHeight/2,600,200)
      fill(0,150,0,fade_in)
      rect(windowWidth/2,windowHeight/2,600,200)
      fill(0,0,0,fade_in)
      textSize(text_size)
      text("YOU DID IT :)",windowWidth/2,(windowHeight/2) + (-20 + (fade_in*0.1)))
        if (tick - millis() < -50) {
          tick = millis()
          fade_in+=10
      }
    }
    //sends player back to menu
    else {
      play_state = 0
    }
  }

  //shows player they lose
  if (play_state == 3) {
    if (fade_in < 255){
      fill(220)
      rect(windowWidth/2,windowHeight/2,600,200)
      fill(150,0,0,fade_in)
      rect(windowWidth/2,windowHeight/2,600,200)
      fill(0,0,0,fade_in)
      textSize(text_size)
      text("GAME OVER :(",windowWidth/2,(windowHeight/2) + (-20 + (fade_in*0.1)))
        if (tick - millis() < -50) {
          tick = millis()
          fade_in+=10
      }
    }
    //sends player back to menu
    else {
      play_state = 0
    }
  }

}

//updating tile when enter is pressed
function keyPressed(){
  for (let i = 0; i<8; i++){
    if ((keyCode==ENTER)&&(dist(playerx,playery,tile_array[i][0],tile_array[i][1])<tile_size/2)){
      tile_change.play()
      if (tile_image[i]==tile4){
        tile_image[i] = tile1
      }
      if (tile_image[i]==tile3){
        tile_image[i] = tile4
      }
      if (tile_image[i]==tile2){
        tile_image[i] = tile3
      }
      if (tile_image[i]==tile1){
        tile_image[i] = tile2
      }
    }
  }
}