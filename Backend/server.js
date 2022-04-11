const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const cors = require('cors');
const path = require('path/posix');
const { NONAME } = require('dns');
const app = express();

app.use(cors());
app.use(fileUpload({
    createParentPath: true
}))

app.get('/shader', (req, res) => {
    console.log(req.url);
    console.log(req.query.id);
    
    try
    {
        let shaderCode = fs.readFileSync(`./shaders/${req.query.id}`, 'utf8').toString();

        res.send({
            status: true,
            error: "none",
            shader: shaderCode
        })
    }
    catch
    {
        res.send({
            status: false,
            error: "shader does not exist"
        })
    }

    
});

app.listen(8000, () => {
    console.log("Up and running babe!")
})