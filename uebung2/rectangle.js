var gl;
var mouseDown;
var mouseUp;
var program;

window.onload = function init() {
  // Get canvas and setup webGL
  var canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  // Configure viewport
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1.0);

  // Init shader program and bind it
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var colors = new Float32Array([1, 1, 1, 1,
    1, 1, 1, 1,
    1, 1, 1, 1,
    1, 1, 1, 1
  ]);

  setColorBuffer(colors);

  // add listener
  canvas.addEventListener("mousedown", eventMouseDown);
  canvas.addEventListener("mouseup", eventMouseUp);
  window.addEventListener("keypress", setColor);

  render();
};

function eventMouseDown(e) {
  mouseDown = e;
}

function eventMouseUp(e) {
  mouseUp = e;
  drawRectangle();
}

function drawRectangle() {
  var vertices = new Float32Array([
    normPos(mouseDown.clientX), normPos(mouseDown.clientY),
    normPos(mouseDown.clientX), normPos(mouseUp.clientY),
    normPos(mouseUp.clientX), normPos(mouseDown.clientY),
    normPos(mouseUp.clientX), normPos(-mouseUp.clientY)
  ]);

  console.log(vertices);

  var colors = new Float32Array([1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1,
    1, 1, 0, 1
  ]);

  setVerticesBuffer(vertices)
}

function setColor(e) {
  var colors;

  if (e.key.toLowerCase() == "r") {
    colors = new Float32Array([1, 0, 0, 1,
      1, 0, 0, 1,
      1, 0, 0, 1,
      1, 0, 0, 1
    ]);
  } else if (e.key.toLowerCase() == "g") {
    colors = new Float32Array([0, 1, 0, 1,
      0, 1, 0, 1,
      0, 1, 0, 1,
      0, 1, 0, 1
    ]);
  } else if (e.key.toLowerCase() == "b") {
    colors = new Float32Array([0, 0, 1, 1,
      0, 0, 1, 1,
      0, 0, 1, 1,
      0, 0, 1, 1
    ]);
  } else {
    colors = new Float32Array([1, 1, 1, 1,
      1, 1, 1, 1,
      1, 1, 1, 1,
      1, 1, 1, 1
    ]);
  }

  setColorBuffer(colors);
}

function setVerticesBuffer(vertices) {
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
}

function setColorBuffer(colors) {
  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);
}

function normPos(value) {
  return normValue(value, 0, 512, -1, 1);
}

function normValue(value, valueMin, valueMax, resultMin, resultMax) {
  value = Math.abs(value) - (valueMax / 2);

  return ((((value) - (valueMin)) / ((valueMax) - (valueMin))) *
    (((resultMax) - (resultMin)) + (resultMin)));
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  requestAnimFrame(render);
}
