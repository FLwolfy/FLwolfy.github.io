"use strict";

const canvasEl = document.querySelector(".fireworks");
if (!canvasEl) {
  throw new Error("Canvas element .fireworks not found");
}

const ctx = canvasEl.getContext("2d");
const numberOfParticules = 30;
let pointerX = 0;
let pointerY = 0;
const tap = "mousedown";
const colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"];

function updateCoords(e) {
  pointerX = (e.clientX || e.touches[0].clientX) - canvasEl.getBoundingClientRect().left;
  pointerY = (e.clientY || e.touches[0].clientY) - canvasEl.getBoundingClientRect().top;
}

function setParticuleDirection(p) {
  const angle = anime.random(0, 360) * Math.PI / 180;
  const distance = anime.random(50 / 3, 180 / 3); // 半径缩小为1/3
  const direction = [-1, 1][anime.random(0, 1)] * distance;
  return {
    x: p.x + direction * Math.cos(angle),
    y: p.y + direction * Math.sin(angle)
  };
}

function createParticule(x, y) {
  const p = {};
  p.x = x;
  p.y = y;
  p.color = colors[anime.random(0, colors.length - 1)];
  p.radius = anime.random(16 / 3, 32 / 3); // 半径缩小为1/3
  p.alpha = 0.5; // 半透明
  p.draw = function () {
    ctx.beginPath();
    ctx.globalAlpha = p.alpha;
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  };
  p.endPos = setParticuleDirection(p);
  return p;
}

function createCircle(x, y) {
  const p = {};
  p.x = x;
  p.y = y;
  p.color = "#F00";
  p.radius = 0.1 / 3; // 缩小为1/3
  p.alpha = 0.5; // 半透明
  p.lineWidth = 6 / 3; // 线宽缩小为1/3
  p.draw = function () {
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.lineWidth = p.lineWidth;
    ctx.strokeStyle = p.color;
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  return p;
}

function renderParticule(anim) {
  for (let i = 0; i < anim.animatables.length; i++) {
    anim.animatables[i].target.draw();
  }
}

function animateParticules(x, y) {
  const circle = createCircle(x, y);
  const particules = [];

  for (let i = 0; i < numberOfParticules; i++) {
    particules.push(createParticule(x, y));
  }

  anime.timeline()
    .add({
      targets: particules,
      x: function (p) { return p.endPos.x; },
      y: function (p) { return p.endPos.y; },
      radius: 0.1 / 3, // 缩小为1/3
      duration: anime.random(1200, 1800),
      easing: "easeOutExpo",
      update: renderParticule
    })
    .add({
      targets: circle,
      radius: anime.random(40 / 3, 80 / 3), // 缩小为1/3
      lineWidth: 0,
      alpha: {
        value: 0,
        easing: "linear",
        duration: anime.random(600, 800)
      },
      duration: anime.random(1200, 1800),
      easing: "easeOutExpo",
      update: renderParticule,
      offset: 0
    });
}

function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

const setCanvasSize = debounce(() => {
  canvasEl.width = 2 * window.innerWidth;
  canvasEl.height = 2 * window.innerHeight;
  canvasEl.style.width = window.innerWidth + "px";
  canvasEl.style.height = window.innerHeight + "px";
  ctx.scale(2, 2);
}, 500);

const render = anime({
  duration: Infinity,
  update: function () {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  }
});

document.addEventListener(tap, function (e) {
  if (
    e.target.id !== "sidebar" &&
    e.target.id !== "toggle-sidebar" &&
    e.target.nodeName !== "A" &&
    e.target.nodeName !== "IMG"
  ) {
    render.play();
    updateCoords(e);
    animateParticules(pointerX, pointerY);
  }
}, false);

setCanvasSize();
window.addEventListener("resize", setCanvasSize, false);
