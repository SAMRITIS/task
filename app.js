const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const cors = require("cors");
const cluster = require("cluster");
const cCPUs = require("os").cpus().length;
const db = require("./model");
const router = require("./router/index.router");
const createError = require("http-errors");

// Middleware


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

db.sequelize.sync();
app.use("/api/v1", router);

// if (cluster.isMaster) {
//     for (var i = 0; i < cCPUs; i++) {
//         cluster.fork();
//     }

//     cluster.on('online', function (worker) {
//         console.log('Worker ' + worker.process.pid + ' is online.');
//     });
//     cluster.on('exit', function (worker, code, signal) {
//         console.log('worker ' + worker.process.pid + ' died.');
//     });
// }
// else {

// Routing
app.use(async (req, res, next) => {
    next(createError(404, "Not Found"));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        status: false,
        error: {
            status: err.status || 500,
            message:
                process.env.MODE === "development" ? err.message : "Error Occoured",
        },
    });
});

// Listen
app.listen(port, () => {
    console.log(`Server is listening on PORT No. ${port}`);
});
// }
