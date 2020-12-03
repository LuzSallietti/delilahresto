const dotenv = require("dotenv");
dotenv.config();

const conf_db_host = 'localhost';
const conf_db_name   = 'delilah'; 
const conf_user     = 'root';           
const conf_password = process.env.DB_pass;               
const conf_port     = '3306';           
module.exports = {
    conf_db_name   : conf_db_name,
    conf_user     : conf_user,
    conf_password : conf_password,
    conf_port     : conf_port
};