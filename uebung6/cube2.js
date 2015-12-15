var gl;
var canvas;

var vertices;
var colors;

var colorBuffer;
var positionBuffer;

var modelMatrixLoc;
var modelMatrix;

var viewMatrixLoc;
var viewMatrix;

var projectionMatrixLoc;
var projectionMatrix;

var lookAt;
var camPos;

function handleKeyPress(e)
{
	console.log("Keyboard:");
	
	var relCamPos = [0,0,0];
	vec3.sub(relCamPos, lookAt, camPos);
	
	switch(e.keyCode)
	{
		case 65: //a
			vec3.rotateY(relCamPos, relCamPos, lookAt, -90 * Math.PI / 180);
			vec3.scale(relCamPos, relCamPos, 0.01);
			
			camPos[0] += relCamPos[0];
			camPos[2] += relCamPos[2];
			
			//lookAt[0] += relCamPos[0];
			
			console.log("a");
			break;
		case 87: //w
			vec3.scale(relCamPos, relCamPos, 0.1);
			vec3.add(camPos, camPos, relCamPos);
			
			console.log("w");
			break;
		case 68: //d
			vec3.rotateY(relCamPos, relCamPos, lookAt, 90 * Math.PI / 180);
			vec3.scale(relCamPos, relCamPos, 0.01);

			camPos[0] += relCamPos[0];
			camPos[2] += relCamPos[2];
			
			//lookAt[0] += relCamPos[0];

			console.log("d");
			break;
		case 83: //s
			vec3.scale(relCamPos, relCamPos, 0.1);
			vec3.sub(camPos, camPos, relCamPos);
			
			console.log("s");
			break;
	}

	mat4.lookAt(viewMatrix, camPos, lookAt, [0,1,0]);
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
}

function handleMouse(e)
{
	console.log("Mouse:");
	console.log("movementX: " + e.movementX);
	console.log("movementY: " + e.movementY);
	
	vec3.rotateY(lookAt ,lookAt, camPos, e.movementX * 0.01 * Math.PI / 180);
	vec3.rotateX(lookAt ,lookAt, camPos, -e.movementY * 0.01 * Math.PI / 180);
	
	mat4.lookAt(viewMatrix,camPos,lookAt,[0,1,0]);
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
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

window.onload = function init()
{
	// Get canvas and setup webGL
	
	canvas = document.getElementById("gl-canvas");
	document.addEventListener("keydown", handleKeyPress);
	document.addEventListener("click", handleClick);
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }
	
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);

	// Specify position and color of the vertices
	
										// Front
	vertices = new Float32Array([		-0.5, -0.5, 0.5,
										0.5, -0.5, 0.5,
										0.5, 0.5, 0.5,
										
										0.5, 0.5, 0.5,
										-0.5, 0.5 ,0.5,
										-0.5, -0.5, 0.5,
										
										// Right
										0.5, 0.5, 0.5,
										0.5, -0.5, 0.5,
										0.5, -0.5, -0.5,
										
										0.5, -0.5, -0.5,
										0.5, 0.5, -0.5,
										0.5, 0.5, 0.5,
										
										// Back
										-0.5, -0.5, -0.5,
										0.5, -0.5, -0.5,
										0.5, 0.5, -0.5,
										
										0.5, 0.5, -0.5,
										-0.5, 0.5 ,-0.5,
										-0.5, -0.5, -0.5,
										
										// Left
										-0.5, 0.5, 0.5,
										-0.5, -0.5, 0.5,
										-0.5, -0.5, -0.5,
										
										-0.5, -0.5, -0.5,
										-0.5, 0.5, -0.5,
										-0.5, 0.5, 0.5,
										
										// Bottom
										-0.5, -0.5, 0.5,
										0.5, -0.5, 0.5,
										0.5, -0.5, -0.5,
										
										0.5, -0.5, -0.5,
										-0.5, -0.5 , -0.5,
										-0.5, -0.5, 0.5,
										
										// Top
										-0.5, 0.5, 0.5,
										0.5, 0.5, 0.5,
										0.5, 0.5, -0.5,
										
										0.5, 0.5, -0.5,
										-0.5, 0.5 , -0.5,
										-0.5, 0.5, 0.5
										]);
										
									// Front
	colors = new Float32Array([ 1, 0, 0, 1, 
									1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
									
									// Right
									0, 1, 0, 1, 
									0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,
									
									// Back
									0, 0, 1, 1, 
									0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
									
									// Left
									1, 1, 0, 1, 
									1, 1, 0, 1,
									1, 1, 0, 1,
									1, 1, 0, 1,
									1, 1, 0, 1,
									1, 1, 0, 1,
									
									// Bottom
									1, 0, 1, 1, 
									1, 0, 1, 1,
									1, 0, 1, 1,
									1, 0, 1, 1,
									1, 0, 1, 1,
									1, 0, 1, 1,
									
									// Top
									0, 1, 1, 1, 
									0, 1, 1, 1,
									0, 1, 1, 1,
									0, 1, 1, 1,
									0, 1, 1, 1,
									0, 1, 1, 1
									]);

	// Configure viewport

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

	// Init shader program and bind it

	var program = initShaders(gl, "vertex-shader", "fragment-shader");

	gl.useProgram(program);
	
	// Load colors into the GPU and associate shader variables
	
	colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
	
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	// Load positions into the GPU and associate shader variables

	positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	// Set and load modelMatrix
	
	modelMatrix = new Float32Array([	1,0,0,0,
											0,1,0,0,
											0,0,1,0,
											0,0,0,1]);
	
	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
	gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);
	
	viewMatrix = new Float32Array([	1,0,0,0,
											0,1,0,0,
											0,0,1,0,
											0,0,0,1]);
											
	lookAt = [0,0,0];
	camPos = [0,-5,-5];
	mat4.lookAt(viewMatrix,camPos,lookAt,[0,1,0]);
	
	viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
	
	projectionMatrix = new Float32Array([	1,0,0,0,
											0,1,0,0,
											0,0,1,0,
											0,0,0,1]);
	
	mat4.perspective(projectionMatrix, 50, 1, 0.1, 100);
	
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
	gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
	
	var havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;
	
	console.log("Your browser supports Pointer Lock: " + (havePointerLock?"Yes!":"No!"));
	
	render(); 
};

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);
	requestAnimFrame(render);
}

