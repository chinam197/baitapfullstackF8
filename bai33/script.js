"use strict";

let button = document.querySelector(".btn");

const SpeechToText = window.speechRecognition || window.webkitSpeechRecognition;
let recognition = new webkitSpeechRecognition();
recognition.continuous = false;
// recognition.interimResults = false;
recognition.lang = "vi-VN";

recognition.onresult = function (event) {
  console.log(event);
};

// let titleOnStart;

let containerHTML = document.querySelector(".container");
// createElement
let titleOnStart = document.createElement("p");
let titleOnEnd = document.createElement("p");
let titleOnError = document.createElement("p");
let OutputText = document.createElement("p");

//lấy text giọng nói

//
button.addEventListener("click", (e) => {
  e.preventDefault();
  recognition.start();
  titleOnError.innerText = "";
  titleOnError.style.display = "none";
  let innerElementText = () => {
    titleOnStart.innerText =
      "hãy nói ra điều bạn muốn nói mà không nói cũng được";
    titleOnStart.classList.add("output");
    titleOnEnd.innerText = "";
    containerHTML.append(titleOnStart);
    button.style.backgroundColor = "red";
  };
  innerElementText();
});

recognition.onspeechend = () => {
  recognition.stop();

  let innerElementText = () => {
    titleOnStart.innerText = "";
    button.style.backgroundColor = "blue";
    titleOnEnd.innerText = "Đã nói xong. Hy vọng giống ý bạn";
    titleOnEnd.classList.add("output");
    containerHTML.append(titleOnEnd);
  };
  innerElementText();
};

const handleVoid = function (text) {
  
  let resultText = text.toLowerCase();

OutputText.innerText ="Kết quả của :" + text;
OutputText.classList.add("outputText")
containerHTML.append(OutputText);
  switch (resultText) {
    case "google":
      window.open("https://www.google.com.vn/?hl=vi","_blank");
      break;

    case "facebook":
      window.open(
        "https://www.facebook.com/?locale=vi_VN",
        "_blank"
      );

      break;

    case "google drive":
      window.open(
        "https://www.google.com/intl/vi_VN/drive/",
        "_blank"
      );
      break;

    case "google maps":
      window.open("https://www.google.com/maps", "_blank");
      break;

    case "youtube":
      window.open("https://www.youtube.com/", "_blank");
      break;

    default:

      if (text.includes("Google Maps") && text.includes("Vinhomes Smartcity Tây Mỗ")) {
        window.open("https://www.google.com/maps/dir//21.0051413,105.7392555/@21.0051024,105.6569042,12z?entry=ttu","_blank");
    }
    else if (text.includes("Zing MP3") && text.includes("ai chung tình được mãi")) {
        window.open("https://zingmp3.vn/album/Ai-Chung-Tinh-Duoc-Mai-Single-Dinh-Tung-Huy-ACV/699A9WO9.html","_blank");
    }else if (text.includes("YouTube") && text.includes("ai chung tình được mãi")){
        console.log("hello1");
         window.open("https://www.youtube.com/watch?v=eZpJdO22jZ0","_blank");
    } 
    else 
    {
       setTimeout(() => {
        titleOnError.style.display = "block";
        titleOnError.innerText = "Không thực hiện được yêu cầu";
        titleOnError.classList.add("error");
        titleOnStart.innerText = "";
        containerHTML.append(titleOnError);
      }, 500);
    
    }
     
  }
};

recognition.onresult = (e) => {
  let text = e.results[0][0].transcript;
  handleVoid(text);
};
