const express = require("express");
const server = new express();
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const { updateOrder } = require("./orders_sql");
const sequelize = new Sequelize('mysql://root@localhost:3306/delilahtest');

async function registerUser(req, res) {
    let values = [req.body.user, req.body.name, req.body.email, req.body.address, req.body.password, req.body.phone, "customer"];
    let statement = "INSERT INTO users (user, name, email, address, password, phone, role) VALUES (?)";
    let options = { replacements: [values] };

    try {
        let results = await sequelize.query(statement, options);
        if (results) {
            res.status(200).json({ msg: "User succesfully created", id: results[0] });
        }
    } catch (error) {
        res.status(500).json(error);
    }


}

module.exports.registerUser = registerUser;

function checkReq(req, res, next) {

    if (req.body.user && req.body.name && req.body.email && req.body.address && req.body.password && req.body.phone) {
        next();
    } else {
        res.status(405).json("Invalid input. One or more parameters missing");
    }
}

module.exports.checkReq = checkReq;

async function checkUniqueData(req, res, next) {
    let exists = false;
    let new_user = req.body.user;
    let new_email = req.body.email;
    let statement = "SELECT * FROM users";
    let options = { type: sequelize.QueryTypes.SELECT };

    try {
        let results = await sequelize.query(statement, options);
        for (let i = 0; i < results.length; i++) {
            if (results[i].user === new_user || results[i].email === new_email) {
                exists = true;
                res.status(409).json("Username or email already registered.");
            }
        }
        if (exists === false) {
            next();
        }
    } catch (error) {
        res.status(500).json(error);
    }
}
module.exports.checkUniqueData = checkUniqueData;

function verifyUser(users, identifier, password) {
    let exists = false; 
    users.forEach(element => {
        if ((element.user === identifier || element.email === identifier) && element.password === password) {
            exists = true;
            const jwToken = jwt.sign({ id: element.id, user: element.user, email: element.email, role: element.role }, `${process.env.jtw_SEED}`, { expiresIn: '24h' });
            res.status(200).json({
                id: element.id,
                user: element.user,
                email: element.email,
                role: element.role,
                jwt: jwToken
            });
        }
    })
    if (exists === false) {
        res.status(400).json("Incorrect username or password or not registered")
    }
}
module.exports.verifyUser = verifyUser;

async function login(req, res) {
    let identifier = req.body.identifier;
    let password = req.body.password;

    let statement = "SELECT * FROM users";
    let options = { type: sequelize.QueryTypes.SELECT };
    try {
        let users = await sequelize.query(statement, options);
         if (users){             
            let exists = false;
            let registered = false; 
            users.forEach(element => {
                if ((element.user === identifier || element.email === identifier)){
                    registered = true;
                    if (element.password === password)
                     {
                        exists = true;
                        const jwToken = jwt.sign({ id: element.id, user: element.user, email: element.email, role: element.role }, `${process.env.jtw_SEED}`, { expiresIn: '24h' });
                        res.status(200).json({
                            id: element.id,
                            user: element.user,
                            email: element.email,
                            role: element.role,
                            jwt: jwToken
                        });
                    }
                }  
            })
            if (registered === false){
                res.status(404).json("Not registered user");
            }
            if (exists === false) {
                res.status(401).json("Incorrect username or password")
            }             
         }                
    } catch (error) {
        res.status(500).json(error);        
    }
    
}
module.exports.login = login;

async function getAllUsers (req, res){
    let statement = "SELECT users.id, users.user, users.name, users.email, users.address, users.phone, users.role FROM users";
    let options = { type: sequelize.QueryTypes.SELECT };
    try {
        let users = await sequelize.query(statement, options);
         if (users){
             res.status(200).json(users);        
        }        
    } catch (error) {
        res.status(500).json(error);
    }    
}
module.exports.getAllUsers = getAllUsers;

async function getUser(req, res){
    let user_id = req.id;
    let statement = `SELECT * FROM users WHERE users.id = ${user_id}`;
    let options = { type: sequelize.QueryTypes.SELECT };
    try {
        let user = await sequelize.query(statement, options);
         if (user){
             res.status(200).json(user);        
        }        
    } catch (error) {
        res.status(500).json(error);
    }
}
module.exports.getUser = getUser;

async function updateUser(req, res){
    let sql = `
          UPDATE users SET name = '${req.body.name}', address = '${req.body.address}', password = '${req.body.password}', phone = '${req.body.phone}' WHERE id = ${req.id};`;
    try {
        let response = await sequelize.query(sql, {
            type: sequelize.QueryTypes.UPDATE
        })
        if (response){
        res.status(200).json("User succesfully updated"); 
        }       
    } catch (error) {
        res.status(500).json(error);
    }
}
module.exports.updateUser = updateUser;