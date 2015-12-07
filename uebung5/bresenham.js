var canvas;
var size = 10;
var fieldStart = [];
var fieldEnd = [];
var numVertices;

window.onload = function pacman() {
  // Get canvas and setup webGL

  canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  // Specify position and color of the vertices

  var vertices = rasterize(size);
  numVertices = size * 12 - 12;

  // Configure viewport

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Init shader program and bind it

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Load positions into the GPU and associate shader variables

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  canvas.addEventListener("mousedown", mouseDown);
  canvas.addEventListener("mouseup", mouseUp);

  render();
};

function mouseDown(e) {
  fieldStart = getField(e.offsetX, e.offsetY);
}

function mouseUp(e) {
  fieldEnd = getField(e.offsetX, e.offsetY);
}

function rasterize(size) {
  var vertices = [];
  var fieldSize = canvas.width / size;

  for (var i = 1; i < size; i++) {
    var posY = normValue(i * fieldSize, 0, canvas.height, -1.0, 1.0);
    vertices.push(-1.0);
    vertices.push(posY);
    vertices.push(1.0);
    vertices.push(posY);
    vertices.push(1.0);
    vertices.push(posY - 0.01);

    vertices.push(-1.0);
    vertices.push(posY);
    vertices.push(-1.0);
    vertices.push(posY - 0.01);
    vertices.push(1.0);
    vertices.push(posY - 0.01);
  }

  for (var i = 1; i < size; i++) {
    var posX = normValue(i * fieldSize, 0, canvas.width, -1.0, 1.0);
    vertices.push(posX);
    vertices.push(-1.0);
    vertices.push(posX);
    vertices.push(1.0);
    vertices.push(posX - 0.01);
    vertices.push(1.0);

    vertices.push(posX);
    vertices.push(-1.0);
    vertices.push(posX - 0.01);
    vertices.push(-1.0);
    vertices.push(posX - 0.01);
    vertices.push(1.0);
  }

  return new Float32Array(vertices);
}

function getField(posX, posY) {
  var fieldSize = canvas.width / size;

  posX = parseInt(posX / fieldSize);
  posY = parseInt(posY / fieldSize);
  console.log("x: " + posX + " y: " + posY);

  return {
    x: posX,
    y: posY
  };
}

function normValue(value, valueMin, valueMax, resultMin, resultMax) {
  return (((value - valueMin) / (valueMax - valueMin)) *
    (resultMax - resultMin) + resultMin);
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
  //requestAnimFrame(render);
}
