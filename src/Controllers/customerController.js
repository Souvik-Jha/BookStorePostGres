const client = require("../Connection/connection")
const validator = require("../validators/validate")
const nameRegex = /^[a-zA-Z ]{2,45}$/;


const addCustomer = async function (req, res) {
    try {
        let data = req.body
        if (!validator.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "provide data to create customer" })
        let { name, address, phone } = data

        if (!name) return res.status(400).send({ status: false, message: "name is required" })
        if (!(validator.isValid(name)) || !(nameRegex.test(name))) return res.status(400).send({ status: false, message: "name must be in string & not empty" })

        if (!address) return res.status(400).send({ status: false, message: "address is required" })
        if (!(validator.isValid(address))) return res.status(400).send({ status: false, message: "address must be in string & not empty" })

        if (!phone) return res.status(400).send({ status: false, message: "phone number must be present" })
        if (!(/^[6-9]{1}[0-9]{9}$/im.test(phone))) return res.status(400).send({ status: false, message: "Phone number is invalid." })
        if (!validator.isValid(phone)) { return res.status(400).send({ status: false, message: "provide phone no. in string." }); }
        const uniqueMobile = await client.query("select from customer s where s.phone= $1",[phone])
        if (uniqueMobile.rows.length) return res.status(400).send({ status: false, message: "Phone number already exists." })

        let createData = await client.query(`INSERT INTO "customer"(name, address, phone, isdeleted, created_on) VALUES($1,$2,$3,$4,$5)`,[name, address,phone,false, new Date])
        
        return res.status(201).send({ status: true, message: createData })
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
}



const getCustomer = async function (req, res) {
    try {
        let Customers = await client.query("select * from customer where isdeleted = $1",[false])
        if (!Customers.rows.length) return res.status(400).send({ status: false, message: "no such customer" })
        return res.status(200).send({ status: true, message: Customers.rows })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}


const updateCustomer = async function (req, res) {
    try {
        let data = req.body
        let customerId = req.params.customerId

        let checkcustomer = await client.query("select * from customer where id = $1",[customerId])
        if (!checkcustomer.rows.length) return res.status(400).send({ status: false, message: "customer dosenot exist" })
        if(checkcustomer.rows[0].isdeleted==true) return res.status(400).send({status:false,message:"customer info is deleted"})


        if (!validator.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "provide data to update customer" })
        let { name, address, phone } = data

        if (name) {
            if (!(validator.isValid(name)) || !(nameRegex.test(name))) return res.status(400).send({ status: false, message: "name must be in string & not empty" })
        }

        if (address) {
            if (!(validator.isValid(address))) return res.status(400).send({ status: false, message: "address must be in string & not empty" })
        }

        if (phone) {
            if (!(/^[6-9]{1}[0-9]{9}$/im.test(phone))) return res.status(400).send({ status: false, message: "Phone number is invalid." })
            if (!validator.isValid(phone)) { return res.status(400).send({ status: false, message: "provide phone no. in string." }); }
            const uniqueMobile = await client.query("select phone from customer where phone = $1",[phone])
            if (uniqueMobile.rows.length) return res.status(400).send({ status: false, message: "Phone number already exists." })
        }

        let updatedcustomer = await client.query("update customer set name=$1,address=$2,phone=$3 where id=$4",[name,address,phone,customerId])
        return res.status(200).send({ status: true, updateCount: updatedcustomer })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}


const deleteCoustomer = async function (req, res) {
    try {
        let customerId = req.params.customerId

        let checkcustomer = await client.query("select * from customer where id = $1",[customerId])
        if (!checkcustomer.rows.length) return res.status(400).send({ status: false, message: "customer dosenot exist" })
        if(checkcustomer.rows[0].isdeleted==true) return res.status(400).send({status:false,message:"customer info is deleted"})

        let updatedcustomer = await client.query("update customer set isdeleted=$1 where id = $2",[true,customerId])
        return res.status(200).send({ status: true, deleteCount: updatedcustomer })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { addCustomer, getCustomer, updateCustomer, deleteCoustomer }