    const express = require("express");
    const server = new express();
    const dotenv = require("dotenv");
    dotenv.config();    
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
    
    async function getAllOrders(req, res){

    let results = [];
    let statement = "SELECT orders.number, orders.status, orders.time, orders.paymentMTD, orders.total, users.name , users.address, users.phone FROM orders INNER JOIN users ON users.id = orders.userID";
    let options = { type: sequelize.QueryTypes.SELECT };
    try {
        let orders = await sequelize.query(statement, options);
        for (let i = 0; i < orders.length; i++) {
            let order_detail = orders[i];
            let statement = `SELECT products_x_order.prod_id, products_x_order.qty, products_x_order.total FROM products_x_order WHERE order_number = ${orders[i].number}`;
            let options = { type: sequelize.QueryTypes.SELECT };
            let cart = await sequelize.query(statement, options);

            for (let i = 0; i < cart.length; i++) {
                let product = cart[i];
                let prod_id = cart[i].prod_id;
                let statement = `SELECT products.name FROM products WHERE id = ${prod_id}`;
                let options = { type: sequelize.QueryTypes.SELECT };
                let prod_name = await sequelize.query(statement, options);
                product.name = prod_name[0].name;
            }
        results.push({ order_detail, cart });
    }
    res.json(results);
        
    } catch (error) {
        res.status(500).json(error);        
    }
    
}
module.exports.getAllOrders = getAllOrders;

async function getCustomerOrders(req, res){
    let user_id = req.params.idUsuario;
    let results = [];
    let statement = `SELECT orders.number, orders.status, orders.time, orders.paymentMTD, orders.total FROM orders WHERE orders.userID = ${user_id}`;
    let options = { type: sequelize.QueryTypes.SELECT };
    try {
        let orders = await sequelize.query(statement, options);

        for (let i = 0; i < orders.length; i++) {
            let order_detail = orders[i];
            let statement = `SELECT products_x_order.prod_id, products_x_order.qty, products_x_order.total FROM products_x_order WHERE order_number = ${orders[i].number}`;
            let options = { type: sequelize.QueryTypes.SELECT };
            let cart = await sequelize.query(statement, options);

            for (let i = 0; i < cart.length; i++) {
                let product = cart[i];
                let prod_id = cart[i].prod_id;
                let statement = `SELECT products.name FROM products WHERE id = ${prod_id}`;
                let options = { type: sequelize.QueryTypes.SELECT };
                let prod_name = await sequelize.query(statement, options);
                product.name = prod_name[0].name;
            }
            results.push({ order_detail, cart });
        }
        res.json(results);
        
    } catch (error) {
        res.status(500).json(error);
    }
    
}
module.exports.getCustomerOrders = getCustomerOrders;

async function createOrder (req, res){
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let userID = parseInt(req.id);
    let paymentMTD = req.body.paymentMTD;
    let order_number;
    let cart = req.body.cart;
    let items_added = 0;
    let order_total = 0;

    //crear la orden
    let values = ['new', `${hours}:${minutes}`, paymentMTD, userID];
    let statement = "INSERT INTO orders (status, time, paymentMTD, userID) VALUES (?)";
    let options = { replacements: [values] };
    try {
        let order_creation = await sequelize.query(statement, options);
        order_number = order_creation[0];
        let response = await createProductsXOrder(order_number);
        
    } catch (error) {
        res.status(500).json(error);
    }  


    //asignar precio a cada item de la orden
    //crear los registros products_x_order para cada producto añadido al carrito
    async function createProductsXOrder(number) {

        for (let i = 0; i < cart.length; i++) {
            let prod_id = cart[i].id;
            let qty = cart[i].qty;
            let prod_price = cart[i].price;
            let order_number = number;
            let total = prod_price * qty;

            let values = [qty, prod_id, order_number, prod_price, total];
            let statement = "INSERT INTO products_x_order (qty, prod_id, order_number, prod_price, total) VALUES (?)";
            let options = { replacements: [values] };
            let response = await sequelize.query(statement, options);
            items_added = items_added + response[1];
            order_total = order_total + total;
        }

        let values = [number];
        let statement = `UPDATE orders SET total = ${order_total} WHERE number = ?`;
        let options = { replacements: [values] };
        let response = await sequelize.query(statement, options);

        return response;
    }
    res.status(200).json({ msg: "Order succesfully created", order_number: order_number, order_total: order_total, items_added: items_added })
}
module.exports.createOrder = createOrder;

