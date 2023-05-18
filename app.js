const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieparser = require('cookie-parser');
dotenv.config({ path: './config.env' });
app.use(cookieparser());
app.use(express.json({ limit: '50mb' }));
const path = require("path");
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;
require('./db/conn');
app.use(express.json());
app.use(require('./router/auth'));



if (process.env.NODE_ENV === "production") {
     app.use(express.static("client/build"));
}

app.get("*", (req, res) => {
     res.sendFile(path.join(__dirname, './client/build/index.html'), function (err) {
          if (err) {
               res.status(500).send(err)
          }
     })
})

app.listen(port, (req, res) => {
     console.log(`server running at ${port}`);
});