var gl;
var program;

var mouseDownX;
var mouseDownY;

var mouseUpX;
var mouseUpY;

window.onload = function init() {
  // Get canvas and setup webGL

  var canvas = document.getElementById("gl-canvas");
  canvas.addEventListener("mousedown", mouseDown);
  canvas.addEventListener("mouseup", mouseUp);
  document.addEventListener("keypress", changeColor);

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }


  // Configure viewport

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Init shader program and bind it

  program = initShaders(gl, "vertex-shader", "fragment-shader");

  gl.useProgram(program);

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimFrame(render);
}

function normValue(value, valueMin, valueMax, resultMin, resultMax) // 212, 0, 512, -1, 1
{
  return (((value - valueMin) / (valueMax - valueMin)) * (resultMax - resultMin) + resultMin);
}

function normColor(value){
	return normValue(value, 0, 255, 0.0, 1.0);
}

function mouseDown(event) {
  console.log("mouseDown: start");
  console.log("x:" + event.offsetX + ", y:" + event.offsetY);
  mouseDownX = normValue(event.offsetX, 0, 512, -1, 1);
  mouseDownY = normValue(event.offsetY, 0, 512, -1, 1);
  mouseDownY = mouseDownY * (-1);
  console.log("x:" + mouseDownX + ", y:" + mouseDownY);
}

function mouseUp(event) {
  console.log("mouseUp: start");
  console.log("x:" + event.offsetX + ", y:" + event.offsetY);
  mouseUpX = normValue(event.offsetX, 0, 512, -1, 1);
  mouseUpY = normValue(event.offsetY, 0, 512, -1, 1);
  mouseUpY = mouseUpY * (-1);
  console.log("x:" + mouseDownX + ", y:" + mouseDownY);
  renderSquare();
}

function changeColor(e) {
	console.log("changeColor: start");
  var colors;

  if (e.which == 82 || e.which == 114) {
    colors = new Float32Array([1, 0, 0, 1,
      1, 0, 0, 1,
      1, 0, 0, 1,
      1, 0, 0, 1
    ]);
  } else if (e.which == 103 || e.which == 71) {
    colors = new Float32Array([0, 1, 0, 1,
      0, 1, 0, 1,
      0, 1, 0, 1,
      0, 1, 0, 1
    ]);
  } else if (e.which == 98 || e.which == 66) {
    colors = new Float32Array([0, 0, 1, 1,
      0, 0, 1, 1,
      0, 0, 1, 1,
      0, 0, 1, 1
    ]);
  } else {
  	return;
  }

  setColorBuffer(colors);
}

function renderSquare() {
  if ((mouseUpX > mouseDownX && mouseUpY > mouseDownY) || (mouseUpX < mouseDownX && mouseUpY < mouseDownY)) {
    var vertices = new Float32Array([mouseDownX, mouseDownY,
      mouseUpX, mouseDownY,
      mouseDownX, mouseUpY,
      mouseUpX, mouseUpY
    ]);
  } else {
    var vertices = new Float32Array([mouseDownX, mouseDownY,
      mouseDownX, mouseUpY,
      mouseUpX, mouseDownY,
      mouseUpX, mouseUpY
    ]);
  }

  // Load positions into the GPU and associate shader variables
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
}

function setColorBuffer(colors) {
  // Load colors into the GPU and associate shader variables
  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);
}
