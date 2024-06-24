import { ctx } from "../components/canvas";
import { gameStatus, quizMap } from "../constants/constants";
import {
  audioOnCanvas,
  backgroundMovement,
  detectCollision,
} from "../utils/utils";
import { Base } from "./Base";
import { Player } from "./Player";
import flagImg from "../assets/flag.png";
import { Quiz } from "./Quiz";
import { flagAudio } from "../components/audio";

let frameX = 0;
let gameFrame = 0;
const frameInterval = 1000 / 6;
export class Flag extends Base {
  quiz: Quiz | null;
  outQuiz: boolean;
  quizTimer: number;
  gameOverTimer: number;
  flagFrame: {
    flagWidth: number;
    flagHeight: number;
    flagFrame: number;
  } = {
    flagWidth: 92,
    flagHeight: 100,
    flagFrame: 100,
  };
  flagImage: HTMLImageElement;

  constructor(position: { x: number; y: number }, h: number, w: number) {
    super(position, h, w);
    this.quiz = null;
    this.outQuiz = false;
    this.quizTimer = 0;
    this.gameOverTimer = 0;
    this.flagImage = new Image();
    this.flagImage.src = flagImg;
  }

  drawFlag(deltaTime: number) {
    audioOnCanvas(flagAudio, this);
    gameFrame += deltaTime;
    if (gameFrame >= frameInterval) {
      frameX++;
      gameFrame = 0;
    }
    if (frameX > 3) frameX = 0;
    ctx.drawImage(
      this.flagImage,
      frameX * this.flagFrame.flagWidth,
      0, // Adjust based on your sprite sheet layout
      this.flagFrame.flagWidth,
      this.flagFrame.flagHeight,
      this.position.x,
      this.position.y - 80,
      100,
      130
    );
  }

  showQuiz(player: Player, deltaTime: number) {
    if (this.outQuiz) {
      this.gameOverTimer += deltaTime;
      if (this.gameOverTimer >= 1500) {
        gameStatus.gameOver = true;
        this.gameOverTimer = 0;
      }
    }

    if (detectCollision(player, this)) {
      if (!gameStatus.isQuiz && !this.outQuiz) {
        gameStatus.isQuiz = true;
        this.quizTimer = Date.now();
        this.gameOverTimer = 0;
      }

      if (
        gameStatus.isQuiz &&
        quizMap.quizMap != null &&
        quizMap.quizMap.correct != null
      ) {
        const currentTime = Date.now();
        if (currentTime - this.quizTimer >= 800) {
          quizMap.quizMap.closeQuiz();
          this.outQuiz = true;
          this.quizTimer = 0;
        }
      }
    }
  }

  moveX = (player: Player, deltaTime: number) => {
    backgroundMovement(player, this, deltaTime);
  };
}
