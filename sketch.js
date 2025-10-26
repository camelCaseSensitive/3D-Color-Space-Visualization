
let cam = {
  x: 300,
  y: 300,
  z: 300,
  th: Math.PI,
  phi: Math.PI - Math.PI/6,
  dist: Math.sqrt(300**2 + 300**2 + 300**2),
  lookAt: { x: 0, y:0, z: 0 }
}

let mousePrev = {
  x: 0, y: 0
}

let p = {
  x: 0,
  y: 0, 
  z: 0,
  draw: () => {
    push()
      translate(p.x, p.y, p.z)
      noStroke()
      fill(160, 170, 250)
      sphere(20)
      translate(0, 0, -p.z + 1.5)
      fill(100)
      circle(0, 0, 40 - min(30, p.z/10))
    pop()
  },
  move: ()=> {
    p.x += (mouseX - mousePrev.x - width/2) 
    p.y += (mouseY - mousePrev.y - height/2) 
    if(keyCode == 87 && keyIsPressed){
      p.z += 5;
    }
    if(keyCode == 83 && keyIsPressed){
      p.z -= 5;
    }
  }
}

let pos, pos2;
let t = 0;
let frameCount = 100;

function setup() {
  let canvas = createCanvas(1920, 1080, WEBGL);
  canvas.parent('sketch-holder');
//   camera(cam.x, cam.y, cam.z, 
//     cam.lookAt.x, cam.lookAt.y, cam.lookAt.z, 
//     0, 0, -1)

//   cam.th += (mouseX - mousePrev.x - width/2) / 100;
//   if(cam.phi + (mouseY - mousePrev.y - height/2) / 100 < Math.PI/2 &&
//       cam.phi + (mouseY - mousePrev.y - height/2) / 100 > -Math.PI/2){
//   cam.phi += (mouseY - mousePrev.y - height/2) / 100;
//   }
//   cam.x = cam.dist * Math.cos(cam.phi) * Math.cos(cam.th)
//   cam.y = cam.dist * Math.cos(cam.phi) * Math.sin(cam.th)
//   cam.z = cam.dist * Math.sin(cam.phi)
//   camera(cam.x, cam.y, cam.z, 
//   cam.lookAt.x, cam.lookAt.y, cam.lookAt.z, 
//   0, 0, -1)
}

let rgbPoints = [];
let n = 10
for(let k = 0; k < n; k++){
  for(let j = 0; j < n; j++){
    for(let i = 0; i < n; i++){
      rgbPoints.push([i/n, j/n, k/n])
    }
  }
}

let labPoints = [];
for(let i = 0; i < rgbPoints.length; i++){
  let lab = rgb2lab(rgbPoints[i]);
  labPoints.push([lab[1]/255*2.5, lab[2]/255*2.5, lab[0]/255*2.5])
}

let hslPoints = [];
for(let i = 0; i < rgbPoints.length; i++){
  let hsl = rgbToHsl(rgbPoints[i][0]*255, rgbPoints[i][1]*255, rgbPoints[i][2]*255);
  
  let r = hsl[1];
  let th = hsl[0] * 2 * Math.PI;
  let l = hsl[2];
  
  hsl[2] = l*2;
  hsl[0] = r * Math.cos(th) * (0.5-Math.abs(l-0.5))/0.5;
  hsl[1] = r * Math.sin(th) * (0.5-Math.abs(l-0.5))/0.5;
  
  hslPoints.push([hsl[0], hsl[1], hsl[2]])
}


let hsbPoints = [];
for(let i = 0; i < rgbPoints.length; i++){
  let hsb = rgb2hsv(rgbPoints[i][0]*255, rgbPoints[i][1]*255, rgbPoints[i][2]*255);
  
  let r = hsb[1];
  let th = hsb[0] * 2 * Math.PI;
  let b = hsb[2];
  
  hsb[2] = b;
  hsb[0] = r * Math.cos(th) * b;
  hsb[1] = r * Math.sin(th) * b;
  
  hsbPoints.push([hsb[0], hsb[1], hsb[2]])
}

