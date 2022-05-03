const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;

function hexColorToGLRGB(color) {
    let r = Number("0x" + color[1] + color[2]) / 255;
    let g = Number("0x" + color[3] + color[4]) / 255;
    let b = Number("0x" + color[5] + color[6]) / 255;

    return [r, g, b];
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

let app = Vue.createApp({
    data() {
        return {
            nav: null,
        }
    },

    mounted () {
        this.runWebGL();
    },

    methods: {
        async runWebGL() {
            const reader = new FileReader();
            const canvas = document.querySelector("#glCanvas");
            const gl = canvas.getContext("webgl2");
            const litCheckbox = document.querySelector("#lit");
            const color = document.querySelector("#color");
            const xPos = document.querySelector("#xPos");
            const yPos = document.querySelector("#yPos");
            const zPos = document.querySelector("#zPos");
            const xRot = document.querySelector("#xRot");
            const yRot = document.querySelector("#yRot");
            const zRot = document.querySelector("#zRot");
            const autoRotate = document.querySelector("#autoRotate");
            const rotationSettings = document.querySelector("#rotations");

            const colorLabel = document.querySelector("#colorLabel");
            const autoRotateLabel = document.querySelector("#autoRotateLabel");
            const litLabel = document.querySelector("#litLabel");
            
            colorLabel.style.background=color.value;
            autoRotateLabel.style.background="#005cc8";
            litLabel.style.background="#005cc8";
            
            autoRotate.addEventListener('input', () => {
                if (autoRotate.checked)
                {
                    autoRotateLabel.style.background="#005cc8";
                }
                else
                {
                    autoRotateLabel.style.background="none";
                }
            })

            litCheckbox.addEventListener('input', () => {
                if (litCheckbox.checked)
                {
                    litLabel.style.background="#005cc8";
                }
                else
                {
                    litLabel.style.background="none";
                }
            })
            
            rotationSettings.addEventListener('input', () => {
                autoRotate.checked = false;
            })

            window.onresize = () => {
                this.resizeCanvas(canvas);
                gl.viewport(0, 0, canvas.width, canvas.height);
            }

            this.resizeCanvas(canvas);
            gl.viewport(0, 0, canvas.width, canvas.height);

            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);


            // create and initialize a shader
            let shader = new Shader();
            await shader.init("texturedCubeVert.glsl", "texturedCubeFrag.glsl", gl);

            let triangleVertices = new Float32Array([
                // positions       // normals        // texture coords
                -0.5, -0.5, -0.5,  0.0,  0.0, -1.0,  0.0,  0.0,
                 0.5, -0.5, -0.5,  0.0,  0.0, -1.0,  1.0,  0.0,
                 0.5,  0.5, -0.5,  0.0,  0.0, -1.0,  1.0,  1.0,
                 0.5,  0.5, -0.5,  0.0,  0.0, -1.0,  1.0,  1.0,
                -0.5,  0.5, -0.5,  0.0,  0.0, -1.0,  0.0,  1.0,
                -0.5, -0.5, -0.5,  0.0,  0.0, -1.0,  0.0,  0.0,

                -0.5, -0.5,  0.5,  0.0,  0.0,  1.0,  0.0,  0.0,
                 0.5, -0.5,  0.5,  0.0,  0.0,  1.0,  1.0,  0.0,
                 0.5,  0.5,  0.5,  0.0,  0.0,  1.0,  1.0,  1.0,
                 0.5,  0.5,  0.5,  0.0,  0.0,  1.0,  1.0,  1.0,
                -0.5,  0.5,  0.5,  0.0,  0.0,  1.0,  0.0,  1.0,
                -0.5, -0.5,  0.5,  0.0,  0.0,  1.0,  0.0,  0.0,

                -0.5,  0.5,  0.5, -1.0,  0.0,  0.0,  1.0,  0.0,
                -0.5,  0.5, -0.5, -1.0,  0.0,  0.0,  1.0,  1.0,
                -0.5, -0.5, -0.5, -1.0,  0.0,  0.0,  0.0,  1.0,
                -0.5, -0.5, -0.5, -1.0,  0.0,  0.0,  0.0,  1.0,
                -0.5, -0.5,  0.5, -1.0,  0.0,  0.0,  0.0,  0.0,
                -0.5,  0.5,  0.5, -1.0,  0.0,  0.0,  1.0,  0.0,

                 0.5,  0.5,  0.5,  1.0,  0.0,  0.0,  1.0,  0.0,
                 0.5,  0.5, -0.5,  1.0,  0.0,  0.0,  1.0,  1.0,
                 0.5, -0.5, -0.5,  1.0,  0.0,  0.0,  0.0,  1.0,
                 0.5, -0.5, -0.5,  1.0,  0.0,  0.0,  0.0,  1.0,
                 0.5, -0.5,  0.5,  1.0,  0.0,  0.0,  0.0,  0.0,
                 0.5,  0.5,  0.5,  1.0,  0.0,  0.0,  1.0,  0.0,

                -0.5, -0.5, -0.5,  0.0, -1.0,  0.0,  0.0,  1.0,
                 0.5, -0.5, -0.5,  0.0, -1.0,  0.0,  1.0,  1.0,
                 0.5, -0.5,  0.5,  0.0, -1.0,  0.0,  1.0,  0.0,
                 0.5, -0.5,  0.5,  0.0, -1.0,  0.0,  1.0,  0.0,
                -0.5, -0.5,  0.5,  0.0, -1.0,  0.0,  0.0,  0.0,
                -0.5, -0.5, -0.5,  0.0, -1.0,  0.0,  0.0,  1.0,

                -0.5,  0.5, -0.5,  0.0,  1.0,  0.0,  0.0,  1.0,
                 0.5,  0.5, -0.5,  0.0,  1.0,  0.0,  1.0,  1.0,
                 0.5,  0.5,  0.5,  0.0,  1.0,  0.0,  1.0,  0.0,
                 0.5,  0.5,  0.5,  0.0,  1.0,  0.0,  1.0,  0.0,
                -0.5,  0.5,  0.5,  0.0,  1.0,  0.0,  0.0,  0.0,
                -0.5,  0.5, -0.5,  0.0,  1.0,  0.0,  0.0,  1.0
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
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);
            gl.enableVertexAttribArray(0);

            // layout(location = 1) in vec3 aNormal;
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12)
            gl.enableVertexAttribArray(1);

            // layout(location = 2) in vec2 aTexCoord;
            gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 32, 24);
            gl.enableVertexAttribArray(2);


            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);   
            const image = new Image();
            image.src = "./images/snowCollegeLogo.png"    
            console.log(image.height)    
            image.addEventListener('load', () => {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
            })
            color.addEventListener('input', () => {
                reader.readAsDataURL(color.files[0]);
            })
            reader.addEventListener('load', (e) => {
                image.src = e.target.result;
            })


            function draw() {
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                let projection = mat4.create();
                mat4.perspective(projection, 45 * Math.PI / 180, canvas.width / canvas.height, 0.01, 100.0);
                let model = mat4.create();
                mat4.translate(model, model, [xPos.value, yPos.value, zPos.value]);
                mat4.scale(model, model, [1.0, 1.0, 1.0]);

                if (autoRotate.checked)
                {
                    xRot.value = (new Date().getTime() *  0.01 % 360).toFixed(1);
                    yRot.value = (new Date().getTime() * -0.05 % 360).toFixed(1);
                    zRot.value = (new Date().getTime() * -0.05 % 360).toFixed(1);
                }

                mat4.rotateX(model, model, this.toRadians(xRot.value));
                mat4.rotateY(model, model, this.toRadians(yRot.value));
                mat4.rotateZ(model, model, this.toRadians(zRot.value));

                shader.use();
                shader.setMat4("projection", projection);
                shader.setMat4("model", model);
                shader.setBool("lit", litCheckbox.checked);
                gl.drawArrays(gl.TRIANGLES, 0, 36);
                window.requestAnimationFrame(draw);
            }

            window.requestAnimationFrame(draw);
        },

        resizeCanvas(canvas) {
            if (window.innerWidth < 600) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerWidth;
            }
            else {
                canvas.width = 600;
                canvas.height = 600;
            }
        },
    }

}).mount('#app');

fetch(`http://localhost:8000/html?id=${"nav.html"}`).then(res => res.json()).then(data => { app.nav = data.html; });
