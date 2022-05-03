class Shader
{
    id;
    gl;

    async init(vShaderSrcPath, fShaderSrcPath, gl)
    {
        this.gl = gl;

        let vShaderSrc = await this.#LoadShaderSource(vShaderSrcPath);
        let fShaderSrc = await this.#LoadShaderSource(fShaderSrcPath);
        
        this.id = this.gl.createProgram();
        let vertexShader = this.gl.createShader(gl.VERTEX_SHADER);
        let fragmentShader = this.gl.createShader(gl.FRAGMENT_SHADER);
    
        // compile the vertex shader
        this.gl.shaderSource(vertexShader, vShaderSrc);
        this.gl.compileShader(vertexShader);
        this.#checkCompileErrors(vertexShader, "VERTEX");

        // compile the fragment shader
        this.gl.shaderSource(fragmentShader, fShaderSrc);
        this.gl.compileShader(fragmentShader);
        this.#checkCompileErrors(fragmentShader, "FRAGMENT");

        // link the shader program
        this.gl.attachShader(this.id, vertexShader);
        this.gl.attachShader(this.id, fragmentShader);
        this.gl.linkProgram(this.id);
        this.#checkCompileErrors(this.id, "PROGRAM");

        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);
    }
    
    async #LoadShaderSource(file)
    {
        return await fetch(`http://localhost:8000/shader?id=${file}`).then(res => res.json()).then(data => data.shader);
    }

    #checkCompileErrors(shader, type)
    {
        if (type !== "PROGRAM")
        {
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
            {
                console.log(`${type} Shader Compilation Error: ${this.gl.getShaderInfoLog(shader)}`);
            }
        }
        else
        {
            if (!this.gl.getProgramParameter(shader, this.gl.LINK_STATUS))
            {
                console.log(`Program Linking Error: ${this.gl.getShaderInfoLog(shader)}`);
            }
        }
        
    }

    use()
    {
        this.gl.useProgram(this.id);
    }

    setMat4(name, mat)
    {
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.id, name), false, mat);
    }

    setVec3(name, vec)
    {
        this.gl.uniform3fv(this.gl.getUniformLocation(this.id, name), vec);
    }

    setVec4(name, vec)
    {
        this.gl.uniform4fv(this.gl.getUniformLocation(this.id, name), vec);
    }

    setBool(name, bool)
    {
        this.gl.uniform1i(this.gl.getUniformLocation(this.id, name), bool);
    }
}