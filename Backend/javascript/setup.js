// Get the canvas element
const canvas = document.getElementById("glCanvas");
// Get the WebGL context so we can call WebGL functions
const gl = canvas.getContext("webgl2");

// Initialize the WebGL viewport to the dimensions of the canvas
gl.viewport(0, 0, canvas.width, canvas.height);

// Set the background color of the canvas
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clearDepth(1.0);
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);

// Create the shader we're going to use to draw
let shader = new Shader();
await shader.init("basicVertex.glsl", "basicFragment.glsl", gl);

// Define the vertices of our triangle
let vertices = new Float32Array ([
    // Position     // Color
    0.0,  0.5, 0.0, 1.0, 0.0, 0.0,
   -0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
    0.5, -0.5, 0.0, 0.0, 0.0, 1.0
]);

// Create the vertex array object and vertex buffer object
const vao = gl.createVertexArray();
const vbo = gl.createBuffer();

// Bind the vertex array object so we can set it up
gl.bindVertexArray(vao);
// Bind the vertex buffer object so we can set it up
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

// Set up the buffer object
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

// Tell the vertex array object what part of the vertex data is
// the vertex position
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * 4, 0);
gl.enableVertexAttribArray(0);

// Tell the vertex array object what part of the verex data is
// the vertex color
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * 4, 12)
gl.enableVertexAttribArray(1);

// draw loop
function draw() {
    // Clear the color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // 
    let projection = mat4.create();
    mat4.perspective(projection, 45 * Math.PI / 180, canvas.width / canvas.height, 0.01, 100.0);
    let model = mat4.create();
    mat4.translate(model, model, [0.0, 0.0, -4]);
    mat4.scale(model, model, [2.0, 2.0, 2.0]);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    shader.use();
    shader.setMat4("projection", projection);
    shader.setMat4("model", model);
    shader.setVec4("color", [1.0, 1.0, 1.0, 1.0])

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);