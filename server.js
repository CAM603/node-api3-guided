const express = require("express"); // importing a CommonJS module
const morgan = require("morgan");
const helmet = require("helmet")

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

function gateKeeper(guess) {

  return function(req, res, next) {
    const password = req.headers.password;
  
    if(password && password.toLowerCase() === guess) {
      next()
    } else {
      res.status(401).json({ message: 'you shall not pass'})
    }
  }
}

function greeter(req, res, next) {
  req.cohort = "Web 26"
  next()
}

function logger(req, res, next) {
  console.log(`${req.method} request to ${req.originalUrl}`)

  next()
}

// middleware
server.use(express.json()); // built in middleware
// server.use(morgan("dev"));
server.use(helmet())
// server.use(logger)

// routes - endpoints
server.use('/api/hubs', logger, gateKeeper('mellon'), hubsRouter);

server.get('/', logger, greeter, gateKeeper('poop'), (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.cohort} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
