float triangleVertices[] = {
    // Position     // Color
    0.0,  0.5, 0.0, 1.0, 0.0, 0.0,
   -0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
    0.5, -0.5, 0.0, 0.0, 0.0, 1.0
};

uint32_t vao, vbo;
glGenVertexArrays(1, &vao);
glGenBuffers(1, &vbo);

// Bind vao and vbo
glBindVertexArray(vao);
glBindBuffer(GL_ARRAY_BUFFER, vbo);

// Set up vbo data
glBufferData(GL_ARRAY_BUFFER, sizeof(triangleVertices), triangleVertices, GL_STATIC_DRAW);

// layout(location = 0) in vec3 aPos
glVertexAttribPointer(0, 3, GL_FLOAT, false, 6 * sizeof(float), 0);
glEnableVertexAttribArray(0);

// layout(location = 1) in vec3 aColor;
glVertexAttribPointer(1, 3, GL_FLOAT, false, 6 * sizeof(float), (void*)(3 * sizeof(float)));
glEnableVertexAttribArray(1);