async function updateOrder(req, res){
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let order_number = req.params.nroOrden;
    let new_status = req.body.status;

    let statement = `
          UPDATE orders
          SET status = '${new_status}',
          time = '${hours}:${minutes}'          
          WHERE number = ${order_number};
        `;
    try {
        let response = await sequelize.query(statement, {
            type: sequelize.QueryTypes.UPDATE
        })    
        if (response){
            res.status(200).json("Order succesfully updated");
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
    
}
module.exports.updateOrder = updateOrder;

async function checkOrder(req, res, next) {
    let order_number = req. params.nroOrden;
    let statement = `SELECT orders.number FROM orders WHERE orders.number = ${order_number}`;
    let options = { type: sequelize.QueryTypes.SELECT };
    try {
        let result = await sequelize.query(statement, options);
            if (result.length === 1){                
                next();
            } else {
                res.status(400).json("Invalid parameter on request")
            }
        
    } catch (error) {
         res.status(500).json(error);       
    }            
    
}
module.exports.checkOrder = checkOrder;

async function getOrderDetail (req, res){
    let order_number = req.params.nroOrden;
    let results = [];
    let statement = `SELECT orders.number, orders.status, orders.time, orders.paymentMTD, orders.total, users.name , users.address, users.phone FROM orders INNER JOIN users ON users.id = orders.userID WHERE orders.number = ${order_number}`;
    let options = { type: sequelize.QueryTypes.SELECT };
    try {
        let orders = await sequelize.query(statement, options);
        for (let i = 0; i < orders.length; i++) {
            let order_detail = orders[i];
            let statement = `SELECT products_x_order.prod_id, products_x_order.qty, products_x_order.total FROM products_x_order WHERE order_number = ${orders[i].number}`;
            let options = { type: sequelize.QueryTypes.SELECT };
            let cart = await sequelize.query(statement, options);

            for (let i = 0; i < cart.length; i++) {
                let product = cart[i];
                let prod_id = cart[i].prod_id;
                let statement = `SELECT products.name FROM products WHERE id = ${prod_id}`;
                let options = { type: sequelize.QueryTypes.SELECT };
                let prod_name = await sequelize.query(statement, options);
                product.name = prod_name[0].name;
            }
        results.push({ order_detail, cart });
    }
    res.json(results);
        
    } catch (error) {
        res.status(500).json(error);        
    }
}
module.exports.getOrderDetail = getOrderDetail;

async function getCustomerOrderDetail(req, res){
    let order_number = req.params.nroOrden;
    let user_id = req.id;
    let results = [];
    let statement = `SELECT orders.number, orders.status, orders.time, orders.paymentMTD, orders.total, users.name , users.address, users.phone FROM orders INNER JOIN users ON users.id = orders.userID WHERE orders.number = ${order_number} AND orders.userID = ${user_id}`;
    let options = { type: sequelize.QueryTypes.SELECT };
    try {
        let orders = await sequelize.query(statement, options);
        for (let i = 0; i < orders.length; i++) {
            let order_detail = orders[i];
            let statement = `SELECT products_x_order.prod_id, products_x_order.qty, products_x_order.total FROM products_x_order WHERE order_number = ${orders[i].number}`;
            let options = { type: sequelize.QueryTypes.SELECT };
            let cart = await sequelize.query(statement, options);

            for (let i = 0; i < cart.length; i++) {
                let product = cart[i];
                let prod_id = cart[i].prod_id;
                let statement = `SELECT products.name FROM products WHERE id = ${prod_id}`;
                let options = { type: sequelize.QueryTypes.SELECT };
                let prod_name = await sequelize.query(statement, options);
                product.name = prod_name[0].name;
            }
        results.push({ order_detail, cart });
    }
    res.json(results);
        
    } catch (error) {
        res.status(500).json(error);        
    }
}
module.exports.getCustomerOrderDetail = getCustomerOrderDetail;

async function deleteOrder (req, res){
    let values = [req.params.nroOrden];
    let statement = "DELETE FROM orders WHERE number = ?";
    let options = { replacements: [values] };
    try {
        let response = await sequelize.query(statement, options);
        if(response[0].affectedRows === 1){
            res.status(200).json("Order succesfully deleted");
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
}
module.exports.deleteOrder = deleteOrder;
