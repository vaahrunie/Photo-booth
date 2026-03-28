const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const finalCanvas = document.getElementById('finalCanvas');
const countdownEl = document.getElementById('countdown');
const strip = document.getElementById('strip');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(() => alert("Allow camera pls 😭"));

let photos = [];

function startBooth() {
  photos = [];
  takeSequence(0);
}

function takeSequence(i) {
  if (i === 4) {
    createStrip();
    return;
  }

  let count = 3;
  countdownEl.innerText = count;

  let timer = setInterval(() => {
    count--;
    countdownEl.innerText = count;

    if (count === 0) {
      clearInterval(timer);
      capturePhoto();
      setTimeout(() => takeSequence(i + 1), 500);
    }
  }, 1000);
}

function capturePhoto() {
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  photos.push(canvas.toDataURL());
}

function createStrip() {
  const ctx = finalCanvas.getContext('2d');

  const border = new Image();
  border.crossOrigin = "anonymous"; // important
  border.src = "https://raw.githubusercontent.com/yourusername/repo-name/main/yourborder.png";

  border.onload = () => {
    finalCanvas.width = border.width;
    finalCanvas.height = border.height;
    ctx.drawImage(border, 0, 0);

    const photoWidth = 260;
    const photoHeight = 195;
    const startX = (finalCanvas.width - photoWidth) / 2;
    let startY = 120;

    let loadedCount = 0;

    photos.forEach((imgData) => {
      const img = new Image();
      img.src = imgData;
      img.onload = () => {
        ctx.drawImage(img, startX, startY, photoWidth, photoHeight);
        startY += photoHeight + 20;

        loadedCount++;
        if (loadedCount === photos.length) {
          strip.src = finalCanvas.toDataURL();
        }
      };
    });
  };
}