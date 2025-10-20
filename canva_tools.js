/* ===========================
   MODULE: CANVA_TOOLS.JS
   Canva-Style Layout Engine
   =========================== */

function initCanvaTemplates(){
    const templateList = document.querySelector("#template-list");
    const templates = [
        {name:"Instagram Post 1:1", ratio:"1/1", color:"#e8f0ff"},
        {name:"Facebook Cover 16:9", ratio:"16/9", color:"#fff4f4"},
        {name:"A4 Document", ratio:"A4", color:"#ffffff"},
        {name:"TikTok Story 9:16", ratio:"9/16", color:"#f0f0f0"}
    ];

    templates.forEach(t=>{
        const li = document.createElement("li");
        li.textContent = t.name;
        li.className = "btn";
        li.onclick = ()=>createCanvaCanvas(t.color);
        templateList.appendChild(li);
    });
}

function createCanvaCanvas(color){
    const canvasArea = document.querySelector("#work-canvas");
    canvasArea.innerHTML="";
    const div = document.createElement("div");
    div.className="editor-canvas aurora-frame";
    div.style.background = color;
    div.style.minHeight="500px";
    div.textContent="🎨 Canva Workspace – kéo thả đối tượng tại đây.";
    canvasArea.appendChild(div);
}

function addShape(shapeType){
    const c = document.querySelector(".editor-canvas");
    const el = document.createElement("div");
    el.className="shape";
    el.style.position="absolute";
    el.style.left=Math.random()*300+"px";
    el.style.top=Math.random()*200+"px";
    el.style.width="100px";
    el.style.height="100px";
    el.style.borderRadius=shapeType=="circle"?"50%":"10px";
    el.style.background=shapeType=="circle"?"#9bdcff":"#d8d8d8";
    c.appendChild(el);
}