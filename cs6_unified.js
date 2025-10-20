/* ============================================================
   💎 modules/cs6_unified.js — Work_CS6VIP_Full_Aurora_Final
   Author: Minh Nhut (TahoTTNT2708)
   ============================================================ */

let canvas = null;
let ctx = null;
let img = new Image();
let historyStack = [];
let currentStep = -1;

document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("photoCanvas");
  if (!canvas) return;
  ctx = canvas.getContext("2d");
  const fileInput = document.getElementById("photoInput");

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (evt) {
        img.onload = function () {
          resizeCanvas(img.width, img.height);
          ctx.drawImage(img, 0, 0);
          saveHistory();
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
});

/* Resize canvas giữ tỉ lệ */
function resizeCanvas(w, h) {
  canvas.width = w;
  canvas.height = h;
}

/* Lưu trạng thái để Undo/Redo */
function saveHistory() {
  currentStep++;
  if (currentStep < historyStack.length) historyStack.length = currentStep;
  historyStack.push(canvas.toDataURL());
}

function undo() {
  if (currentStep > 0) {
    currentStep--;
    restoreImage(historyStack[currentStep]);
  }
}

function redo() {
  if (currentStep < historyStack.length - 1) {
    currentStep++;
    restoreImage(historyStack[currentStep]);
  }
}

function restoreImage(data) {
  const image = new Image();
  image.onload = () => ctx.drawImage(image, 0, 0);
  image.src = data;
}

/* Các hiệu chỉnh cơ bản */
function adjustBrightness() {
  applyFilter((r, g, b) => [r + 20, g + 20, b + 20]);
}

function adjustContrast() {
  applyFilter((r, g, b) => {
    const factor = 1.2;
    return [
      (r - 128) * factor + 128,
      (g - 128) * factor + 128,
      (b - 128) * factor + 128
    ];
  });
}

/* Lọc màu cơ bản */
function applyFilter() {
  if (!canvas || !ctx) return;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // ví dụ: tone xám lạnh
    data[i] = data[i] * 0.9 + 10;     // R
    data[i + 1] = data[i + 1] * 1.05; // G
    data[i + 2] = data[i + 2] * 1.1;  // B
  }

  ctx.putImageData(imageData, 0, 0);
  saveHistory();
}

/* Crop tự do (demo drag) */
let cropping = false;
let cropStart = { x: 0, y: 0 };
let cropEnd = { x: 0, y: 0 };

canvas?.addEventListener("mousedown", (e) => {
  cropping = true;
  cropStart = { x: e.offsetX, y: e.offsetY };
});
canvas?.addEventListener("mouseup", (e) => {
  if (!cropping) return;
  cropping = false;
  cropEnd = { x: e.offsetX, y: e.offsetY };
  const w = cropEnd.x - cropStart.x;
  const h = cropEnd.y - cropStart.y;
  const imageData = ctx.getImageData(cropStart.x, cropStart.y, w, h);
  resizeCanvas(w, h);
  ctx.putImageData(imageData, 0, 0);
  saveHistory();
});

/* Xoay ảnh */
function rotate90() {
  const tmp = document.createElement("canvas");
  tmp.width = canvas.height;
  tmp.height = canvas.width;
  const tctx = tmp.getContext("2d");
  tctx.translate(tmp.width / 2, tmp.height / 2);
  tctx.rotate((90 * Math.PI) / 180);
  tctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  resizeCanvas(tmp.width, tmp.height);
  ctx.drawImage(tmp, 0, 0);
  saveHistory();
}

/* Lưu ảnh */
function saveCS6() {
  const link = document.createElement("a");
  link.download = `IMG_${new Date().toISOString().replace(/[-:T.]/g, "")}.jpg`;
  link.href = canvas.toDataURL("image/jpeg", 0.95);
  link.click();
}

/* Kết nối AI module */
function sendToAI() {
  const dataURL = canvas.toDataURL("image/png");
  document.dispatchEvent(new CustomEvent("send-to-ai", { detail: dataURL }));
}

window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "z") undo();
  if (e.ctrlKey && e.key === "y") redo();
});