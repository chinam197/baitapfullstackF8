"use strict";

let rootEl = document.querySelector("#root");
import { client } from "./client.js";

const app = {
  render: function () {
    let html = `
    <div class="App">
        <div class="quizizzGame">
          <div
            class="quizizzGame__start h-100"
            style="
              background: url('./background/download.jpg')
                center center / contain no-repeat fixed;">

            <div class="d-flex justify-content-center align-items-center w-100 h-100 overlay">
              <button class="quizizzGame__start--button">Start</button>
            </div>
          </div>
        </div>
      </div>
    `;
    rootEl.innerHTML = html;
  },

  begin: function () {
    let handleTimeStart = function (e) {
      e.preventDefault();

      document.querySelector(".overlay").innerHTML = `
    
  <div class="quizizzGame__start--countdown w-100 text-center">
 
       <p class="mb-0 animate__animated animate__zoomIn beginGame"></p>
       <audio>
   <source type="audio/mp3" src="./mp3/AiLaTrieuPhu-VA_43vp2.mp3"/>
      </audio>
  </div>
    `;
      let beginGame = document.querySelector(".beginGame");
      let downNumber = 4;
      setInterval(() => {
        if (downNumber >= 0) {
          beginGame.innerText = --downNumber;
          if (downNumber < 0) {
            beginGame.innerText = "Go";
            setTimeout(() => {
              requestAnimationFrame(app.startTime);
              app.getConclusiveAnswer();
            }, 1000);
          }
        }
      }, 1000);

      let audio = document.querySelector("audio");
      audio.play();
    };

    let btnRun = document.querySelector(".quizizzGame__start--button");
    btnRun.addEventListener("click", handleTimeStart);
  },

  getConclusiveAnswer: async () => {
    const { data } = await client.get("/conclusiveAnswer");
    app.variableTime.dataLength = data.length;
    let { Index, dataLength, getIndex, score, streak, True, False } =
      app.variableTime;
    let value = getIndex;
    ++value;
    if (typeof data[getIndex] === "object") {
      const { title, answer1, answer2, answer3, answer4 } = data[getIndex];

      app.renderConclusiveAnswer(
        title,
        answer1,
        answer2,
        answer3,
        answer4,
        streak,
        score,
        value,
        dataLength,
        True,
        False
      );
      app.handleClick(data, Index);

      app.variableTime.getIndex++;
    }
  },
  variableTime: {
    prevTime: 0,
    timer: 0,
    INTERVARL: 1000,
    counter: 5,
    Index: 0,
    getIndex: 0,
    checkVAlueTrue: false,
    score: 0,
    valueScore: 300,
    streak: 0,
    True: 0,
    False: 0,
  },
  startTime: (currentTime) => {
    let { streak, score, True, False } = app.variableTime;
    let { progressWidth } = app.progressValue;
    if (app.variableTime.timer <= currentTime) {
      app.variableTime.timer = currentTime + app.variableTime.INTERVARL;
      app.variableTime.counter--;
    }
    if (app.variableTime.counter > 0) {
      if (app.variableTime.checkVAlueTrue) {
        app.variableTime.counter = 5;
        app.variableTime.Index++;
        app.variableTime.checkVAlueTrue = false;
        if (app.variableTime.Index < app.variableTime.dataLength) {
          setTimeout(() => {
            app.getConclusiveAnswer();
            requestAnimationFrame(app.startTime);
          }, 1000);
        }
      }
      requestAnimationFrame(app.startTime);
    } else {
      app.variableTime.counter = 5;
      if (app.variableTime.Index === app.variableTime.dataLength) {
        app.end(streak, score, True, False);
      }
      app.variableTime.Index++;
      if (app.variableTime.Index <= app.variableTime.dataLength) {
        app.getConclusiveAnswer();
        requestAnimationFrame(app.startTime);
      }
    }
  },
  progressValue: {},

  renderConclusiveAnswer: (
    title,
    answer1,
    answer2,
    answer3,
    answer4,
    streak,
    score,
    index,
    dataLength
  ) => {
    if (index <= dataLength) {
      rootEl.querySelector(".App .quizizzGame").innerHTML = `
<div class="quizizzGame__question h-100">
<div class="row h-100">
  <div class="col-12 quizizzGame__top">
    <div class="quizizzGame__top--inner">
      <div class="quizizzGame__top--timer">
        <div class="quizizzGame__top--timer-total">
          <div
            class="quizizzGame__top--timer-progress"
            style="width:100%"
          ></div>
        </div>
      </div>
      <div
        class="quizizzGame__top--inner d-flex justify-content-between align-items-center"
      >
        <div class="quizizzGame__top--inner-left">
          <div class="d-flex align-items-center">
            <div class="quizizzGame__top--step top-block">
              <span id="current">${index}</span><span id="total">/${dataLength}</span>
            </div>
            <div class="quizizzGame__streak">
              <div class="streak-line-left"></div>
              <div class="streak-line-right"></div>
              <div
                class="quizizzGame__streak--status"
                style="width: 33.3333%; padding: 0px 5px"
              >
                Streak
              </div>
            </div>
            <span class="streak-bonus">+${streak}</span>
          </div>
        </div>
        <div class="quizizzGame__top--inner-right">
          <div class="quizizzGame__top--score">Score: ${score}</div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="col-12 animate__animated animate__slideInLeft quizizzGame__question--main-content"
  >
    <div
      class="quizizzGame__question--main-inner d-flex flex-column justify-content-lg-between h-100"
      style="
        background: url('./background/runGame.jpg')
          center center / cover no-repeat fixed;
      "
    >
      <div class="quizizzGame__question--text w-100">
        <div
          class="d-flex flex-column justify-content-center align-items-center text-center overlay"
        >
          <h3>${title}</h3>
          <h4><em>(bài tập khó quá ạ)</em></h4>
        </div>
      </div>
      <div class="quizizzGame__answers w-100">
        <div
          class="quizizzGame__answers--inner d-flex flex-column flex-lg-row justify-content-lg-between"
        >
          <div
            class="quizizzGame__answer--item"
            style="width: calc((100% - 50px) / 4)"
          >
            <div
              class="quizizzGame__answer--item-inner overlay d-flex justify-content-center align-items-center text-center"
              data-id="1"
            >
            ${answer1}
            </div>
          </div>
          <div
            class="quizizzGame__answer--item"
            style="width: calc((100% - 50px) / 4)"
          >
            <div
              class="quizizzGame__answer--item-inner overlay d-flex justify-content-center align-items-center text-center"
              data-id="2"
            >
              ${answer2}
            </div>
          </div>
          <div
            class="quizizzGame__answer--item"
            style="width: calc((100% - 50px) / 4)"
          >
            <div
              class="quizizzGame__answer--item-inner overlay d-flex justify-content-center align-items-center text-center"
              data-id="3"
            >
            ${answer3}
            </div>
          </div>
          <div
            class="quizizzGame__answer--item"
            style="width: calc((100% - 50px) / 4)"
          >
            <div
              class="quizizzGame__answer--item-inner overlay d-flex justify-content-center align-items-center text-center"
              data-id="4"
            >
            ${answer4}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-12 quizizzGame__result text-center text-uppercase"></div>
</div>

</div>

  `;
    }
    let progress = rootEl.querySelector(".quizizzGame__top--timer-progress");
    app.progressValue.progressWidth = progress.clientWidth;
  },

  handleClick: (data, index) => {
    let check = true;
    rootEl
      .querySelectorAll(".quizizzGame__answer--item-inner")

      .forEach((item, i) => {
        let handleClickScore = function () {
          let ValueButton = item.textContent.trim();
          let { answerTrue } = data[index];
          if (answerTrue.trim() === ValueButton && check) {
            function style() {
              item.style.background = "#AAFFA9";
              rootEl.querySelector(".quizizzGame__result").style.background =
                "#AAFFA9";
            }
            style();
            app.variableTime.checkVAlueTrue = true;
            app.variableTime.score += 300;
            ++app.variableTime.True;
            item.removeEventListener("click", handleClickScore);
          } else {
            function style() {
              item.style.background = "#f85032";
              item.removeEventListener("click", handleClickScore);
              rootEl.querySelector(".quizizzGame__result").style.background =
                "#AAFFA9";
            }
            check = false;
            style();
            if (answerTrue.trim() === ValueButton) {
              item.style.background = "#AAFFA9";
              console.log("hello");
            }
          }
        };
        app.variableTime.False =
          app.variableTime.dataLength - app.variableTime.True;
        app.variableTime.percentageCorrectAnswers =
          app.variableTime.False / 100;
        item.addEventListener("click", handleClickScore);
      });
  },
  end: function (streak, score, True, False) {
    rootEl.querySelector(".App .quizizzGame").innerHTML = `
    
<div
class="quizizzGame__stats"
style="
background: url('./background/anh-dong-su-that-cuc-vui-ve-ca-3180-3309-1398047851.jpg') center
  center / cover no-repeat fixed;
"
>
<div
class="quizizzGame__stats--inner overlay text-center d-flex flex-column justify-content-center"
>
<div class="quizizzGame__stats--inner-top">
  <p>Game performance</p>
  <div class="quizizzGame__stats--accuracy summary-block">
    <p>Accuracy</p>
    <div class="quizizzGame__stats--accuracy-total">
      <div
        class="quizizzGame__stats--accuracy-progress"
        style="${0}%"
      >
        <span>12.5%</span>
      </div>
    </div>
  </div>
  <div
    class="quizizzGame__stats--performance d-flex flex-wrap justify-content-between"
  >
    <div class="quizizzGame__stats--performance-item summary-block">
      <p class="number">${score}</p></p>
      <p class="stat">Score</p>
    </div>
    <div class="quizizzGame__stats--performance-item summary-block">
      <p class="number">${streak}</p>
      <p class="stat">Streak</p>
    </div>
    <div class="quizizzGame__stats--performance-item summary-block">
      <p class="number">${True}</p>
      <p class="stat">Correct</p>
    </div>
    <div class="quizizzGame__stats--performance-item summary-block">
      <p class="number">${False}</p>
      <p class="stat">Incorrect</p>
    </div>
  </div>
  <div class="quizizzGame__stats--actions">
    <button class="quizizzGame__stats--actions-reset">Play again</button>
  </div>
</div>
</div>
</div>

    `;

    let handleclickAgain = function () {
      app.start();
      location.reload();
    };
    rootEl
      .querySelector(".quizizzGame__stats--actions-reset")
      .addEventListener("click", handleclickAgain);
  },
  start: function () {
    this.render();
    this.begin();
  },
};

let checkServer = async function () {
  const { response } = await client.get("/conclusiveAnswer");
  if (response.ok) {
    app.start();
  }
};
checkServer();
