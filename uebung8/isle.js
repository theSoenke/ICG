var gl;
var canvas;

var eye;
var lookAt;
var up;
var front;
var behind;
var left;
var right;

var fovy = Math.PI * 0.25; // 90 degrees
var aspectRatio;
var nearClippingPlane = 0.5;
var farClippingPlane = 100;

var waterAkk;

var objects = [];

var RenderObject = function(name, transform, shader, positionBuffer, normalBuffer, bufferLength, diffCoef, specCoef)
{
	this.name = name;
	this.transform = transform;
	this.shader = shader;
	this.positionBuffer = positionBuffer;
	this.normalBuffer = normalBuffer;
	this.bufferLength = bufferLength;
	this.indexBuffer;
	this.specCoef = specCoef;
	this.diffCoef = diffCoef;
	
	this.rotationY = 0.01;
	this.rotationX = 0.01;
	this.rotationZ = 0.01;
}

RenderObject.prototype.rotate = function(angle, axis) 
{
	mat4.rotate(this.transform, this.transform, angle, axis);
}

RenderObject.prototype.translate = function(vector)
{
	mat4.translate(this.transform, this.transform, vector);
}

window.onload = function init()
{
	// Get canvas and setup webGL
	waterAkk = 0;
	canvas = document.getElementById("gl-canvas");
	document.addEventListener("keydown", handleKeyPress);
	document.addEventListener("click", handleClick);
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }
	
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);

	// Configure viewport

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

	// Init shader programs

	var defaultProgram = initShaders(gl, "vertex-shader", "fragment-shader");
	var waterProgram = initShaders(gl, "water-vertex-shader", "water-fragment-shader");
	
	//// Würfel ////
	var cubeString = document.getElementById("cube.obj").innerHTML;
	cubeMesh = new OBJ.Mesh(cubeString);
	OBJ.initMeshBuffers(gl, cubeMesh);
	var cubeNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
	var cubeNormals = cubeMesh.vertexNormals;
	gl.bufferData(gl.ARRAY_BUFFER, cubeNormals, gl.STATIC_DRAW);
	var cubeDiffCoef = new Float32Array([0.5, 0.5, 1.0]);
	var cubeSpecCoef = new Float32Array([0.7, 0.7, 0.7]);
	// Create Cube
	var cubeObject = new RenderObject("cube", mat4.create(), defaultProgram, cubeMesh.vertexBuffer, cubeNormalBuffer, cubeMesh.indexBuffer.numItems, cubeDiffCoef, cubeSpecCoef);
	cubeObject.indexBuffer = cubeMesh.indexBuffer;

	mat4.scale(cubeObject.transform, cubeObject.transform, [-0.5, -0.5, -0.5]);
	
	// Push object on the stack
	objects.push(cubeObject);

	//// INSEL ////
	var isleString = document.getElementById("isle.obj").innerHTML;
	isleMesh = new OBJ.Mesh(isleString);
	OBJ.initMeshBuffers(gl, isleMesh);
	var isleNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, isleNormalBuffer);
	var isleNormals = isleMesh.vertexNormals;
	gl.bufferData(gl.ARRAY_BUFFER, isleNormals, gl.STATIC_DRAW);
	var isleDiffCoef = new Float32Array([0.0, 1.0, 0.0]);
	var isleSpecCoef = new Float32Array([1.0, 1.0, 1.0]);

	// Create Isle
	var isleObject = new RenderObject("isle", mat4.create(), defaultProgram, isleMesh.vertexBuffer, isleNormalBuffer, isleMesh.indexBuffer.numItems, isleDiffCoef, isleSpecCoef);
	isleObject.indexBuffer = isleMesh.indexBuffer;
	
	// Push object on the stack
	objects.push(isleObject);

	//// WASSER ////
	var waterString = document.getElementById("water.obj").innerHTML;
	waterMesh = new OBJ.Mesh(waterString);
	OBJ.initMeshBuffers(gl, waterMesh);
	var waterNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, waterNormalBuffer);
	var waterNormals = waterMesh.vertexNormals;
	gl.bufferData(gl.ARRAY_BUFFER, waterNormals, gl.STATIC_DRAW);
	var waterDiffCoef = new Float32Array([0.1, 0.1, 1.0]);
	var waterSpecCoef = new Float32Array([1.0, 1.0, 1.0]);

	// Create Isle
	var waterObject = new RenderObject("water", mat4.create(), waterProgram, waterMesh.vertexBuffer, waterNormalBuffer, waterMesh.indexBuffer.numItems, waterDiffCoef, waterSpecCoef);
	waterObject.indexBuffer = waterMesh.indexBuffer;

	mat4.scale(waterObject.transform, waterObject.transform, [5.0, 1.0, 5.0]);
	mat4.translate(waterObject.transform, waterObject.transform, [0.0, -2.0, 0.0]);
	
	// Push object on the stack
	objects.push(waterObject);

	//// PALME 1 ////
	var palm1String = document.getElementById("palm.obj").innerHTML;
	palm1Mesh = new OBJ.Mesh(palm1String);
	OBJ.initMeshBuffers(gl, palm1Mesh);
	var palm1NormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, palm1NormalBuffer);
	var palm1Normals = palm1Mesh.vertexNormals;
	gl.bufferData(gl.ARRAY_BUFFER, palm1Normals, gl.STATIC_DRAW);
	var palmDiffCoef = new Float32Array([0.7, 0.6, 0.1]);
	var palmSpecCoef = new Float32Array([0.7, 0.6, 0.1]);

	// Create Palm
	var palm1Object = new RenderObject("palm1", mat4.create(), defaultProgram, palm1Mesh.vertexBuffer, palm1NormalBuffer, palm1Mesh.indexBuffer.numItems, palmDiffCoef, palmSpecCoef);
	palm1Object.indexBuffer = palm1Mesh.indexBuffer;

	mat4.rotateX(palm1Object.transform, palm1Object.transform, grad2Bogen(-90));
	mat4.translate(palm1Object.transform, palm1Object.transform, [3.5, 3.5, 0.4]);
	
	// Push object on the stack
	objects.push(palm1Object);

	//// PALME 2 ////
	palm2Mesh = new OBJ.Mesh(palm1String);
	OBJ.initMeshBuffers(gl, palm2Mesh);
	var palm2NormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, palm2NormalBuffer);
	var palm2Normals = palm2Mesh.vertexNormals;
	gl.bufferData(gl.ARRAY_BUFFER, palm2Normals, gl.STATIC_DRAW);

	// Create Palm
	var palm2Object = new RenderObject("palm2", mat4.create(), defaultProgram, palm2Mesh.vertexBuffer, palm2NormalBuffer, palm2Mesh.indexBuffer.numItems, palmDiffCoef, palmSpecCoef);
	palm2Object.indexBuffer = palm2Mesh.indexBuffer;

	mat4.rotateX(palm2Object.transform, palm2Object.transform, grad2Bogen(-90));
	mat4.translate(palm2Object.transform, palm2Object.transform, [-3.5, 3.5, 0.4]);
	
	// Push object on the stack
	objects.push(palm2Object);

	//// PALME 3 ////
	palm3Mesh = new OBJ.Mesh(palm1String);
	OBJ.initMeshBuffers(gl, palm3Mesh);
	var palm3NormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, palm3NormalBuffer);
	var palm3Normals = palm3Mesh.vertexNormals;
	gl.bufferData(gl.ARRAY_BUFFER, palm3Normals, gl.STATIC_DRAW);

	// Create Palm
	var palm3Object = new RenderObject("palm3", mat4.create(), defaultProgram, palm3Mesh.vertexBuffer, palm3NormalBuffer, palm3Mesh.indexBuffer.numItems, palmDiffCoef, palmSpecCoef);
	palm3Object.indexBuffer = palm3Mesh.indexBuffer;

	mat4.rotateX(palm3Object.transform, palm3Object.transform, grad2Bogen(-90));
	mat4.translate(palm3Object.transform, palm3Object.transform, [-3.5, -3.5, 0.4]);
	
	// Push object on the stack
	objects.push(palm3Object);

	//// PALME 4 ////
	palm4Mesh = new OBJ.Mesh(palm1String);
	OBJ.initMeshBuffers(gl, palm4Mesh);
	var palm4NormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, palm4NormalBuffer);
	var palm4Normals = palm4Mesh.vertexNormals;
	gl.bufferData(gl.ARRAY_BUFFER, palm4Normals, gl.STATIC_DRAW);

	// Create Palm
	var palm4Object = new RenderObject("palm4", mat4.create(), defaultProgram, palm4Mesh.vertexBuffer, palm4NormalBuffer, palm4Mesh.indexBuffer.numItems, palmDiffCoef, palmSpecCoef);
	palm4Object.indexBuffer = palm4Mesh.indexBuffer;

	mat4.rotateX(palm4Object.transform, palm4Object.transform, grad2Bogen(-90));
	mat4.translate(palm4Object.transform, palm4Object.transform, [3.5, -3.5, 0.4]);
	
	// Push object on the stack
	objects.push(palm4Object);
	
	// Setup projectionMatrix (perspective)
	
	aspectRatio = canvas.width / canvas.height;
	
	projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, fovy, aspectRatio, nearClippingPlane, farClippingPlane);
	
	//setup viewMatrix (camera)

	eye = vec3.fromValues(0.0, 0.0, 5.0);
	lookAt = vec3.fromValues(0.0, 0.0, 4.0);
	front = vec3.fromValues(0.0, 0.0, -0.1);
	behind = vec3.fromValues(0.0, 0.0, 0.1);
	left = vec3.fromValues(-0.1, 0.0, 0.0);
	right = vec3.fromValues(0.1, 0.0, 0.0);
	up = vec3.fromValues(0.0, 1.0, 0.0);

	viewMatrix = mat4.create();
	mat4.lookAt(viewMatrix, eye, lookAt, up);
    
	render();
};

