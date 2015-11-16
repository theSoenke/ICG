var gl;
var program;

var localRadius1 = 100.0;
var localRadius2 = 130.0;
var localBrightnessOffset = 1.5;
window.onload = function init()
{
	
	// Get canvas and setup webGL
	
	var canvas = document.getElementById("gl-canvas");
	document.addEventListener("keydown", onKeyPress);
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	// Specify position and color of the vertices
	
	var vertices = new Float32Array([	-1, -1, 
										-1, 1, 
										1, 1,
										1, -1]);
										
	var colors = new Float32Array([		1, 0, 0, 1,
										0, 0, 1, 1,
										0, 1, 1, 1,
										0, 1, 0, 1]);

	// Configure viewport

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

	// Init shader program and bind it

	program = initShaders(gl, "vertex-shader", "fragment-shader");

	gl.useProgram(program);
	
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
	
	var radius1Loc = gl.getUniformLocation(program, "radius1");
	var radius2Loc = gl.getUniformLocation(program, "radius2");
	var brightnessOffsetLoc = gl.getUniformLocation(program, "brightnessOffset");
	gl.uniform1f(radius1Loc, localRadius1);
	gl.uniform1f(radius2Loc, localRadius2);
	gl.uniform1f(brightnessOffsetLoc, localBrightnessOffset);
	
	render();
};

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function onKeyPress(e) {
	var radius1Loc = gl.getUniformLocation(program, "radius1");
	var radius2Loc = gl.getUniformLocation(program, "radius2");
	var brightnessOffsetLoc = gl.getUniformLocation(program, "brightnessOffset");
	
	var keyCode = e.keyCode;
	
	if (keyCode == 37) {
		if ((localRadius1 - 10.0) >= 0.0) {
			localRadius1 -= 10.0;
			localRadius2 -= 10.0;
		} else {
			localRadius1 = 0.0;
			localRadius2 = 30.0;
		}
	}
	else if (keyCode == 39) {
		if ((localRadius2 + 10.0) <=256.0) {
			localRadius1 += 10.0;
			localRadius2 += 10.0;
		} else {
			localRadius1 = 226.0;
			localRadius2 = 256.0;
		}
	}
	else if (keyCode == 38) {
		if ((localBrightnessOffset + 0.1) <= 2.5) {
			localBrightnessOffset += 0.1;
		} else {
			localBrightnessOffset = 2.5;
		}
	}
	else if (keyCode == 40) {
		if ((localBrightnessOffset - 0.1) >= 1.0) {
			localBrightnessOffset -= 0.1;
		} else {
			localBrightnessOffset = 1.0;
		}	
	}
	gl.uniform1f(radius1Loc, localRadius1);
	gl.uniform1f(radius2Loc, localRadius2);
	gl.uniform1f(brightnessOffsetLoc, localBrightnessOffset);
	
	render();
}
