/* ============================================================
   💎 modules/pdf_editor.js — Work_CS6VIP_Full_Aurora_Final
   Author: Minh Nhut (TahoTTNT2708)
   ============================================================ */

let pdfDoc = null;
let pdfCanvas = null;
let pdfCtx = null;
let currentPage = 1;
let scale = 1.2;
let pdfAnnotations = [];

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("pdfFile");
  pdfCanvas = document.createElement("canvas");
  pdfCanvas.id = "pdfCanvas";
  const viewer = document.getElementById("pdfViewer");
  if (viewer) viewer.appendChild(pdfCanvas);
  pdfCtx = pdfCanvas.getContext("2d");

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) loadPDF(file);
    });
  }
});

/* Mở và đọc PDF */
async function loadPDF(file) {
  const pdfjsLib = window["pdfjs-dist/build/pdf"];
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
  const arrayBuffer = await file.arrayBuffer();
  pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  currentPage = 1;
  renderPage(currentPage);
}

/* Vẽ trang PDF */
async function renderPage(num) {
  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale });
  pdfCanvas.height = viewport.height;
  pdfCanvas.width = viewport.width;
  const renderContext = { canvasContext: pdfCtx, viewport };
  await page.render(renderContext).promise;
}

/* Thêm highlight */
function addHighlight() {
  pdfCanvas.addEventListener("mousedown", startHighlight);
}

function startHighlight(e) {
  const rect = pdfCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const width = 150;
  const height = 25;
  pdfCtx.fillStyle = "rgba(255,255,0,0.4)";
  pdfCtx.fillRect(x, y, width, height);
  pdfAnnotations.push({ type: "highlight", x, y, width, height });
  pdfCanvas.removeEventListener("mousedown", startHighlight);
}

/* Thêm ghi chú */
function addNote() {
  const text = prompt("Nhập ghi chú:");
  if (!text) return;
  pdfCtx.font = "16px Poppins";
  pdfCtx.fillStyle = "#111827";
  pdfCtx.fillText("📝 " + text, 50, 50 + pdfAnnotations.length * 30);
  pdfAnnotations.push({ type: "note", text });
}

/* Thêm ảnh */
function addImagePDF() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        pdfCtx.drawImage(img, 60, 60, 200, 150);
        pdfAnnotations.push({ type: "image", data: ev.target.result });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

/* Ký tên */
function signPDF() {
  const name = prompt("Ký tên (tên của bạn):");
  if (!name) return;
  pdfCtx.font = "bold 22px Dancing Script, cursive";
  pdfCtx.fillStyle = "#2563eb";
  pdfCtx.fillText(name, pdfCanvas.width - 200, pdfCanvas.height - 40);
  pdfAnnotations.push({ type: "sign", name });
}

/* Lưu lại PDF mới */
async function savePDF() {
  const pdfLib = await PDFLib.PDFDocument.create();
  const page = pdfLib.addPage([pdfCanvas.width, pdfCanvas.height]);
  const pngData = pdfCanvas.toDataURL("image/png");
  const pngImage = await pdfLib.embedPng(pngData);
  page.drawImage(pngImage, { x: 0, y: 0, width: pdfCanvas.width, height: pdfCanvas.height });

  const pdfBytes = await pdfLib.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `PDF_EDITED_${new Date().toISOString().replace(/[-:.]/g, "")}.pdf`;
  link.click();
}

/* Thư viện cần thiết (PDF.js + PDFLib.js) */
window.addEventListener("load", () => {
  const s1 = document.createElement("script");
  s1.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
  document.body.appendChild(s1);

  const s2 = document.createElement("script");
  s2.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
  document.body.appendChild(s2);
});