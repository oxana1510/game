"use strict";
window.onload = function () {
  let container = document.querySelector(".container");
  let start = document.getElementById("start");
  let audioShot = new Audio("audio/balloon-pop_gj9b1hed.mp3");
  let scoreBlock = document.getElementById("scoreBlock");
  let pause = document.getElementById("pause");
  let continueBtn = document.getElementById("continue-game");

  let score = 0;

  if (localStorage.getItem("score")) {
    score = Number(localStorage.getItem("score"));

    if ((start.style.display = "block")) {
      continueBtn.style.display = "block";
    }
  }

  let setInterv = 0;

  start.addEventListener("click", startGame, false);
  continueBtn.addEventListener("click", continueGame, false);

  container.classList.add("fixed-bg");

  let containerWidth = container.offsetWidth;

  function getRandomValue(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let svgWidth = 287;
  let svgHeight = 333;

  let sec = 1500;

  let color = [
    "#44E3D0",
    "#3CF075",
    "#FAEA41",
    "#BC3CF0",
    "#F0513C",
    "#FA9E40",
    "#693BF0",
  ];

  function item() {
    let randomPosY = getRandomValue(0, containerWidth);

    let newitems = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    newitems.setAttribute("width", svgWidth);
    newitems.setAttribute("height", svgHeight);
    newitems.setAttribute("viewBox", "0 0 287 333");
    newitems.setAttribute("fill", color[getRandomValue(0, color.length - 1)]);

    newitems.setAttribute("class", "ballon");
    let ellipse = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "ellipse"
    );
    ellipse.setAttribute("cx", "143.5");
    ellipse.setAttribute("cy", "136.5");
    ellipse.setAttribute("rx", "143.5");
    ellipse.setAttribute("ry", "136.5");

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M143 265L173.311 316H112.689L143 265Z");
    newitems.appendChild(ellipse);
    newitems.appendChild(path);
    container.appendChild(newitems);

    newitems.style.width = getRandomValue(7, 10) + "vw";

    let itemEl = {
      posX: (-parseInt(newitems.style.width) * 2) / 100,
      posY: (randomPosY / 100) * 10,
      speedX: 1,
      update: function () {
        newitems.style.bottom = this.posX + "px";
        newitems.style.left = this.posY + "%";
      },
    };

    function tick() {
      if (setInterv > 0) {
        itemEl.posX += itemEl.speedX;
        itemEl.update();
      }

      window.requestAnimationFrame(tick, newitems);

      newitems.onclick = function () {
        if (setInterv > 0) {
          newitems.classList.add("fall");
          itemEl.speedX = 0;

          audioShot.play();
          score += 1;
          scoreBlock.innerHTML = `+${score}`;
          localStorage.setItem("score", `+${score}`);

          if (navigator.vibrate) {
            window.navigator.vibrate(200);
          }
        }
      };
    }

    return tick();
  }

  function startGame() {
    container.classList.remove("fixed-bg");
    start.style.display = "none";
    continueBtn.style.display = "none";
    pause.style.display = "block";
    score = 0;
    scoreBlock.innerHTML = 0;

    setInterv = setInterval(item, sec);
  }

  function continueGame() {
    container.classList.remove("fixed-bg");
    start.style.display = "none";
    continueBtn.style.display = "none";
    pause.style.display = "block";

    scoreBlock.innerHTML = localStorage.getItem("score");

    setInterv = setInterval(item, sec);
  }

  function stopGame(event) {
    if (
      event instanceof MouseEvent ||
      (event instanceof KeyboardEvent && event.keyCode === 32)
    ) {
      clearInterval(setInterv);
      if (setInterv == 0) {
        pause.innerHTML = "pause";
        setInterv = setInterval(item, sec);
      } else {
        pause.innerHTML = "play";
        setInterv = 0;
      }
    }
  }

  pause.addEventListener("click", stopGame, false);
  window.addEventListener("keypress", stopGame);

  window.onblur = function () {
    clearInterval(setInterv);
    setInterv = 0;
    pause.innerHTML = "play";
  };
};
