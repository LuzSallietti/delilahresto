CREATE DATABASE IF NOT EXISTS delilah;
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
    `userID` INT (11) NOT NULL      
); 
ALTER TABLE `orders` ADD FOREIGN KEY (userID) REFERENCES users(id);
CREATE TABLE `products_x_order`(
    `item_id` INT (11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `qty` INT (4) NOT NULL,
    `prod_id` INT(11) NOT NULL,
    `order_number` INT(11) NOT NULL    
);
ALTER TABLE `products_x_order`ADD `total` DOUBLE(5,2);
ALTER TABLE `products_x_order`ADD `prod_price` DOUBLE(5,2);
ALTER TABLE `products_x_order` ADD FOREIGN KEY (order_number) REFERENCES orders(number);
CREATE TABLE `products`(
    `id` INT (11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR (40) NOT NULL,
    `price` DOUBLE(5, 2) NOT NULL, 
    `image` VARCHAR(320) 
);
ALTER TABLE `products_x_order` ADD FOREIGN KEY (prod_id) REFERENCES products(id);
-- Crear un usuario admin
INSERT INTO `users` (user, name , email, address , password, phone, role) VALUES ("admin", "Luz Sallietti", "luz@mail.com", "Bv. Los Talas 3456", "delilahadmin", "+5493512258963", "admin");
-- Crear un usuario cliente
INSERT INTO `users` (user, name , email, address , password, phone, role) VALUES ("lolacatala", "Lola Catalá", "lola@mail.com", "Psj. Córdoba 124", "lola2020", "+5493518954214", "customer");
-- Crear nuevo producto
INSERT INTO `products` (name, price) VALUES ("Chocotorta", 389);
INSERT INTO `products` (name, price) VALUES ("Lemon Pie", 475);
