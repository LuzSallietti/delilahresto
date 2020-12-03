const express = require("express");
const server = new express();
const dotenv = require("dotenv");
dotenv.config();
const jwt = require ("jsonwebtoken");
const db_config = require('../config');
const Sequelize = require("sequelize");
const sequelize = new Sequelize( db_config.conf_db_name, db_config.conf_user, db_config.conf_password, { 
    host: db_config.conf_db_host,
    dialect: 'mysql',
    port: db_config.conf_port,
    dialectOptions: {
        multipleStatements: true
    }
});

async function createProducts (req, res) {  
   
    let values = [req.body.name, req.body.price, req.body.image]    
    let statement = "INSERT INTO products (name, price, image) VALUES (?)";
    let options = { replacements: [values] };
    try {
        let new_product = await sequelize.query(statement, options);    
        res.status(201).json({msg: "Product succesfully created", id: new_product[0]});
        
    } catch (error) {
        res.status(500).json(error);        
    }    
    
    }

module.exports.createProducts = createProducts;

async function getProducts (req, res){
    let statement = "SELECT * FROM products";
    let options = { type: sequelize.QueryTypes.SELECT };
    try {
        let response = await sequelize.query(statement, options);
        if (response.length > 0) {
            res.status(200).json(response);
        } else {
            res.status(200).json({ msg: "No products stored on database yet" });
        }        
        
    } catch (error) {
        res.status(500).json(error);
    }    
}
module.exports.getProducts = getProducts;

async function updateProducts (req, res){
    let sql = `
          UPDATE products
          SET name = '${req.body.name}',
          price = ${req.body.price},
          image = '${req.body.image}'
          WHERE id = ${req.params.id};
        `;
    try {
        let response = await sequelize.query(sql, {
            type: sequelize.QueryTypes.UPDATE
        })
        if (response){
        res.status(200).json("Product succesfully updated"); 
        }       
    } catch (error) {
        res.status(500).json(error);
    }
    
}
module.exports.updateProducts = updateProducts;

async function deleteProducts (req, res){
    let values = [req.params.id];
    let statement = "DELETE FROM products WHERE id = ?";
    let options = { replacements: [values] };
    try {
        let response = await sequelize.query(statement, options);
        if(response[0].affectedRows === 1){
            res.status(200).json("Product succesfully deleted");
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
}
module.exports.deleteProducts = deleteProducts;

async function checkID (req, res, next){
    let prod_id = req.params.id;
    let statement = `SELECT * FROM products WHERE ID = ${prod_id}`;
    let options = { type: sequelize.QueryTypes.SELECT };
    try {
        let result = await sequelize.query(statement, options);
        if (result.length === 1){            
            if (result[0].id === parseInt(prod_id)){
                req.product = result;
                next();
            }        
        } else {
            res.status(400).json("Invalid parameter on request")
        }     
        
    } catch (error) {
        res.status(500).json(error);
    }        
}
module.exports.checkID = checkID;
