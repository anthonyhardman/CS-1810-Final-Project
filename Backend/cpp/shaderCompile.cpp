const char* vertexShaderSource =
"#version 460 core\n" 
"layout(location = 0) in vec3 aPos;\n" 
"layout(location = 1) in vec3 aColor;\n" 
"void main()\n" 
"{\n" 
"   color = aColor;\n"
"   gl_Position = vec4(aPos, 1.0);\n"  
"}\n";

const char* fragmentShaderSource =
"#version 300 es\n"
"precision mediump float;\n"
"in vec3 color;\n"
"out vec4 fragColor;\n"
"void main()\n" 
"{\n" 
"    fragColor = vec4(color, 1.0);\n"
"}\0"

uin32_t shaderProgram = glCreateProgram();
uin32_t vertexShader = glCreateShader();
uin32_t fragmentShader = glCreateShader();

// compile the vertex shader
glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
glCompileShader(vertexShader);

// compile the fragment shader
glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
glCompileShader(fragmentShader);

// link shaders to shader program
glAttachShader(shaderProgram, vertexShader);
glAttachShader(shaderProgram, fragmentShader);
glLinkProgram(shaderProgram);

// delete the vertex and fragments shaders as they are 
// already linked to the shader program (optional)
glDeleteShader(vertexShader);
glDeleteShader(fragmentShader);