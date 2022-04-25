var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var die, jump;
var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImage=loadImage("gameOver.png");
  restartImage=loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);

  trex.scale = 0.5;
  
  ground = createSprite(200,height/2,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  gameOver=createSprite(width/2,height/2-50);
  gameOver.addImage("game over",gameOverImage);
  gameOver.visible=false;
  restart=createSprite(width/2,height/2-80);
  restart.addImage(restartImage);
  restart.visible=false;
  gameOver.scale=0.5;
  restart.scale=0.5;
  
  invisibleGround = createSprite(200,height/2,400,10);
  invisibleGround.visible = false;
  
  //criar os Grupos de Obstáculos e Nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  
  score = 0
}

function draw() {
  background(180);
 //exibindo a pontuação
  text("Score: "+ score, 100,height/2-200);
  
  console.log("this is ",gameState)
  
  if(mousePressedOver(restart)){
    reset()
  }
  
  if(gameState === PLAY){
    //mover o chão
    ground.velocityX = -4;
    //pontuação
    score = score + Math.round(frameCount/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla espaço é pressionada
    if(touches.length>0|| keyDown("space")&& trex.y >=height/2-30) {
        trex.velocityY = -13;
        jump.play();
    }
    
    //acrescentar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        die.play();
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     ground.velocityX=0
     trex.velocityY=0
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     gameOver.visible=true;
     restart.visible=true;
     trex.changeAnimation("collided",trex_collided);
   }
  
 
  //impedir que trex caia
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function reset(){
  gameState=PLAY;
  restart.visible=false;
  gameOver.visible=false;
  score=0;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width+30,height/2-15,10,40);
   obstacle.velocityX = -6;
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir dimensão e tempo de vida ao obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = width/2;
   
   //adicionar cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar nuvens
   if (frameCount % 60 === 0) {
     cloud = createSprite(width+30,height/3,40,10);
    cloud.y = Math.round(random(height/3-50,height/3));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir tempo de vida à variável
    cloud.lifetime = width/2;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionar nuvens ao grupo
   cloudsGroup.add(cloud);
    }
}

