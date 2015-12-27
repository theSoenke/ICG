var gl;
var canvas;

var eye;
var target;
var up;

var modelMatrix;
var modelMatrixLoc;

var rotationY = 0.01;
var yAxis = vec3.fromValues(0, 1, 0);
var rotationX = 0.01;
var xAxis = vec3.fromValues(1, 0, 0);
var rotationZ = 0.01;
var zAxis = vec3.fromValues(0, 0, 1);

var projectionMatrix = mat4.create();
var projectionMatrixLoc;
var viewMatrix = mat4.create();
var viewMatrixLoc;

var lastMousePosX = 0;
var lastMousePosY = 0;

var objects = [];

window.onload = function init() {
  // Get canvas and setup webGL

  canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);

  // Configure viewport

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Init shader programs

  defaultProgram = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(defaultProgram);

  // Create beach
  var beachStr = document.getElementById("plane.obj").innerHTML;
  beachMesh = new OBJ.Mesh(beachStr);
  OBJ.initMeshBuffers(gl, beachMesh);

  var beachObject = new RenderObject(
    mat4.create(),
    vec4.fromValues(1, 1, 0, 1),
    defaultProgram,
    beachMesh.vertexBuffer,
    beachMesh.indexBuffer.numItems);

  mat4.translate(beachObject.transform, beachObject.transform, vec3.fromValues(25, -3, -30));
  mat4.scale(beachObject.transform, beachObject.transform, vec3.fromValues(10, 1, 10));
  beachObject.indexBuffer = beachMesh.indexBuffer;

  objects.push(beachObject);


  // Create water
  var waterStr = document.getElementById("plane.obj").innerHTML;
  waterMesh = new OBJ.Mesh(waterStr);
  OBJ.initMeshBuffers(gl, waterMesh);

  var waterObject = new RenderObject(
    mat4.create(),
    vec4.fromValues(0, 0, 1, 1),
    defaultProgram,
    waterMesh.vertexBuffer,
    waterMesh.indexBuffer.numItems);

  mat4.translate(waterObject.transform, waterObject.transform, vec3.fromValues(200, -3.1, -50));
  mat4.scale(waterObject.transform, waterObject.transform, vec3.fromValues(100, 1, 20));
  waterObject.indexBuffer = waterMesh.indexBuffer;

  objects.push(waterObject);

  // Create cylinder
  var cylinderString = document.getElementById("cylinder.obj").innerHTML;
  cylinderMesh = new OBJ.Mesh(cylinderString);
  OBJ.initMeshBuffers(gl, cylinderMesh);

  var cylinderObject = new RenderObject(
    mat4.create(),
    vec4.fromValues(1, 0, 1, 1),
    defaultProgram,
    cylinderMesh.vertexBuffer,
    cylinderMesh.indexBuffer.numItems);

  mat4.translate(cylinderObject.transform, cylinderObject.transform, vec3.fromValues(4, 0, 0));
  cylinderObject.indexBuffer = cylinderMesh.indexBuffer;

  objects.push(cylinderObject);


  // Setup projectionMatrix (perspective)*/
  modelMatrix = mat4.create();

  rotationY = Math.PI * 0.25;
  mat4.rotate(modelMatrix, modelMatrix, rotationY, yAxis);
  rotationX = Math.PI * 0.25;
  mat4.rotate(modelMatrix, modelMatrix, rotationX, xAxis);
  rotationZ = Math.PI * 0.5;
  mat4.rotate(modelMatrix, modelMatrix, rotationZ, zAxis);

  modelMatrixLoc = gl.getUniformLocation(defaultProgram, "modelMatrix");
  gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);

  // Set and load projectionMatrix (perspective)

  var fovy = Math.PI * 0.25; // 90 degrees
  var aspectRatio = canvas.width / canvas.height;
  var nearClippingPlane = 0.5;
  var farClippingPlane = 10;
  mat4.perspective(projectionMatrix, fovy, aspectRatio, nearClippingPlane, farClippingPlane);

  projectionMatrixLoc = gl.getUniformLocation(defaultProgram, "projectionMatrix");
  gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);

  //set and load viewMatrix (camera)

  eye = vec3.fromValues(0.0, 0.0, 3.0);
  target = vec3.fromValues(0.0, 0.0, -5.0);
  up = vec3.fromValues(0.0, 1.0, 0.0);

  mat4.lookAt(viewMatrix, eye, target, up);

  viewMatrixLoc = gl.getUniformLocation(defaultProgram, "viewMatrix");
  gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

  // Bind input events to functions
  document.onkeydown = handleKeyDown;
  document.onmousemove = handleMouseMove;
  lastMousePosX = canvas.width / 2;
  lastMousePosY = canvas.height / 2;

  render();
};

