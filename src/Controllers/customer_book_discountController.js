const client = require("../Connection/connection")

const adddiscount = async function(req,res){
    try{
        let bookId = req.params.bookId

        //validations

        let checkBook = await client.query("select * from books where id = $1",[bookId])
        if (!checkBook.rows.length) return res.status(400).send({ status: false, message: "book dosenot exist" })
        if(checkBook.rows[0].isdeleted==true) return res.status(400).send({status:false,message:"book info is deleted"})

        const {discount_percentage} = req.body

        if (!discount_percentage) return res.status(400).send({ status: false, message: "discount is required" })
        if (typeof discount_percentage === "undefined" || typeof discount_percentage !== "number") return res.status(400).send({ status: false, message: "discount percentage should be a number" })

        let createData = await client.query(`INSERT INTO "discount"(discount_percentage, status, bookId, created_on) VALUES($1,$2,$3,$4)`,[discount_percentage, "active",bookId, new Date])
        return res.status(201).send({status: true,message:createData})

    }catch(err){
        console.log(err)
        return res.status(500).send({status: false, message : err.message})
    }
}


const purchaseBook = async function(req,res){
    try{
        let bookId = req.params.bookId
        let customerId = req.params.customerId

        let quantity = req.body.quantity

        let checkBook = await client.query("select * from books where id = $1",[bookId])
        if (!checkBook.rows.length) return res.status(400).send({ status: false, message: "book dosenot exist" })
        if(checkBook.rows[0].isdeleted==true) return res.status(400).send({status:false,message:"book info is deleted"})

        let checkcustomer = await client.query("select * from customer where id = $1",[customerId])
        if (!checkcustomer.rows.length) return res.status(400).send({ status: false, message: "customer dosenot exist" })
        if(checkcustomer.rows[0].isdeleted==true) return res.status(400).send({status:false,message:"customer info is deleted"})

        let createData = await client.query(`INSERT INTO "customer_book"(bookid,customerid) VALUES($1,$2)`,[bookId,customerId])
        let updatedBook = await client.query("update books set available= available-$1,sold = sold+$1 where id=$2",[quantity,bookId])
        let result = await client.query("select c.name as CustomerName,address,phone,b.name as BookName, authorName,price,available,sold from customer c, books b,customer_book cb where c.id=cb.customerid and cb.bookid=b.id")

        return res.status(201).send({status:true, message:result.rows})
    }catch(err){
        console.log(err)
        return res.status(500).send({status: false, message : err.message})
    }
} 


const bookListByCustomer = async(req,res)=>{
    try{
        let result = await client.query("select c.name as CustomerName,address,phone,b.name as BookName, authorName,price,available,sold from customer c inner join  customer_book cb on c.id=cb.customerid inner join books b on cb.bookid=b.id")
        return res.status(201).send({status:true, message:result.rows})
    }catch(err){
        console.log(err)
        return res.status(500).send({status: false, message : err.message})
    }
}



module.exports = {adddiscount,purchaseBook,bookListByCustomer}