function render()
{	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	objects.forEach(function(object) {
		if (object.name == "cube") {
			object.rotate(grad2Bogen(1), [1.0, 1.0, 1.0]);
		}
		// Set shader program
		gl.useProgram(object.shader);

		if (object.name == "water") {
			if (waterAkk+0.02 == 360.0) {
				waterAkk = 0.0;
			}
			var waterAkkLoc = gl.getUniformLocation(object.shader, "akk");
			gl.uniform1f(waterAkkLoc, waterAkk);
			waterAkk = waterAkk + 0.02;
		}

		projectionMatrixLoc = gl.getUniformLocation(object.shader, "projectionMatrix");
		viewMatrixLoc = gl.getUniformLocation(object.shader, "viewMatrix");
		modelMatrixLoc = gl.getUniformLocation(object.shader, "modelMatrix");
		diffCoefLoc = gl.getUniformLocation(object.shader, "kd");
		specCoefLoc = gl.getUniformLocation(object.shader, "ks");

		// Set attribute
		var vPosition = gl.getAttribLocation(object.shader, "vPosition");
		gl.bindBuffer(gl.ARRAY_BUFFER, object.positionBuffer);
		gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);

		var vNormal = gl.getAttribLocation(object.shader, "vNormal");
		gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
		gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vNormal);
		
		// Set uniforms
		gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
		gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
		gl.uniformMatrix4fv(modelMatrixLoc, false, object.transform);
		gl.uniform3f(diffCoefLoc, object.diffCoef[0], object.diffCoef[1], object.diffCoef[2]);
		gl.uniform3f(specCoefLoc, object.specCoef[0], object.specCoef[1], object.specCoef[2]);

		// Draw
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indexBuffer);
		gl.drawElements(gl.TRIANGLES, object.bufferLength, gl.UNSIGNED_SHORT, 0);
	});
	
	requestAnimFrame(render);
}

