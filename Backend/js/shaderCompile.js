let vertexShaderSrc = 
"#version 300 es\n" +
"layout(location = 0) in vec3 aPos;\n" +
"layout(location = 1) in vec3 aColor;\n" +
"out vec3 color;\n" +
"void main()\n" +
"{\n" +
"    color = aColor;\n" +
"    gl_Position = vec4(aPos, 1.0);\n"+
"}\n"

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