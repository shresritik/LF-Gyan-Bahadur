import { ctx } from "../components/canvas";
import { CANVAS_WIDTH, SPEED, ammoObj, keys } from "../constants/constants";
import { Base } from "./Base";
import { Bullet } from "./Bullet";
import stance from "../assets/stancer2.png";
import run from "../assets/run2.png";
import runLeft from "../assets/run-left.png";
import jump from "../assets/jump.png";

interface IPlayer {
  position: { x: number; y: number };
  h: number;
  w: number;
}

let frameX = 0;
let frameY = 0;
let gameFrame = 0;
const frameInterval = 1000 / 12; // 12 frames per second

export class Player extends Base implements IPlayer {
  stanceFrame: {
    stanceWidth: number;
    stanceHeight: number;
    stanceFrame: number;
  } = {
    stanceWidth: 30,
    stanceHeight: 52,
    stanceFrame: 0,
  };

  runFrame: {
    runWidth: number;
    runHeight: number;
    runnerFrame: number;
  } = {
    runWidth: 46,
    runHeight: 52,
    runnerFrame: 15,
  };

  jumpFrame: {
    jumpWidth: number;
    jumpHeight: number;
    jumpFrame: number;
  } = {
    jumpWidth: 44,
    jumpHeight: 55,
    jumpFrame: 20,
  };

  velocityY = 0;
  gravity = 0.2;
  bulletArray: Bullet[] = [];
  directionRight: boolean = true;
  playerSpeed = 2;
  cooldown = false;

  constructor(position: { x: number; y: number }, h: number, w: number) {
    super({ x: position.x, y: position.y, bulletY: position.y }, h, w);
  }

  draw(deltaTime: number) {
    const image = new Image();
    gameFrame += deltaTime;
    if (gameFrame >= frameInterval) {
      frameX++;
      gameFrame = 0;
    }

    if (keys["d"]) {
      image.src = run;
      if (frameX >= 3) frameX = 0;

      ctx.drawImage(
        image,
        frameX * this.runFrame.runWidth,
        frameY * this.runFrame.runHeight,
        this.runFrame.runWidth,
        this.runFrame.runHeight,
        this.position.x,
        this.position.y - 65,
        100,
        130
      );
    } else if (keys["a"]) {
      image.src = runLeft;
      if (frameX >= 3) frameX = 0;

      ctx.drawImage(
        image,
        frameX * this.runFrame.runWidth,
        frameY * this.runFrame.runHeight,
        this.runFrame.runWidth,
        this.runFrame.runHeight,
        this.position.x,
        this.position.y - 65,
        100,
        130
      );
    } else if (keys["w"]) {
      image.src = jump;
      ctx.drawImage(
        image,
        (frameX + 1) * this.jumpFrame.jumpWidth,
        frameY * this.jumpFrame.jumpHeight,
        this.jumpFrame.jumpWidth,
        this.jumpFrame.jumpHeight,
        this.position.x,
        this.position.y,
        100,
        120
      );
      frameX = 0;
    } else {
      image.src = stance;
      ctx.drawImage(image, this.position.x, this.position.y - 75, 80, 150);
      frameX = 0; // Reset frameX when not running
    }
  }

  moveX(deltaTime: number) {
    const movementSpeed = SPEED * (deltaTime / 16.67);
    if (this.position.x < 300) {
      if (keys["a"]) {
        this.directionRight = false;
        this.position.x -= movementSpeed;
      }

      if (keys["d"]) {
        this.directionRight = true;
        this.position.x += movementSpeed;
      }

      this.checkBoundaryX();
    }

    if (keys["a"]) {
      this.directionRight = false;
    }

    if (keys["d"]) {
      this.directionRight = true;
    }
  }

  moveY(deltaTime: number) {
    this.position.y += this.velocityY * (deltaTime / 16.67);
    this.velocityY += this.gravity * (deltaTime / 16.67);
  }

  checkBoundaryX() {
    if (this.position.x <= 0) {
      this.position.x = 0;
    } else if (this.position.x + this.w >= CANVAS_WIDTH) {
      this.position.x = CANVAS_WIDTH - this.w;
    }
  }

  drawBullet(deltatime: number) {
    const movementSpeed = SPEED * (deltatime / 16.67);
    if (
      this.bulletArray.length < ammoObj.ammo &&
      ammoObj.ammo > 0 &&
      !this.cooldown
    ) {
      this.cooldown = true;
      ammoObj.ammo--; // Decrease ammo count
      const bulletSpeed = this.directionRight ? movementSpeed : -movementSpeed;
      const bullet = new Bullet(
        { x: this.position.x + this.w / 2, y: this.position.y + this.h / 2 },
        10,
        10,
        { x: bulletSpeed }
      );
      this.bulletArray.push(bullet);

      // Set a cooldown period (e.g., 500ms)
      setTimeout(() => {
        this.cooldown = false;
      }, 500);
    }
  }

  updateBullet(deltaTime: number) {
    for (let i = 0; i < this.bulletArray.length; i++) {
      const bullet = this.bulletArray[i];
      bullet.drawBullet(deltaTime);
      bullet.moveBullet(deltaTime);

      if (bullet.position.x <= 0 || bullet.position.x >= CANVAS_WIDTH) {
        this.bulletArray.splice(i, 1);
        i--;
      }
    }
  }
}
