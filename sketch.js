let atoms = [];
let temp = 300;
let amorphous = false;

let cols = 12;
let rows = 10;
let sp = 36;

function setup() {
  createCanvas(620, 420);
  initAtoms();
}

function initAtoms() {
  atoms = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      atoms.push({
        hx: 60 + i * sp,
        hy: 50 + j * sp,
        x: 60 + i * sp,
        y: 50 + j * sp,
        vx: 0,
        vy: 0,
        free: false,
        frozen: false,
        ns: random(9999)
      });
    }
  }
}

function draw() {
  background(255);
  
  noFill();
  stroke(200);
  rect(40, 30, cols * sp + 40, rows * sp + 40);
  
  for (let i = 0; i < atoms.length; i++) {
    let a = atoms[i];
    
    if (!a.frozen) {
      if (temp > 1000 && !a.free) {
        a.free = true;
        a.vx = random(-1, 1);
        a.vy = random(-1, 1);
      }
      
      if (temp < 700 && a.free && !amorphous) {
        a.free = false;
      }
      
      if (a.free) {
        a.vx += random(-0.08, 0.08);
        a.vy += random(-0.08, 0.08);
        a.vx = constrain(a.vx, -1.5, 1.5);
        a.vy = constrain(a.vy, -1.5, 1.5);
        a.x += a.vx;
        a.y += a.vy;
        
        if (a.x < 50 || a.x > 40 + cols * sp + 30) a.vx *= -1;
        if (a.y < 40 || a.y > 30 + rows * sp + 30) a.vy *= -1;
        a.x = constrain(a.x, 50, 40 + cols * sp + 30);
        a.y = constrain(a.y, 40, 30 + rows * sp + 30);
      } else {
        let amp = map(temp, 0, 1000, 0, 12);
        let t = frameCount * 0.015;
        a.x = a.hx + (noise(a.ns + t) - 0.5) * amp * 2;
        a.y = a.hy + (noise(a.ns + 999 + t) - 0.5) * amp * 2;
      }
    }
    
    if (a.frozen) {
      fill(100);
      noStroke();
      rect(a.x - 3, a.y - 3, 6, 6);
    } else if (a.free) {
      noFill();
      stroke(0);
      strokeWeight(1);
      ellipse(a.x, a.y, 9, 9);
    } else {
      fill(0);
      noStroke();
      ellipse(a.x, a.y, 7, 7);
    }
  }
  
  let px = 520;
  
  fill(0);
  noStroke();
  textSize(12);
  textAlign(LEFT);
  text("Температура", px, 50);
  
  let thX = px + 15;
  let thY = 70;
  let thH = 200;
  
  stroke(0);
  strokeWeight(1);
  noFill();
  rect(thX, thY, 20, thH);
  
  let fillH = map(temp, 0, 1500, 0, thH);
  noStroke();
  fill(map(temp, 0, 1500, 200, 50));
  rect(thX + 1, thY + thH - fillH, 18, fillH);
  
  fill(0);
  textSize(10);
  textAlign(LEFT);
  text("1500", thX + 25, thY + 5);
  text("1000", thX + 25, thY + thH/3 + 3);
  text("0", thX + 25, thY + thH);
  
  textSize(14);
  textAlign(CENTER);
  text(temp + " K", thX + 10, thY + thH + 25);
  
  let btnY = 320;
  
  stroke(0);
  fill(mouseInBtn(px, btnY, 80, 28) ? 230 : 255);
  rect(px, btnY, 80, 28, 3);
  fill(0);
  noStroke();
  textSize(12);
  textAlign(CENTER, CENTER);
  text("Закалка", px + 40, btnY + 14);
  
  fill(mouseInBtn(px, btnY + 38, 80, 28) ? 230 : 255);
  stroke(0);
  rect(px, btnY + 38, 80, 28, 3);
  fill(0);
  noStroke();
  text("Сброс", px + 40, btnY + 52);
  
  textAlign(LEFT);
  textSize(12);
  let st = "Кристалл";
  if (amorphous) st = "Аморфное";
  else if (temp > 1000) st = "Расплав";
}

function mouseInBtn(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

function mousePressed() {
  let px = 520;
  let btnY = 320;
  
  let thX = px + 15;
  let thY = 70;
  let thH = 200;
  if (mouseX > thX && mouseX < thX + 20 && mouseY > thY && mouseY < thY + thH) {
    temp = round(map(mouseY, thY + thH, thY, 0, 1500));
    temp = constrain(temp, 0, 1500);
  }
  
  if (mouseInBtn(px, btnY, 80, 28)) {
    doQuench();
  }
  
  if (mouseInBtn(px, btnY + 38, 80, 28)) {
    doReset();
  }
}

function mouseDragged() {
  let thX = 520 + 15;
  let thY = 70;
  let thH = 200;
  if (mouseX > thX - 10 && mouseX < thX + 30 && mouseY > thY && mouseY < thY + thH) {
    temp = round(map(mouseY, thY + thH, thY, 0, 1500));
    temp = constrain(temp, 0, 1500);
  }
}

function doQuench() {
  if (temp > 800) {
    amorphous = true;
    for (var i = 0; i < atoms.length; i++) {
      atoms[i].frozen = true;
    }
  }
  temp = 0;
}

function doReset() {
  amorphous = false;
  temp = 300;
  initAtoms();
}