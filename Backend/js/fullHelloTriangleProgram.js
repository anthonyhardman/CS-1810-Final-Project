const canvas = document.querySelector("#glCanvas");
const gl = canvas.getContext("webgl2");

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST); //Optional
gl.viewport(0, 0, canvas.width, canvas.height);

let vertexShaderSrc = 
"#version 300 es\n" +
"layout(location = 0) in vec3 aPos;\n" +
"layout(location = 1) in vec3 aColor;\n" +
"out vec3 color;\n" +
"void main()\n" +
"{\n" +
"    color = aColor;\n" +
"    gl_Position = vec4(aPos, 1.0);\n"+
"}\n";

let fragmentShaderSrc = 
"#version 300 es\n" +
"precision mediump float;\n" +
"in vec3 color;\n" +
"out vec4 fragColor;\n" +
"void main()\n" +
"{\n" +
"    fragColor = vec4(color, 1.0);\n"+
"}\n";

let shaderProgram = gl.createProgram();
let vertexShader = gl.createShader(gl.VERTEX_SHADER);
let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

// compile the vertex shader
gl.shaderSource(vertexShader, vertexShaderSrc);
gl.compileShader(vertexShader);

// compile the fragmentShader
gl.shaderSource(fragmentShader, fragmentShaderSrc);
gl.compileShader(fragmentShader);

// link shaders to shader program
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

// delete the vertex and fragments shaders as they are 
// already linked to the shader program (optional)
gl.deleteShader(vertexShader);
gl.deleteShader(fragmentShader);

let triangleVertices = new Float32Array ([
    // Position     // Color
    0.0,  0.5, 0.0, 1.0, 0.0, 0.0,
   -0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
    0.5, -0.5, 0.0, 0.0, 0.0, 1.0
]);

const vao = gl.createVertexArray();
const vbo = gl.createBuffer();

// Bind vao and vbo
gl.bindVertexArray(vao);
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

// Set up vbo data
gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
            
// layout(location = 0) in vec3 aPos
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * 4, 0);
gl.enableVertexAttribArray(0);

// layout(location = 1) in vec3 aColor;
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * 4, 12)
gl.enableVertexAttribArray(1);

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(shaderProgram);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);