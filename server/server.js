const express = require("express");
const server = new express();
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const sequelize = new Sequelize('mysql://root@localhost:3306/delilah');
const auth = require("./services/auth");
const verifyRole = auth.verifyRole;
const verifyToken = auth.verifyToken;

const products_sql = require("./services/products_sql");
const users_sql = require("./services/users_sql");
const orders_sql = require("./services/orders_sql");
const control_middlewares = require("./middlewares/control_middlewares");
const control_prod_data = control_middlewares.controlProductData;
const checkID = products_sql.checkID;
const verifyID = control_middlewares.verifyID;
const checkBody = control_middlewares.checkBody;
const controlID = control_middlewares.controlID;
const controlUserData = control_middlewares.controlUserData;
const checkCart = control_middlewares.checkCart;
const checkOrder = orders_sql.checkOrder;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//PRODUCTOS

//CREATE
//Sólo admin autenticado puede crear productos
server.post("/v1/productos", verifyToken, verifyRole, control_prod_data, (req, res) => {
    products_sql.createProducts(req, res);
})

//READ
// Listar todos los productos 
server.get("/v1/productos", verifyToken, (req, res) => {
    products_sql.getProducts(req, res);
})
// Listar un producto por su ID
server.get("/v1/productos/:id", verifyToken, checkID, (req, res) => {
    let product = req. product;
    res.status(200).json(product);
})

//UPDATE
//Solo admin autenticado puede actualizar productos
server.put("/v1/productos/:id", verifyToken, verifyRole, control_prod_data, checkID, (req, res) => {
    products_sql.updateProducts(req,res);
})

//DELETE
//Solo admin autenticado puede eliminar productos
server.delete("/v1/productos/:id", verifyToken, verifyRole, checkID, (req, res) => {
    products_sql.deleteProducts(req, res);
})

//USUARIOS
// CREATE --> crear cuenta usuario / REGISTRO
// middlewares verifican campos requeridos completos y si el email y el usuario ya están registrados (deben ser únicos)

server.post("/v1/registro", users_sql.checkReq, users_sql.checkUniqueData, (req, res) => {
    users_sql.registerUser(req, res);
})

//POST --> LOGIN
//autenticación con JWT 
server.post("/v1/login", (req, res) => {    
    users_sql.login(req,res); 
})

//READ --> Todos los usuarios --> solo el admin puede listar todos los usuarios | el cliente solo puede acceder a su información personal

server.get("/v1/usuarios", verifyToken, verifyRole, (req, res) => {
    users_sql.getAllUsers(req, res);
})

server.get("/v1/usuarios/usuario/:idUsuario", verifyToken, controlID, (req, res) => {
    users_sql.getUser(req, res);
})
//UPDATE --> Actualizar información de usuario propia
server.put("/v1/usuarios/usuario/:idUsuario", verifyToken, controlID, controlUserData, (req, res) => {
    users_sql.updateUser(req, res);
})

//PEDIDOS
//READ --> Todos los pedidos --> solo el admin puede listar todos los pedidos | el cliente solo puede ver el historial de los pedidos propios
server.get("/v1/pedidos", verifyToken, verifyRole, (req, res) => {    
        orders_sql.getAllOrders(req, res);
})
server.get("/v1/pedidos/usuario/:idUsuario", verifyToken, verifyID, (req, res) => {
    orders_sql.getCustomerOrders(req, res);
})
server.get("/v1/pedidos/:nroOrden", verifyToken, verifyRole, checkOrder, (req, res) => {
    orders_sql.getOrderDetail(req, res); //ok
})
server.get("/v1/pedidos/cliente/:nroOrden", verifyToken, (req, res) => {
    orders_sql.getCustomerOrderDetail(req, res);
})

//CREATE --> crear nuevo pedido
server.post("/v1/pedidos", verifyToken, checkCart, (req, res) => {
    orders_sql.createOrder(req, res);    
})

//UPDATE --> solo el admin puede actualizar el estado de un pedido
server.put("/v1/pedidos/:nroOrden", verifyToken, verifyRole, checkOrder, checkBody, (req, res) => {
    orders_sql.updateOrder(req, res);
})

// vincular servidor al puerto
server.listen(process.env.PORT, () => {
    console.log("Listening en puerto " + process.env.PORT);
})
