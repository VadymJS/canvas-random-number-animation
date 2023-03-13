const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 640;
canvas.height = 300;
 
let number = "";
let timePassed = 0;
let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 50;
let numberY = 120;
let animation;
let opacity = 0.01;
let s;
let arr = [];
let historyX;

function history() {
  ctx.fillStyle = 'rgba(31,33,40,.8)';
  ctx.fillRect(0, 0, canvas.width, 45)
  ctx.save();
  ctx.font = "700 16px sans-serif";
  
  if (arr.length) {
    arr.forEach((el) => {
      // ctx.beginPath();
      // ctx.strokeStyle = el.isWon ? '#4FBF67' : '#FF6628';
      // ctx.roundRect(el.x - 27, 10, 54, 25, 4);
      // ctx.roundRect(, 10, 54, 25, 4);
      roundRect(el.x - 27, 10, 54, 25, 4, el.isWon ? '#4FBF67' : '#FF6628');

      // ctx.stroke();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = el.isWon ? '#4FBF67' : '#FF6628';
      ctx.fillText(el.number, el.x, 24);
      if (el.maxX >= el.x) {
        el.x = el.maxX;
      } else {
        el.x -= 5;
      }
    })
  }
    
  ctx.restore();
}

function drawNumber() {
  let txtHeight = 120;
  
  let grd = ctx.createLinearGradient(0, numberY - txtHeight/2, 0, numberY + txtHeight/2);

  grd.addColorStop(0, "#34cc45");
  grd.addColorStop(0.3, "#34bb45");
  grd.addColorStop(0.4, "#34aa45");
  grd.addColorStop(0.48, "#FFFFFF");
  grd.addColorStop(0.48, "#347745");
  grd.addColorStop(0.55, "#345545");
  grd.addColorStop(0.75, "#343345");
  grd.addColorStop(1, "#FFFFFF");

  ctx.save();
  ctx.font = "700 " + txtHeight + "px sans-serif";
  ctx.globalAlpha = opacity;

  ctx.fillStyle = grd;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "-3px";
  for(let i = 0; i < 3; i++) {
    ctx.save();
    if (i === 0) {
      ctx.shadowOffsetX = 9;
      ctx.shadowOffsetY = 9;
      ctx.shadowColor = '#34cc45';
    } else if (i === 1) {
      ctx.shadowOffsetX = 6;
      ctx.shadowOffsetY = 6;
      ctx.shadowColor = '#347745';
    } else {
       ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.shadowColor = '#343345';
    }
    
    ctx.fillText(number, canvas.width / 2, numberY);
    ctx.restore(); 
  }

  ctx.filter = "none";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#fff";

  ctx.strokeText(number, canvas.width / 2, numberY);
  ctx.restore();
}

function drawBg() {
  ctx.fillStyle = "#454545";

  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function update(secondsPassed) {
  timePassed += secondsPassed;

  if (timePassed > 0.7) {
    return;
  }
  numberY = easeOutBack(timePassed, 230, -100, 0.7);
  if (timePassed >= 0.4) {
    opacity = 1;
  } else {
    opacity += 0.05;
  }
}
function gameLoop(timeStamp) {
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  secondsPassed = Math.min(secondsPassed, 0.1);

  oldTimeStamp = timeStamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawBg();
  history();
  drawNumber();
  update(secondsPassed);

  requestAnimationFrame(gameLoop);
}

function easeOutBack(t, b, c, d) {
  if (s == undefined) s = 1.7;
  return parseInt(c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b);
}

function roundRect(x, y, w, h, radius, color)
{
  let r = x + w;
  let b = y + h;
  ctx.beginPath();
  ctx.strokeStyle=color;
  ctx.lineWidth="1";
  ctx.moveTo(x+radius, y);
  ctx.lineTo(r-radius, y);
  ctx.quadraticCurveTo(r, y, r, y+radius);
  ctx.lineTo(r, y+h-radius);
  ctx.quadraticCurveTo(r, b, r-radius, b);
  ctx.lineTo(x+radius, b);
  ctx.quadraticCurveTo(x, b, x, b-radius);
  ctx.lineTo(x, y+radius);
  ctx.quadraticCurveTo(x, y, x+radius, y);
  ctx.stroke();
}

function renderNumber(numberMemory) {
  number = +number;
  numberMemory = +numberMemory;
  let step = 20;
  let time = 50;

  let valueStep = (step / 100) * numberMemory;

  if (number < numberMemory) {
    if (number + valueStep >= numberMemory) {
      number = numberMemory;
      
      for (let i = 0; i < arr.length; i++) {
        arr[i].maxX -= 63;
      }
      
      historyX = window.innerWidth > canvas.width ? 
          canvas.width :
          Math.floor(canvas.width - (canvas.width - window.innerWidth) / 2);
      
      arr.push({
        number: number,
        isWon: 0.5 > Math.random(),
        x: arr.length ? arr[arr.length - 1].x + 63 : historyX,
        maxX: arr.length ? arr[arr.length - 1].maxX + 63 : historyX - 37,
      });
      
      arr.length > 11 && arr.splice(0, 1);
     
      return;
    } else {
      number += valueStep;
    }
    setTimeout(() => renderNumber(numberMemory), time);
  }
  
  number = Number.parseFloat(number).toFixed(2);
} 

function roll() {
  number = 0;
  opacity = 0;
  renderNumber((Math.random() * 100).toFixed(2));
  animation = null;
  timePassed = 0;
  secondsPassed = 0;
  oldTimeStamp = 0;
  
  update(secondsPassed);
}

function resizeCanvas() {
  if (arr.length) {
    historyX = window.innerWidth > canvas.width ? 
      canvas.width :
      Math.floor(canvas.width - (canvas.width - window.innerWidth) / 2);

    for (let i = 0; i < arr.length; i++) {
      let historyXCoef = 63 * ((arr.length - 1) - i);
      arr[i].x = historyX - 37 - historyXCoef;
      arr[i].maxX = historyX - 37 - historyXCoef;
    }
  }
}

window.onresize = function() {
  resizeCanvas();
}

gameLoop(0);
