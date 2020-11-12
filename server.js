//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));
// app.use(function (req, res, next) {
//     res.status(404).send("Sorry can't find that!")
// })

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});
console.log("listening on http://localhost:8080")
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
