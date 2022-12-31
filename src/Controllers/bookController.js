const client = require("../Connection/connection")
const validator = require("../validators/validate")
const nameRegex = /^[a-zA-Z ]{2,45}$/;



const addBook = async function (req, res) {
    try {
        let data = req.body
        let sellerId = req.params.sellerId

        //validations

        let checkSeller = await client.query("select * from seller where id = $1",[sellerId])
        if (!checkSeller.rows.length) return res.status(400).send({ status: false, message: "seller dosenot exist" })
        if(checkSeller.rows[0].isdeleted==true) return res.status(400).send({status:false,message:"seller info is deleted"})


        const { name, authorName, price, available, sold } = data

        if (!validator.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "provide data to create book" })

        if (!name) return res.status(400).send({ status: false, message: "name is required" })
        if (!(validator.isValid(name)) || !(nameRegex.test(name))) return res.status(400).send({ status: false, message: "name must be in string & not empty" })

        if (!authorName) return res.status(400).send({ status: false, message: "authorName is required" })
        if (!validator.isValid(authorName) || !(nameRegex.test(authorName))) return res.status(400).send({ status: false, message: "authorNname must be in string & not empty" })

        if (!price) return res.status(400).send({ status: false, message: "price is required" })
        if (typeof price === "undefined" || typeof price !== "number") return res.status(400).send({ status: false, message: "price should be a number" })

        if (!available) return res.status(400).send({ status: false, message: "Available is required" })
        if (typeof available === "undefined" || typeof available !== "number") return res.status(400).send({ status: false, message: "Available should be a number" })

        if (sold) {
            if (typeof sold === "undefined" || typeof sold !== "number") return res.status(400).send({ status: false, message: "Sold should be a number" })
        }


        //create Book

        let createData = await client.query(`INSERT INTO "books"(name, authorName, price, available, sold, isdeleted, created_on, sellerid) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,[name, authorName, price, available, sold,false, new Date, sellerId])
        return res.status(201).send({ status: true, message: createData })
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
}


const updateBook = async function (req, res) {
    try {
        let data = req.body
        let bookId = req.params.bookId

        //validations

        let checkBook = await client.query("select * from books where id = $1",[bookId])
        if (!checkBook.rows.length) return res.status(400).send({ status: false, message: "book dosenot exist" })
        if(checkBook.rows[0].isdeleted==true) return res.status(400).send({status:false,message:"book info is deleted"})


        let { name, authorName, price, available, sold } = data

        if (!validator.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "provide data to update book" })

        if (name) {
            if (!(validator.isValid(name)) || !(nameRegex.test(name))) return res.status(400).send({ status: false, message: "name must be in string & not empty" })
        }

        if (authorName) {
            if (!validator.isValid(authorName) || !(nameRegex.test(authorName))) return res.status(400).send({ status: false, message: "authorNname must be in string & not empty" })
        }

        if (price) {
            if (typeof price === "undefined" || typeof price !== "number") return res.status(400).send({ status: false, message: "price should be a number" })
        }

        if (available) {
            if (typeof available === "undefined" || typeof available !== "number") return res.status(400).send({ status: false, message: "Available should be a number" })
        }

        if (sold) {
            if (typeof sold === "undefined" || typeof sold !== "number") return res.status(400).send({ status: false, message: "Sold should be a number" })
        }

        //update book

        let updatedBook = await client.query("update books set name=$1,authorName=$2,price=$3,available= available+$5,sold = sold+$6 where id=$4",[name,authorName, price, bookId, available,sold])
        return res.status(200).send({ status: true, updateCount: updatedBook })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}



const getBook = async function (req, res) {
    try {

        let data = await client.query("select *,b.price-(b.price*d.discount_percentage)/100 as discountedPrice from books b left join discount d on d.bookid= b.id where isdeleted = $1",[false])
        if (!data.rows.length) return res.status(404).send({status:false, msg: "no such book " })
        return res.status(200).send({ status:true,msg: data.rows })
        
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })

    }
}




const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId

        //validations

        let checkBook = await client.query("select * from books where id = $1",[bookId])
        if (!checkBook.rows.length) return res.status(400).send({ status: false, message: "book dosenot exist" })
        if(checkBook.rows[0].isdeleted==true) return res.status(400).send({status:false,message:"book info is deleted"})

        let updatedBook = await client.query("update books set isdeleted=$1 where id = $2",[true,bookId])
        return res.status(200).send({ status: true, deleteCount: updatedBook })


    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}


const bookListBySeller = async function(req,res){
    try{
        let result = await client.query("select s.name as SellerName,address,phone,b.name as BookName, authorName,price,available,sold from books b join seller s on b.sellerid = s.id where sold>0")
        return res.status(201).send({status:true, message:result.rows})
    }catch(err){
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })  
    }
}

module.exports = { addBook, getBook, updateBook, deleteBook , bookListBySeller}