export const canvas = document.getElementById(
  "gameCanvas"
) as HTMLCanvasElement;
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants/constants";
import bgImg from "../assets/images/bluemoon.png";
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.backgroundImage = `url("${bgImg}")`;
canvas.style.backgroundPosition = `center`;
canvas.style.backgroundSize = `cover`;
export const ctx = canvas.getContext("2d")!;
