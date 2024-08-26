import { Recorder, RecorderStatus, Encoders } from "canvas-record";
import createCanvasContext from "canvas-context";
import { AVC } from "media-codecs";
import {p1View, p1ViewCtx} from "./oscview"
import {songLength} from './compiler'

// Setup
const pixelRatio = devicePixelRatio;
const width = 1280;
const height = 720;
//const { context, canvas } = createCanvasContext("2d", {
//  width: width * pixelRatio,
//  height: height * pixelRatio,
//  contextAttributes: { willReadFrequently: true },
//});
//Object.assign(canvas.style, { width: `${width}px`, height: `${height}px` });

const canvas = p1View
const context = p1ViewCtx

const mainElement = document.querySelector("main");
//mainElement.appendChild(canvas);

// Animation
export let canvasRecorder;

function render() {
  const width = canvas.width;
  const height = canvas.height;

  const t = canvasRecorder.frame / canvasRecorder.frameTotal || Number.EPSILON;

//  context.clearRect(0, 0, width, height);
//  context.fillStyle = "red";
//  context.fillRect(0, 0, t * width, height);
}

const tick = async () => {
  render();

  if (canvasRecorder.status !== RecorderStatus.Recording) return;
  await canvasRecorder.step();

  if (canvasRecorder.status !== RecorderStatus.Stopped) {
    requestAnimationFrame(() => tick());
  }
};

export async function renderMp4() {
  canvasRecorder = new Recorder(context, {
    name: "canvas-record-example",
    frameRate: 60,
    duration: songLength / 60,
    encoderOptions: {
      codec: AVC.getCodec({ profile: "Main", level: "5.2" }),
    },
  });
  console.log("Song length: " + canvasRecorder.duration)
  // Start and encode frame 0
  await canvasRecorder.start();
  tick(canvasRecorder)
}

