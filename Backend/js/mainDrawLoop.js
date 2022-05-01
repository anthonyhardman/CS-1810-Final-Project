// main draw loop
function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(shaderProgram);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);