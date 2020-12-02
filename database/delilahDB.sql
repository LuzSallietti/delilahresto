CREATE TABLE `users` (
    `id` INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `user` VARCHAR(20) NOT NULL UNIQUE,
    `name` VARCHAR (40) NOT NULL,
    `email` VARCHAR(320) NOT NULL UNIQUE,
    `address` VARCHAR(100) NOT NULL,    
    `password` VARCHAR(20) NOT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `role` VARCHAR(8) NOT NULL
);

CREATE TABLE `orders` (
    `number` INT (11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `status` VARCHAR (10) NOT NULL,
    `time` TIME NOT NULL,   
    `paymentMTD` VARCHAR(15) NOT NULL,
    `total` DOUBLE (5,2) NOT NULL,
    `userID` INT (11) NOT NULL,      
) 
ALTER TABLE `orders` ADD
    FOREIGN KEY (userID) REFERENCES users(id);

CREATE TABLE `products_x_order`(
    `item_id` INT (11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `qty` INT (4) NOT NULL,
    `prod_id` INT(11) NOT NULL,
    `order_number` INT(11) NOT NULL    
)
ALTER TABLE `products_x_order` ADD FOREIGN KEY (prod_id) REFERENCES products(id);
ALTER TABLE `products_x_order` ADD FOREIGN KEY (order_number) REFERENCES orders(number);
ALTER TABLE `products_x_order`ADD `total` DOUBLE(5,2);
ALTER TABLE `products_x_order`ADD `prod_price` DOUBLE(5,2);

CREATE TABLE `products`(
    `id` INT (11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR (40) NOT NULL,
    `price` DOUBLE(5, 2) NOT NULL, 
    `image` VARCHAR(100) -- definir
)



-- PRODUCTS
-- Cliente y admin--> RETRIEVE a todos los productos
SELECT * FROM `products`;

-- Admin --> CREATE nuevo producto
INSERT INTO `products` (name, price) VALUES ("Chocotorta", 389);
INSERT INTO `products` (name, price) VALUES ("Lemon Pie", 475);
INSERT INTO `products` (name, price) VALUES ("Strawberry Pavlova", 650);

--Admin --> UPDATE producto
UPDATE `products` SET name ="Pavlova de Frutos Rojos" WHERE name = "Strawberry Pavlova";
UPDATE `products` SET `name` ="Summer Lemon Cake",`price`= 525 WHERE id = 3;

--Admin --> DELETE producto
DELETE FROM `products` WHERE id = 1; --borra Chocotorta


-- OK!
SELECT orders.number, orders.status, orders.time, orders.paymentMTD, orders.total, users.name , users.address, users.phone, products_x_order.qty, products.name, products_x_order.total FROM orders INNER JOIN users ON users.id = orders.userID 
INNER JOIN products_x_order ON products_x_order.order_number = orders.number
INNER JOIN products ON products.id = products_x_order.prod_id

--Desglose
SELECT orders.number, orders.status, orders.time, orders.paymentMTD, orders.total, users.name , users.address, users.phone FROM orders INNER JOIN users ON users.id = orders.userID



