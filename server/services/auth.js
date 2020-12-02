const dotenv = require("dotenv");
dotenv.config();
const jwt = require ("jsonwebtoken");


function verifyToken (req, res, next){
    let authorization = (req.get('Authorization')).split(" ");
    let token = authorization[1];
    jwt.verify(token, process.env.jtw_SEED,(error, decoded) => {
        if (error){
            res.status(401).json(error);
        }
        req.id = decoded.id;
        req.user = decoded.user;
        req.role = decoded.role;
        next();
    })
    
}

function verifyRole (req, res, next){
    let role = req.role;
    if (role === "admin"){
        next();
    } else {
        res.status(401).json("Unauthorized action");
    }
}


module.exports.verifyToken = verifyToken;
module.exports.verifyRole = verifyRole;
