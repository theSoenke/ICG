var gl;
var canvas;

var eye;
var target;
var up;

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

  // Create cube
  var cubeString = document.getElementById("cube.obj").innerHTML;
  cubeMesh = new OBJ.Mesh(cubeString);
  OBJ.initMeshBuffers(gl, cubeMesh);

  cubeModelMatrix = mat4.create();

  // Create beach
  var beachStr = document.getElementById("plane.obj").innerHTML;
  beachMesh = new OBJ.Mesh(beachStr);
  OBJ.initMeshBuffers(gl, beachMesh);

  beachModelMatrix = mat4.create();
	mat4.translate(beachModelMatrix, beachModelMatrix, vec3.fromValues(25, -3, -30));
	mat4.scale(beachModelMatrix, beachModelMatrix, vec3.fromValues(10, 1, 10));

	// Create water
	waterMesh = new OBJ.Mesh(beachStr);
	OBJ.initMeshBuffers(gl, waterMesh);

	waterModelMatrix = mat4.create();
	mat4.translate(waterModelMatrix, waterModelMatrix, vec3.fromValues(200, -3.1, -50));
	mat4.scale(waterModelMatrix, waterModelMatrix, vec3.fromValues(100, 1, 20));


  // Create cylinder
  var cylinderString = document.getElementById("cylinder.obj").innerHTML;
  cylinderMesh = new OBJ.Mesh(cylinderString);
  OBJ.initMeshBuffers(gl, cylinderMesh);

  cylinderModelMatrix = mat4.create();
  mat4.translate(cylinderModelMatrix, cylinderModelMatrix, vec3.fromValues(4, 0, 0));

  // Setup projectionMatrix (perspective)

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

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Set shader program
  gl.useProgram(defaultProgram);
  projectionMatrixLoc = gl.getUniformLocation(defaultProgram, "projectionMatrix");
  viewMatrixLoc = gl.getUniformLocation(defaultProgram, "viewMatrix");
  modelMatrixLoc = gl.getUniformLocation(defaultProgram, "modelMatrix");
  colorLoc = gl.getUniformLocation(defaultProgram, "objectColor");

  // Set attribute
  var vPosition = gl.getAttribLocation(defaultProgram, "vPosition");
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeMesh.vertexBuffer);
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Set uniforms
  gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
  gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
  gl.uniformMatrix4fv(modelMatrixLoc, false, cubeModelMatrix);
  gl.uniform4fv(colorLoc, vec4.fromValues(0, 1, 0, 1));

  // Draw
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeMesh.indexBuffer);
  gl.drawElements(gl.TRIANGLES, cubeMesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  // Set attribute
  var vPosition2 = gl.getAttribLocation(defaultProgram, "vPosition");
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderMesh.vertexBuffer);
  gl.vertexAttribPointer(vPosition2, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition2);

  // Set uniforms
  gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
  gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
  gl.uniformMatrix4fv(modelMatrixLoc, false, cylinderModelMatrix);
  gl.uniform4fv(colorLoc, vec4.fromValues(1, 0, 0, 1));

  // Draw
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderMesh.indexBuffer);
  gl.drawElements(gl.TRIANGLES, cylinderMesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);


  // Set attribute
  var vPosition3 = gl.getAttribLocation(defaultProgram, "vPosition");
  gl.bindBuffer(gl.ARRAY_BUFFER, beachMesh.vertexBuffer);
  gl.vertexAttribPointer(vPosition3, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition3);

  // Set uniforms
  gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
  gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
  gl.uniformMatrix4fv(modelMatrixLoc, false, beachModelMatrix);
  gl.uniform4fv(colorLoc, vec4.fromValues(1, 1, 0, 1));

  // Draw
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, beachMesh.indexBuffer);
  gl.drawElements(gl.TRIANGLES, beachMesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);


	// Set attribute
  var vPosition3 = gl.getAttribLocation(defaultProgram, "vPosition");
  gl.bindBuffer(gl.ARRAY_BUFFER, waterMesh.vertexBuffer);
  gl.vertexAttribPointer(vPosition3, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition3);

  // Set uniforms
  gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
  gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
  gl.uniformMatrix4fv(modelMatrixLoc, false, waterModelMatrix);
  gl.uniform4fv(colorLoc, vec4.fromValues(0, 0, 1, 1));

  // Draw
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, waterMesh.indexBuffer);
  gl.drawElements(gl.TRIANGLES, waterMesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);


  requestAnimFrame(render);
}