let points = [];
for(let i = 0; i < rgbPoints.length; i++){
  points.push([rgbPoints[i][0], rgbPoints[i][1], rgbPoints[i][2]])
}

let destPoints = points;
let currentPoints = points;


function draw() {
  background(255);
  frameCount += 3;
  // orbitCamera()
  orbitControl()
  rotateX(PI/2)
  lights(100)
  ambientLight(50)
  
  pointLight(100, 100, 100, -255, -255, -255)

  drawGrid(50, 4)
  
  
  noStroke()
//   rgbPoints.forEach((pos) => {
//     push()
//       // scale(0.35)
//       translate(pos[0]*255, pos[1]*255, pos[2]*255)
//       fill(pos[0]*255, pos[1]*255, pos[2]*255)
      
//       sphere(10)
//     pop()
//   });
  // let t = (sin(frameCount/20) + 1) / 2;
  t = easeInOutQuad(min(frameCount/100, 1))
  // for(let i = 0; i < min(round(frameCount), rgbPoints.length); i++){
  for(let i = 0; i < rgbPoints.length; i++){
    pos = points[i]
    // pos2 = hslPoints[i]
    // pos2 = labPoints[i]
    pos2 = destPoints[i];
    
    push()
      // scale(0.35)
      translate(pos[0]*255*(1-t) + pos2[0]*255*t, 
                pos[1]*255*(1-t) + pos2[1]*255*t, 
                pos[2]*255*(1-t) + pos2[2]*255*t)
      fill(rgbPoints[i][0]*255, rgbPoints[i][1]*255, rgbPoints[i][2]*255)
      
      sphere(10)
    pop()
  }
  
  drawCoordinates(3, 300)
}

function drawGrid(spacing, number) {
  let w = spacing * number;
  push()
    translate(-w/2, -w/2, 0)
    for(let i = 0; i <= number; i++){
      line(i * spacing, 0, i*spacing, w)
      line(0, i * spacing, w, i * spacing)
    }
  pop()
}

function mousePressed() {
}

// function mouseWheel(event) {
//   cam.dist += event.delta/3
//   cam.dist = abs(cam.dist)
//   cam.x = cam.dist * Math.cos(cam.phi) * Math.cos(cam.th)
//   cam.y = cam.dist * Math.cos(cam.phi) * Math.sin(cam.th)
//   cam.z = cam.dist * Math.sin(cam.phi)
//   camera(cam.x, cam.y, cam.z, 
//   cam.lookAt.x, cam.lookAt.y, cam.lookAt.z, 
//   0, 0, -1)
// }

function orbitCamera(){
  if(mouseIsPressed){
    cam.th += (mouseX - mousePrev.x - width/2) / 100;
    if(cam.phi + (mouseY - mousePrev.y - height/2) / 100 < Math.PI/2 &&
       cam.phi + (mouseY - mousePrev.y - height/2) / 100 > -Math.PI/2){
      cam.phi += (mouseY - mousePrev.y - height/2) / 100;
    }
    cam.x = cam.dist * Math.cos(cam.phi) * Math.cos(cam.th)
    cam.y = cam.dist * Math.cos(cam.phi) * Math.sin(cam.th)
    cam.z = cam.dist * Math.sin(cam.phi)
    camera(cam.x, cam.y, cam.z, 
      cam.lookAt.x, cam.lookAt.y, cam.lookAt.z, 
      0, 0, -1)
  }
  mousePrev = {
      x: mouseX - width/2, y: mouseY - height/2
  }
}

