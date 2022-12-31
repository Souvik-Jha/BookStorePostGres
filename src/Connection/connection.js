const {Client} = require("pg")

const client = new Client({
    host:"94.130.34.104",
    user:"postgres",
    port:5052,
    password:"securedaccess",
    database:"bookPro"
})

client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
// client.on("connect",()=>{
//     console.log("database is connected")
// })
// client.on("end",()=>{
//     console.log("connection end")
// })






module.exports = client