var RenderObject = function(transform, color, shader, buffer, bufferLength) {
  this.transform = transform;
  this.color = color;
  this.shader = shader;
  this.buffer = buffer;
  this.bufferLength = bufferLength;
  this.indexBuffer;

  this.rotationY = 0.01;
  this.rotationX = 0.01;
  this.rotationZ = 0.01;
}

function render() {

  rotationY = 0.01;
  mat4.rotate(modelMatrix, modelMatrix, rotationY, yAxis);
  rotationX = 0.01;
  mat4.rotate(modelMatrix, modelMatrix, rotationX, xAxis);
  rotationZ = 0.01;
  mat4.rotate(modelMatrix, modelMatrix, rotationZ, zAxis);
  gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Set shader program
  gl.useProgram(defaultProgram);
  projectionMatrixLoc = gl.getUniformLocation(defaultProgram, "projectionMatrix");
  viewMatrixLoc = gl.getUniformLocation(defaultProgram, "viewMatrix");
  modelMatrixLoc = gl.getUniformLocation(defaultProgram, "modelMatrix");
  colorLoc = gl.getUniformLocation(defaultProgram, "objectColor");


  objects.forEach(function(object) {

    // Set attribute
    var vPosition = gl.getAttribLocation(object.shader, "vPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Set uniforms
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
    gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc, false, object.transform);
    gl.uniform4fv(colorLoc, object.color);

    // Draw
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indexBuffer);
    gl.drawElements(gl.TRIANGLES, object.bufferLength, gl.UNSIGNED_SHORT, 0);
  });

  requestAnimFrame(render);
}

function handleKeyDown(event) {
  // Extract view direction for xz plane
  var viewDirection = vec3.fromValues(target[0], 0, target[2]);
  vec3.normalize(viewDirection, viewDirection);

  // Compute strafe direction
  var strafeDirection = vec3.create();
  vec3.cross(strafeDirection, viewDirection, up);

  // Up
  if (String.fromCharCode(event.keyCode) == 'W') {
    // Add view direction to eye position AND to target
    vec3.add(eye, eye, viewDirection);
    vec3.add(target, target, viewDirection);
    mat4.lookAt(viewMatrix, eye, target, up);

    gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
  }
  // Down
  if (String.fromCharCode(event.keyCode) == 'S') {
    // Subtract view direction to eye position AND to target
    vec3.subtract(eye, eye, viewDirection);
    vec3.subtract(target, target, viewDirection);
    mat4.lookAt(viewMatrix, eye, target, up);

    gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
  }
  // Right
  if (String.fromCharCode(event.keyCode) == 'D') {
    // Add strafe direction to eye position AND to target
    vec3.add(eye, eye, strafeDirection);
    vec3.add(target, target, strafeDirection);
    mat4.lookAt(viewMatrix, eye, target, up);

    gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
  }
  // Left
  if (String.fromCharCode(event.keyCode) == 'A') {
    // Subtract strafe direction to eye position AND to target
    vec3.subtract(eye, eye, strafeDirection);
    vec3.subtract(target, target, strafeDirection);
    mat4.lookAt(viewMatrix, eye, target, up);

    gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
  }
}

function handleMouseMove(event) {
  // Remove the offset of the canvas rectangle from mouse coordinates
  var x = event.clientX - canvas.getBoundingClientRect().left;
  var y = event.clientY - canvas.getBoundingClientRect().top;

  var newX = lastMousePosX - x;
  lastMousePosX = x;

  var newY = lastMousePosY - y;
  lastMousePosY = y;

  var normedX = normValue(newX, -canvas.width, canvas.width, -2, 2);
  var normedY = normValue(newY, -canvas.height, canvas.height, -0.5, 0.5);

  vec3.rotateY(target, target, eye, normedX * Math.PI);
  vec3.rotateX(target, target, eye, normedY * Math.PI);

  mat4.lookAt(viewMatrix, eye, target, up);

  gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
}

/* Norms a value to an intervall */
function normValue(value, valueMin, valueMax, resultMin, resultMax) {
  return (value - valueMin) * ((resultMax - resultMin) / (valueMax - valueMin)) + resultMin;
}
