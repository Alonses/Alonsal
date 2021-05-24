const express = require('express')
const path = require('path')
const http = require('http')
const router = require("./router.js")

const app = express()
const server = http.createServer(app)

app.use(router)
app.use(express.static(path.join(__dirname, 'front')))

console.log("site no ar")

module.exports = server