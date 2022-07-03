let sizeX, sizeY, sizeSelect=3
if(sizeSelect==0){
  sizeX = 400, sizeY = 400
}
else if(sizeSelect==2){
  sizeX = 800, sizeY = 800
}
else if(sizeSelect==3){
  sizeX = 1200, sizeY = 1200
}
else if(sizeSelect==4){
  sizeX = 1600, sizeY = 1600
}
// const sizeX = 800, sizeY = 800
const backgroundColor = 'rgb(1, 0, 1)'


class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  transform(matrix) {
    let x = this.x * matrix[0].x + this.y * matrix[1].x
    let y = this.x * matrix[0].y + this.y * matrix[1].y
    this.x = x
    this.y = y

    return this
  }
  add(vector) {
    this.x += vector.x
    this.y += vector.y
    return this
  }
  sub(vector) {
    this.x -= vector.x
    this.y -= vector.y
    return this
  }
  scale(scalar) {
    this.x *= scalar
    this.y *= scalar
    return this
  }
  scaled(scalar) {
    let x = this.x * scalar
    let y = this.y * scalar
    return new Vector(x, y)
  }
  transformed(matrix) {
    let x = this.x * matrix[0].x + this.y * matrix[1].x
    let y = this.x * matrix[0].y + this.y * matrix[1].y
    return new Vector(x, y)
  }
  get xA() {
    const a = (this.x * 20) + sizeX/2
    return a
  }
  get yA() {
    const a = -(this.y * 20) + sizeY/2
    return a
  }
  log() {
    console.log('x=', this.x, 'y=', this.y)
  }
}

let basis1 = [
  new Vector(1, 0),
  new Vector(0, 1)
]

let basis2 = [
  new Vector(1, -2),
  new Vector(3, 0)
]
let zoom=1

document.querySelector('#restartAnimation').addEventListener('click',()=>{
  animationProgress = 0
})
document.querySelector('#pauseAnimation').addEventListener('click',()=>{
  paused = true
})
document.querySelector('#playAnimation').addEventListener('click',()=>{
  paused = false
})
document.getElementById('applyMatrix1').addEventListener('click', () => {
  const x1 = int(document.querySelector('#m1ix').value)
  const y1 = int(document.querySelector('#m1iy').value)
  const x2 = int(document.querySelector('#m1jx').value)
  const y2 = int(document.querySelector('#m1jy').value)
  basis1 = [
    new Vector(x1,y1),
    new Vector(x2,y2)
  ]
})
document.getElementById('applyMatrix2').addEventListener('click', () => {
  const x1 = int(document.querySelector('#m2ix').value)
  const y1 = int(document.querySelector('#m2iy').value)
  const x2 = int(document.querySelector('#m2jx').value)
  const y2 = int(document.querySelector('#m2jy').value)
  basis2 = [
    new Vector(x1,y1),
    new Vector(x2,y2)
  ]
})
document.querySelector('#zoomOut').addEventListener('click',()=>{
  zoom /=2
})
document.querySelector('#zoomIn').addEventListener('click',()=>{
  zoom *=2
})

let paused = true;


const drawScaled = (v1, v2 = null) => {
  if (v2 === null) {
    const zeroV = new Vector(0, 0)
    line(zeroV.xA, zeroV.yA, v1.xA, v1.yA)
  }
  else {
    // console.log(relV(v1.x), relV(v1.y), relV(v2.x), relV(v2.y));
    line(v1.xA, v1.yA, v2.xA, v2.yA)
  }
}

const drawGrid = (basis, color = 'rgb(73, 210, 255)', increment = 2) => {
  stroke(color)
  for (let i = -200; i <= 200; i += increment) {

    const x1 = new Vector(400, i)
    const x2 = new Vector(-x1.x, ((x1.y / x1.x) * -x1.x) + 2 * i)
    x1.transform(basis)
    x2.transform(basis)

    const y1 = new Vector(i, -400)
    const y2 = new Vector(y1.x, -y1.y)
    y1.transform(basis)
    y2.transform(basis)

    // stroke('rgb(0,255,0)')
    drawScaled(x1, x2)
    // stroke('rgb(255,0,0)')
    drawScaled(y1, y2)
  }
}

const drawAxis = (basis, color = 'rgb(255, 255, 255)') => {
  stroke(color)
  const x1 = new Vector(400, 0)
  const x2 = new Vector(-x1.x, ((x1.y / x1.x) * -x1.x))
  x1.transform(basis)
  x2.transform(basis)

  const y1 = new Vector(0, -400)
  const y2 = new Vector(y1.x, -y1.y)
  y1.transform(basis)
  y2.transform(basis)


  // stroke('rgb(0,255,0)')
  drawScaled(x1, x2)
  // stroke('rgb(255,0,0)')
  drawScaled(y1, y2)
}
const drawHat = (basis, color1='rgb(0,255,0)', color2='rgb(255,0,0)') => {

  stroke(color1)
  drawScaled(basis[0])
  stroke(color2)
  drawScaled(basis[1])

}
function getRotationMatrix(radians) {
  return [
    new Vector(Math.cos(radians), -Math.sin(radians)),
    new Vector(Math.sin(radians), Math.cos(radians))
  ]
}

function transitionBetweenMatrices(m1, m2, progress) {
  return [
    new Vector(m1[0].x * (1 - progress) + m2[0].x * progress, m1[0].y * (1 - progress) + m2[0].y * progress),
    new Vector(m1[1].x * (1 - progress) + m2[1].x * progress, m1[1].y * (1 - progress) + m2[1].y * progress)

  ]
}

let a = new Vector(80, 80)
let b = new Vector(80, 80)
b.transform([
  new Vector(1, 0),
  new Vector(0, 1)
])

function setup() {
  createCanvas(sizeX, sizeX)
  background(backgroundColor)
}

let animationProgress = 0

function draw() {
  clear()
  background(backgroundColor)

  


  
  const tempBasis = transitionBetweenMatrices(basis1, basis2, animationProgress)
  tempBasis[0].scale(zoom)
  tempBasis[1].scale(zoom)
  // const tempBasis = transitionBetweenMatrices(basis1, getRotationMatrix(Math.PI / 2), animationProgress)
  // drawGrid(basis1, 'rgba(255, 255, 255,0.4)', 4)
  drawGrid(tempBasis, 'rgba(0,120,120,1)', 1)
  drawAxis(basis1)
  drawHat(tempBasis)

  if ((animationProgress < 1)&&(!paused)) animationProgress += 0.002


}