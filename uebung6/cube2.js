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

var rotationSpeed;
var lookAt;
var camPos;

var LastX;

function handleKeyPress(e)
{
	switch(e.keyCode)
	{
		case 38: // arrow-up
			rotationSpeed++;
			console.log("positiv");
			break;
		case 40: // arrow-down
			rotationSpeed--;
			console.log("negativ");
			break; 
		case 65: //a
			var temp = [0,0,0];
			vec3.subtract(temp, lookAt, camPos)
			vec3.rotateY(temp,temp,lookAt, -90* Math.PI / 180)
			vec3.scale(temp, temp, 0.01);
			//vec3.add(camPos, camPos, temp);
			camPos[0] += temp[0];
			camPos[2] += temp[2];
			//vec3.add(lookAt, lookAt, temp);
			break;
		case 87: //w
			camPos[0] += 0.1*(lookAt[0]-camPos[0]);
			camPos[1] += 0.1*(lookAt[1]-camPos[1]);
			camPos[2] += 0.1*(lookAt[2]-camPos[2]);
			console.log("w");
			break;
		case 68: //d
			var temp = [0,0,0];
			vec3.subtract(temp, lookAt, camPos)
			vec3.rotateY(temp,temp,lookAt, 90* Math.PI / 180)
			vec3.scale(temp, temp, 0.01);
			//vec3.add(camPos, camPos, temp);
			camPos[0] += temp[0];
			camPos[2] += temp[2];
			//vec3.add(lookAt, lookAt, temp);
			console.log("d");
			break;
		case 83: //s
			camPos[0] -= 0.1*(lookAt[0]-camPos[0]);
			camPos[1] -= 0.1*(lookAt[1]-camPos[1]);
			camPos[2] -= 0.1*(lookAt[2]-camPos[2]);
			console.log("s");
			break;
	}

	mat4.lookAt(viewMatrix,camPos,lookAt,[0,1,0]);
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
}

function handleMouse(e)
{
	console.log("Mouse");
	//document.lockMouse(e);
	
	var x = e.screenX;
	console.log("Screen: " + x);
	console.log("Client: " + e.clientX);

	var dX = x- LastX;
	
	vec3.rotateY(lookAt ,lookAt,camPos, dX*0.01* Math.PI / 180)
	
	LastX = x;
	
	mat4.lookAt(viewMatrix,camPos,lookAt,[0,1,0]);
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
}

window.onload = function init()
{
	// Get canvas and setup webGL
	
	canvas = document.getElementById("gl-canvas");
	document.addEventListener("keydown", handleKeyPress);
	document.addEventListener("mousemove", handleMouse);
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
    
	rotationSpeed = 0;
	LastX = 0;
	
	render(); 
};

function render()
{
	mat4.rotate(modelMatrix,modelMatrix, rotationSpeed * Math.PI / 180,[0,1,0]);
	gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);
	requestAnimFrame(render);
}


