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

app.get('/cpp', (req,res) => {
    console.log(req.url);
    console.log(req.query.id);

    try
    {
        let cppCode = fs.readFileSync(`./cpp/${req.query.id}`, 'utf8').toString();

        res.send({
            status: true,
            error: "none",
            cpp: cppCode
        })
    }
    catch
    {
        res.send({
            status: false,
            error: "cpp file does not exist"
        })
    }
})

app.get('/js', (req,res) => {
    console.log(req.url);
    console.log(req.query.id);

    try
    {
        let jsCode = fs.readFileSync(`./js/${req.query.id}`, 'utf8').toString();

        res.send({
            status: true,
            error: "none",
            js: jsCode
        })
    }
    catch
    {
        res.send({
            status: false,
            error: "JavaScript file does not exist"
        })
    }
})

app.get('/html', (req,res) => {
    console.log(req.url);
    console.log(req.query.id);

    try
    {
        let htmlCode = fs.readFileSync(`./html/${req.query.id}`, 'utf8').toString();

        res.send({
            status: true,
            error: "none",
            html: htmlCode
        })
    }
    catch
    {
        res.send({
            status: false,
            error: "HTML file does not exist"
        })
    }
})

app.listen(8000, () => {
    console.log("Up and running babe!")
})