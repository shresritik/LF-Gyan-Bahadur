import { ctx } from "../components/canvas";
import { objects, scoreCount } from "../constants/constants";
import { backgroundMovement, detectCollision } from "../utils/utils";
import { Base } from "./Base";
import { Player } from "./Player";
import banana from "../assets/banana.png";
import grape from "../assets/grapes.png";
import { eatingAudio } from "../components/audio";

export class Fruit extends Base {
  tile: number = 0;
  #bananaImage: HTMLImageElement;
  #grapeImage: HTMLImageElement;

  constructor(
    position: { x: number; y: number },
    w: number,
    h: number,
    tile: number
  ) {
    super(position, h, w);
    this.tile = tile;

    this.#bananaImage = new Image();
    this.#bananaImage.src = banana;

    this.#grapeImage = new Image();
    this.#grapeImage.src = grape;
  }
  // if player collides with the fruit increase health and remove the fruit
  #playerCollision(player: Player) {
    if (detectCollision(player, this)) {
      eatingAudio.play();
      if (scoreCount.health < 100) scoreCount.health++;
      objects.fruit = objects.fruit.filter((fruit) => fruit !== this); // Remove the specific fruit
    }
  }
  draw = (player: Player) => {
    let image: HTMLImageElement | undefined;

    if (this.tile === 3) {
      image = this.#bananaImage;
    } else if (this.tile === 2) {
      image = this.#grapeImage;
    }
    if (image)
      ctx.drawImage(image, this.position.x, this.position.y - 10, 40, 50);
    this.#playerCollision(player);
  };

  moveX = (player: Player, deltaTime: number) => {
    backgroundMovement(player, this, deltaTime);
  };
}
