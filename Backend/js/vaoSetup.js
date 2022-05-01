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