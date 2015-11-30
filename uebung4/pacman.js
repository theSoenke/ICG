const PI = Math.PI;

var radius = 0.2;
var numberOfVertices;

var numberToDraw = 2;

var centerVertex = new Float32Array([0, 0]);
var walk = new Float32Array([0, 0]);
var angle = 0.0;

var angleLoc;
var vCenterLoc;
var walkLoc;

window.onload = function pacman() {
  //numberOfVertices = parseInt(prompt("How many vertices should Pacman have?"));
  numberOfVertices = 32;

  // Get canvas and setup webGL

  var canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  // Specify position and color of the vertices

  var vertices = drawCircle();

  var colors = calculateNumberOfColors();

  // Configure viewport

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Init shader program and bind it

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  vCenterLoc = gl.getUniformLocation(program, "vCenter");
  angleLoc = gl.getUniformLocation(program, "angle");
  walkLoc = gl.getUniformLocation(program, "walk");


  // Load colors into the GPU and associate shader variables

  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  // Load positions into the GPU and associate shader variables

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  render();

  document.onkeydown = getKeyCode;
};

function getKeyCode(event) {
  event = event || window.event;
  var pressedKey = event.keyCode;
  var oneDegree = (2.0 * PI) / 360.0;

  switch (pressedKey) {
    case 37: //<
      angle += (2.0 * PI) / 360.0;
      gl.uniform1f(angleLoc, angle);
      break;
    case 38: //^
      if (walk[0] + Math.cos(angle) * 0.01 <= 1 || walk[1] + Math.sin(angle) * 0.01 <= 1) {
        var tx = walk[0] + Math.cos(angle) * 0.01;
        var ty = walk[1] + Math.sin(angle) * 0.01;

        if (checkCollision(tx, ty)) {
          walk = new Float32Array([tx, ty]);
          gl.uniform2fv(walkLoc, walk);
          centerVertex = new Float32Array([centerVertex[0] + Math.cos(angle) * 0.01, centerVertex[1] + Math.sin(angle) * 0.01, 0.0, 0.0]);
          gl.uniform3fv(vCenterLoc, centerVertex);
        }
      }
      break;
    case 39: //>
      angle -= (2.0 * PI) / 360.0;
      gl.uniform1f(angleLoc, angle);
      break;
    case 40: //v
      if (walk[0] - Math.cos(angle) * 0.01 >= -1 || walk[1] - Math.sin(angle) * 0.01 >= -1) {
        var tx = walk[0] - Math.cos(angle) * 0.01;
        var ty = walk[1] - Math.sin(angle) * 0.01;

        if (checkCollision(tx, ty)) {
          walk = new Float32Array([tx, ty]);
          gl.uniform2fv(walkLoc, walk);
          centerVertex = new Float32Array([centerVertex[0] - Math.cos(angle) * 0.01, centerVertex[1] - Math.sin(angle) * 0.01]);
          gl.uniform2fv(vCenterLoc, centerVertex);
        }
      }
      break;
  }
  render();

  return pressedKey;
}

function checkCollision(tx, ty) {
  if (Math.abs(tx) <= 0.8 && Math.abs(ty) <= 0.8) {
    return true;
  }
  return false;
}

function drawCircle() {
  var vertices = new Float32Array((numberOfVertices + 2) * 2);

  vertices[0] = 0;
  vertices[1] = 0;

  var steps = 2 / numberOfVertices;
  var multiplier = 0;

  for (var i = 2; i < vertices.length; i += 2) {
    if (multiplier * steps * PI >= 0.0 + 0.2 &&
      multiplier * steps * PI <= 2.0 * PI - 0.2) {
      vertices[i] = Math.cos(multiplier * steps * PI) * radius;
      vertices[i + 1] = Math.sin(multiplier * steps * PI) * radius;

      numberToDraw++;
    } else {
      vertices[i] = 0;
      vertices[i + 1] = 0;
    }

    multiplier++;
  }

  return vertices;
}

function calculateNumberOfColors() {
  var colors = new Float32Array((numberOfVertices + 2) * 4);

  for (var i = 0; i < colors.length; i += 4) {
    colors[i] = 1;
    colors[i + 1] = 1;
    colors[i + 2] = 0;
    colors[i + 3] = 1;
  }

  return colors;
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, numberToDraw);
  //requestAnimFrame(render);
}