function arrow(x1, y1, z1, x2, y2, z2, thickness) {
  push()
    fill(0)
    noStroke()
    // translate(x1, y1, z1)
    translate(x1 + (x2-x1)/2, y1 + (y2-y1)/2, z1 + (z2-z1)/2)
    let phi = Math.atan2(z2-z1, Math.sqrt( (x2-x1)**2 + (y2 - y1)**2))
    let th = Math.atan2((y2 - y1), (x2 - x1))

    // Draw vector line
    push()
      rotateZ(th - Math.PI/2)
      rotateX(phi)
      cylinder(thickness, Math.sqrt((x2-x1)**2 + (y2-y1)**2 + (z2-z1)**2))
    pop()

    // Draw vector Arrow head
    translate((x2-x1)/2, (y2-y1)/2, (z2-z1)/2)
    rotateZ(th - Math.PI/2)
    rotateX(phi)
    fill(60)
    cone(5, 10)
  pop()
}

function drawCoordinates(thickness, len) {
  // 3D Coordinates
  push()
    noStroke()
    // X Axis
    push()
      fill(255, 0, 0)
      rotateZ(-Math.PI/2)
      translate(0, len/2, 0)
      cylinder(thickness, len)
      translate(0, len/2, 0)
      cone(5.95, 10)
    pop()

    // Y axis
    push()
      fill(0, 255, 0)
      translate(0, len/2, 0)
      cylinder(thickness, len)
      translate(0, len/2, 0)
      cone(5.95, 10)
    pop()

    // Z axis
    push()
      fill(0, 0, 255)
      rotateX(Math.PI/2)
      translate(0, len/2, 0)
      cylinder(thickness, len)
      translate(0, len/2, 0)
      cone(5.95, 10)
    pop()
  pop()
}


// Vector Math
function dotProd(a, b) {
  if(a.z && b.z){
    return (a.x * b.x + a.y * b.y + a.z * b.z)
  } else {
    return (a.x * b.x + a.y * b.y)
  }
}

function vecNormalize(v){
  let mag = vecMag(v)
  return {
    x: v.x / mag,
    y: v.y / mag,
    z: v.z / mag
  }
}

function crossProd(a, b){
  let xp = {
    x: a.y*b.z - a.z*b.y,
    y: a.z*b.x - a.x*b.z,
    z: a.x*b.y - a.y*b.x
  }
  return xp;
}

function scalarMult(s, v){
  return {x: s*v.x, y: s*v.y, z: s*v.z}
}

function vecMag(a){
  if(a.z) {
    return (Math.sqrt(a.x**2 + a.y**2 + a.z**2))
  } else {
    return (Math.sqrt(a.x**2 + a.y**2))
  }
}

function vecSub(a, b) {
  return {
    x: a.x - b.x, 
    y: a.y - b.y,
    z: a.z - b.z
  }
}

function vecAdd(a, b) {
  return {
    x: a.x + b.x, 
    y: a.y + b.y,
    z: a.z + b.z
  }
}

function thBetween(a, b){
  return Math.acos(  dotProd(a, b) / ( vecMag(a) * vecMag(b) )  )
}

function projectToPlane(v, n){
  let vProjN = scalarMult( dotProd(v, n) / (vecMag(n)**2) , n)
  return vecSub(v, vProjN)
}

function rgb2lab(rgb){
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      x, y, z;

  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
  // console.log((116 * y) - 16, 500 * (x - y), 200 * (y - z))
  
  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, l ];
}

function rgb2hsv (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return [h, s, v];
}

function easeInOutExpo(x) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
    : (2 - Math.pow(2, -20 * x + 10)) / 2;
}

function easeInOutQuad(x){
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function rgb(){
  if(frameCount > 100){
    frameCount = 0; 
    points = destPoints;
    destPoints = rgbPoints;
  }
}

function hsl(){
  if(frameCount > 100){
    frameCount = 0; 
    points = destPoints;
    destPoints = hslPoints;
  }
}

function hsb(){
  if(frameCount > 100){
    frameCount = 0; 
    points = destPoints;
    destPoints = hsbPoints;
  }
}

function lab(){
  if(frameCount > 100){
    frameCount = 0; 
    points = destPoints;
    destPoints = labPoints;
  }
}
