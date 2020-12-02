const express = require("express");
const server = new express();
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const sequelize = new Sequelize('mysql://root@localhost:3306/delilah');

function controlProductData (req, res, next){
    if (req.body.name && req.body.price){
        next();
    } else {
        res.status(400).json("Malformed request. One or more parameters missing");
    }
}
module.exports.controlProductData = controlProductData;

function verifyID (req, res, next){
    if (req.id === parseInt(req.params.idUsuario)){
        next();
    } else {
        res.status(400).json("Invalid parameter on request");
    }
}
module.exports.verifyID = verifyID;

function checkBody (req, res, next){
    if (req.body.status){
        next();
    } else {
        res.status(400).json("Malformed request");
    }
}
module.exports.checkBody = checkBody;

function controlID(req, res, next){
    if(req.id === parseInt(req.params.idUsuario)){
        next();
    } else {
        res.status(401).json("Unauthorized action");
    }
}
module.exports.controlID = controlID;

function controlUserData (req, res, next){
    if (req.body.name && req.body.address && req.body.password && req.body.phone){
        next();
    } else {
        res.status(400).json("Malformed request. One or more parameters missing");
    }
}
module.exports.controlUserData = controlUserData;

function checkCart(req, res, next){
    if(req.body.cart && req.body.paymentMTD){
        next();
    } else {
        res.status(400).json("Malformed request. One or more parameters missing");
    }
}
module.exports.checkCart = checkCart;