function handleKeyPress(e)
{
	switch(e.keyCode)
	{
		case 65: //a
			vec3.add(eye, eye, left);
			vec3.add(lookAt, lookAt, left);
			mat4.lookAt(viewMatrix, eye, lookAt, up);
			break;
		case 87: //w
			vec3.add(eye, eye, front);
			vec3.add(lookAt, lookAt, front);
			mat4.lookAt(viewMatrix, eye, lookAt, up);
			break;
		case 68: //d
			vec3.add(eye, eye, right);
			vec3.add(lookAt, lookAt, right);
			mat4.lookAt(viewMatrix, eye, lookAt, up);
			break;
		case 83: //s
			vec3.add(eye, eye, behind);
			vec3.add(lookAt, lookAt, behind);
			mat4.lookAt(viewMatrix, eye, lookAt, up);
			break;
	}
}

function handleMouse(e)
{	
	console.log("x: "+e.movementX+", y: "+e.movementY);
	vec3.rotateY(lookAt ,lookAt, eye, -e.movementX * 0.05 * Math.PI / 180);
	vec3.rotateX(lookAt ,lookAt, eye, -e.movementY * 0.05 * Math.PI / 180);

	vec3.rotateY(front, front, [0.0, 0.0, 0.0], -e.movementX * 0.05 * Math.PI / 180);
	vec3.rotateY(behind, behind, [0.0, 0.0, 0.0], -e.movementX * 0.05 * Math.PI / 180);
	vec3.rotateY(left, left, [0.0, 0.0, 0.0], -e.movementX * 0.05 * Math.PI / 180);
	vec3.rotateY(right, right, [0.0, 0.0, 0.0], -e.movementX * 0.05 * Math.PI / 180);
	
	mat4.lookAt(viewMatrix,eye,lookAt,up);
}

function plChange(e)
{
	if (document.pointerLockElement == canvas)
	{
		document.addEventListener("mousemove", handleMouse);
	}
	else
	{
		document.removeEventListener("mousemove", handleMouse);
	}
}

function handleClick(e)
{
	canvas.requestPointerLock();
	document.addEventListener("pointerlockchange", plChange);
}


/* Norms a value to an intervall */
function normValue(value, valueMin, valueMax, resultMin, resultMax)
{
	return (value - valueMin) * ((resultMax - resultMin) / (valueMax - valueMin)) + resultMin;
}

function grad2Bogen(alpha) {
	return ((2*Math.PI)/360.0)*alpha;
}

function generateRandomColors(akk) {
	var colorArray = [];
	for (var i = 0; i < akk; i++) {
		colorArray.push(Math.random(), Math.random(), Math.random(), 1.0);
	}
	return new Float32Array(colorArray);
}

function generatePalmColors(akk) {
	var colorArray = [];
	for (var i = 0; i < akk; i++) {
		var red = Math.random();
		while (red < 0.5) {
			red = Math.random();
		}
		
		colorArray.push(red, 0.6, 0.1, 1.0);
	}
	return new Float32Array(colorArray);
}

function generateWaterColors(akk) {
	var colorArray = [];
	for (var i = 0; i < akk; i++) {
		var blue = Math.random();
		while (blue > 0.2) {
			blue = Math.random();
		}
		
		colorArray.push(blue, blue, 1.0, 0.7);
	}
	return new Float32Array(colorArray);
}