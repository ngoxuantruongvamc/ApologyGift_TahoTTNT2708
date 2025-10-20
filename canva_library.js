/* ============================================================
   💎 modules/canva_ai_unified.js — Work_CS6VIP_Full_Aurora_Final
   Author: Minh Nhut (TahoTTNT2708)
   ============================================================ */

let canvaCanvas, canvaCtx;
let canvaElements = [];
let selectedElement = null;
let dragOffset = { x: 0, y: 0 };

document.addEventListener("DOMContentLoaded", () => {
  canvaCanvas = document.getElementById("canvaCanvas");
  if (!canvaCanvas) return;
  canvaCtx = canvaCanvas.getContext("2d");
  resizeCanva();
  window.addEventListener("resize", resizeCanva);

  initToolButtons();
  renderCanva();
});

/* ====== 1️⃣ Khởi tạo khung Canva ====== */
function resizeCanva() {
  canvaCanvas.width = canvaCanvas.clientWidth;
  canvaCanvas.height = 500;
  renderCanva();
}

function renderCanva() {
  canvaCtx.clearRect(0, 0, canvaCanvas.width, canvaCanvas.height);
  for (const el of canvaElements) drawElement(el);
}

function drawElement(el) {
  if (el.type === "rect") {
    canvaCtx.fillStyle = el.color;
    canvaCtx.fillRect(el.x, el.y, el.w, el.h);
  } else if (el.type === "text") {
    canvaCtx.font = `${el.size}px Poppins`;
    canvaCtx.fillStyle = el.color;
    canvaCtx.fillText(el.text, el.x, el.y);
  } else if (el.type === "image" && el.img) {
    canvaCtx.drawImage(el.img, el.x, el.y, el.w, el.h);
  }
}

/* ====== 2️⃣ Tương tác kéo thả ====== */
canvaCanvas?.addEventListener("mousedown", (e) => {
  const { offsetX, offsetY } = e;
  selectedElement = canvaElements.find(
    (el) =>
      offsetX >= el.x &&
      offsetX <= el.x + el.w &&
      offsetY >= el.y &&
      offsetY <= el.y + el.h
  );
  if (selectedElement) {
    dragOffset.x = offsetX - selectedElement.x;
    dragOffset.y = offsetY - selectedElement.y;
  }
});

canvaCanvas?.addEventListener("mousemove", (e) => {
  if (!selectedElement) return;
  selectedElement.x = e.offsetX - dragOffset.x;
  selectedElement.y = e.offsetY - dragOffset.y;
  renderCanva();
});

canvaCanvas?.addEventListener("mouseup", () => (selectedElement = null));

/* ====== 3️⃣ Các công cụ cơ bản ====== */
function addText() {
  const text = prompt("Nhập nội dung:");
  if (!text) return;
  canvaElements.push({
    type: "text",
    text,
    x: 50,
    y: 100 + Math.random() * 200,
    color: "#111827",
    size: 24,
  });
  renderCanva();
}

function addRect() {
  canvaElements.push({
    type: "rect",
    x: 60,
    y: 60,
    w: 150,
    h: 100,
    color: "#e5e7eb",
  });
  renderCanva();
}

function addImageCanva() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        canvaElements.push({
          type: "image",
          img,
          x: 80,
          y: 80,
          w: 200,
          h: 150,
        });
        renderCanva();
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

/* ====== 4️⃣ Công cụ AI ====== */

/* Remove Background bằng Canvas Mask (giả lập offline) */
function removeBG() {
  if (!selectedElement || selectedElement.type !== "image") return alert("Chọn ảnh để xóa nền");
  canvaCtx.fillStyle = "#fff";
  canvaCtx.fillRect(selectedElement.x, selectedElement.y, selectedElement.w, selectedElement.h);
  canvaCtx.globalCompositeOperation = "destination-in";
  canvaCtx.drawImage(selectedElement.img, selectedElement.x, selectedElement.y, selectedElement.w, selectedElement.h);
  canvaCtx.globalCompositeOperation = "source-over";
  alert("✅ Giả lập xóa nền (offline).");
}

/* Enhance (tăng nét giả lập) */
function enhanceAI() {
  const data = canvaCtx.getImageData(0, 0, canvaCanvas.width, canvaCanvas.height);
  const d = data.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.min(255, d[i] * 1.05);
    d[i + 1] = Math.min(255, d[i + 1] * 1.05);
    d[i + 2] = Math.min(255, d[i + 2] * 1.05);
  }
  canvaCtx.putImageData(data, 0, 0);
  alert("✨ Tăng nét offline hoàn tất!");
}

/* Color Transfer */
function colorTransfer() {
  alert("🎨 Tự động cân bằng màu (giả lập).");
}

/* Inpaint — Xóa vật thể */
function inpaintAI() {
  alert("🧽 AI Inpaint (xóa vật thể) đang chạy...");
  setTimeout(() => alert("✅ Hoàn tất giả lập Inpaint!"), 1500);
}

/* ====== 5️⃣ Lưu ảnh xuất ra ====== */
function exportCanva() {
  const link = document.createElement("a");
  link.download = `CANVA_${new Date().toISOString().replace(/[-:T.]/g, "")}.png`;
  link.href = canvaCanvas.toDataURL("image/png");
  link.click();
}

/* ====== 6️⃣ Toolbar khởi tạo ====== */
function initToolButtons() {
  document.getElementById("btnText")?.addEventListener("click", addText);
  document.getElementById("btnRect")?.addEventListener("click", addRect);
  document.getElementById("btnImg")?.addEventListener("click", addImageCanva);
  document.getElementById("btnBG")?.addEventListener("click", removeBG);
  document.getElementById("btnEnhance")?.addEventListener("click", enhanceAI);
  document.getElementById("btnColor")?.addEventListener("click", colorTransfer);
  document.getElementById("btnInpaint")?.addEventListener("click", inpaintAI);
  document.getElementById("btnExport")?.addEventListener("click", exportCanva);
}