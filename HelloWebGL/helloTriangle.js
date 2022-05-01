const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;

let app = Vue.createApp({
    data() {
        return {
            webGLVShader: null,
            openGLVShader: null,
            webGLFShader: null,
            openGLFShader: null,
            glfwSetup: null,
            loadGLFunc: null,
            gladSetup: null,
            globalWebGLState: null,
            globalOpenGLState: null,
            triangleVertices: null,
            vaoSetupJS: null,
            vaoSetupCPP:null,
            webGLCompileShader: null,
            openGLCompileShader: null,
            fullWebGLProgram: null,
            fullOpenGLProgram: null,
            mainDrawLoopJS: null,
            mainDrawLoopCPP: null,
        }
    },

    mounted() {
        this.runWebGL();
    },

    methods: {
        async runWebGL() {
            const canvas = document.querySelector("#glCanvas");
            const gl = canvas.getContext("webgl2");
            const topVertexColor = document.querySelector("#top-vertex");
            const bottomLeftVertexColor = document.querySelector("#bottom-left-vertex");
            const bottomRightVertexColor = document.querySelector("#bottom-right-vertex");
            
            this.resizeCanvas(canvas);
            gl.viewport(0, 0, canvas.width, canvas.height);
            window.onresize = () => {
                this.resizeCanvas(canvas);
                gl.viewport(0, 0, canvas.width, canvas.height);
            }

            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);

            // create and initialize a shader
            let shader = new Shader();
            await shader.init("basicVertex.glsl", "basicFragment.glsl", gl);

            let triangleVertices = new Float32Array ([
                0.0,  0.5, 0.0, 1.0, 0.0, 0.0,
               -0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
                0.5, -0.5, 0.0, 0.0, 0.0, 1.0
            ]);

            // Create vertex array object and vertex buffer
            const vao = gl.createVertexArray();
            const vbo = gl.createBuffer();
            
            // Bind vao and vbo
            gl.bindVertexArray(vao);
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

            // Set up vbo data
            gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.DYNAMIC_DRAW);
            
            // layout(location = 0) in vec3 aPos
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * 4, 0);
            gl.enableVertexAttribArray(0);

            // layout(location = 1) in vec3 aColor;
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * 4, 12)
            gl.enableVertexAttribArray(1);

            // If the color pickers change update the vbo data
            topVertexColor.addEventListener('input', () => {
                let newColor = this.hexColorToGLRGB(topVertexColor.value);
                triangleVertices[3] = newColor[0];
                triangleVertices[4] = newColor[1];
                triangleVertices[5] = newColor[2];
                gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.DYNAMIC_DRAW);
            })
            bottomLeftVertexColor.addEventListener('input', () => {
                let newColor = this.hexColorToGLRGB(bottomLeftVertexColor.value);
                triangleVertices[9] = newColor[0];
                triangleVertices[10] = newColor[1];
                triangleVertices[11] = newColor[2];
                gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.DYNAMIC_DRAW);
            })
            bottomRightVertexColor.addEventListener('input', () => {
                let newColor = this.hexColorToGLRGB(bottomRightVertexColor.value);
                triangleVertices[15] = newColor[0];
                triangleVertices[16] = newColor[1];
                triangleVertices[17] = newColor[2];
                gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.DYNAMIC_DRAW);
                console.log('change')
            })

            function draw() {
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
        },

        resizeCanvas(canvas)
        {
            if (window.innerWidth < 600)
            {
                canvas.width = window.innerWidth;
                canvas.height = window.innerWidth;   
            }
            else
            {
                canvas.width = 600;
                canvas.height= 600;
            }
        },

        hexColorToGLRGB(color) {
            let r = Number("0x"+color[1]+color[2]) / 255;
            let g = Number("0x"+color[3]+color[4]) / 255;
            let b = Number("0x"+color[5]+color[6]) / 255;
        
            return [r, g, b];
        },

        highLightCode(code) {
            return hljs.highlightAuto(`${code}`, ['js', 'cpp', 'glsl']).value;
        }
    }
}).mount('#app');

fetch(`http://localhost:8000/shader?id=${"wGLTutVShader.glsl"}`).then(res => res.json()).then(data => {app.webGLVShader = data.shader;});
fetch(`http://localhost:8000/shader?id=${"basicFragment.glsl"}`).then(res => res.json()).then(data => {app.webGLFShader = data.shader;});
fetch(`http://localhost:8000/shader?id=${"basicVertexComp.glsl"}`).then(res => res.json()).then(data => {app.openGLVShader = data.shader;});
fetch(`http://localhost:8000/shader?id=${"basicFragmentComp.glsl"}`).then(res => res.json()).then(data => {app.openGLFShader = data.shader;});
fetch(`http://localhost:8000/cpp?id=${"glfwsetup.cpp"}`).then(res => res.json()).then(data => {app.glfwSetup = data.cpp;});
fetch(`http://localhost:8000/cpp?id=${"loadglfunc.cpp"}`).then(res => res.json()).then(data => {app.loadGLFunc = data.cpp;});
fetch(`http://localhost:8000/cpp?id=${"gladsetup.cpp"}`).then(res => res.json()).then(data => {app.gladSetup = data.cpp;});
fetch(`http://localhost:8000/js?id=${"globalWebGLState.js"}`).then(res => res.json()).then(data => {app.globalWebGLState = data.js;});
fetch(`http://localhost:8000/cpp?id=${"globalOpenGLState.cpp"}`).then(res => res.json()).then(data => {app.globalOpenGLState = data.cpp;});
fetch(`http://localhost:8000/js?id=${"triangleVertices.js"}`).then(res => res.json()).then(data => {app.triangleVertices = data.js;});
fetch(`http://localhost:8000/js?id=${"vaoSetup.js"}`).then(res => res.json()).then(data => {app.vaoSetupJS = data.js;});
fetch(`http://localhost:8000/js?id=${"shaderCompile.js"}`).then(res => res.json()).then(data => {app.webGLCompileShader = data.js;});
fetch(`http://localhost:8000/cpp?id=${"shaderCompile.cpp"}`).then(res => res.json()).then(data => {app.openGLCompileShader = data.cpp;});
fetch(`http://localhost:8000/js?id=${"fullHelloTriangleProgram.js"}`).then(res => res.json()).then(data => {app.fullWebGLProgram = data.js;});
fetch(`http://localhost:8000/cpp?id=${"fullHelloTriangleProgram.cpp"}`).then(res => res.json()).then(data => {app.fullOpenGLProgram = data.cpp;});
fetch(`http://localhost:8000/cpp?id=${"vaoSetup.cpp"}`).then(res => res.json()).then(data => {app.vaoSetupCPP = data.cpp;});
fetch(`http://localhost:8000/cpp?id=${"mainDrawLoop.cpp"}`).then(res => res.json()).then(data => {app.mainDrawLoopCPP = data.cpp;});
fetch(`http://localhost:8000/js?id=${"mainDrawLoop.js"}`).then(res => res.json()).then(data => {app.mainDrawLoopJS = data.js;});