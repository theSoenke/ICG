var gl;
var canvas;

var eye;
var target;
var up;

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
  var fovy = Math.PI * 0.25; // 90 degrees
  var aspectRatio = canvas.width / canvas.height;
  var nearClippingPlane = 0.5;
  var farClippingPlane = 100;

  projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, fovy, aspectRatio, nearClippingPlane, farClippingPlane);

  //setup viewMatrix (camera)

  eye = vec3.fromValues(-10.0, 1.0, -10.0);
  target = vec3.fromValues(5.0, 1.0, 5.0);
  up = vec3.fromValues(0.0, 1.0, 0.0);

  viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, eye, target, up);

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
