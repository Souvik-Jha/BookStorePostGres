const client = require("../Connection/connection")
const validator = require("../validators/validate")
const nameRegex = /^[a-zA-Z ]{2,45}$/;


const addSeller = async function (req, res) {
    try {
        let data = req.body
        if (!validator.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "provide data to create seller" })
        let { name, address, phone } = data

        if (!name) return res.status(400).send({ status: false, message: "name is required" })
        if (!(validator.isValid(name)) || !(nameRegex.test(name))) return res.status(400).send({ status: false, message: "name must be in string & not empty" })

        if (!address) return res.status(400).send({ status: false, message: "address is required" })
        if (!(validator.isValid(address))) return res.status(400).send({ status: false, message: "address must be in string & not empty" })

        if (!phone) return res.status(400).send({ status: false, message: "phone number must be present" })
        if (!(/^[6-9]{1}[0-9]{9}$/im.test(phone))) return res.status(400).send({ status: false, message: "Phone number is invalid." })
        if (!validator.isValid(phone)) { return res.status(400).send({ status: false, message: "provide phone no. in string." }); }
        const uniqueMobile = await client.query("select from seller s where s.phone= $1",[phone])
        if (uniqueMobile.rows.length) return res.status(400).send({ status: false, message: "Phone number already exists." })

        let createData = await client.query(`INSERT INTO "seller"(name, address, phone, isdeleted, created_on) VALUES($1,$2,$3,$4,$5)`,[name, address,phone,false, new Date])
        
        return res.status(201).send({ status: true, message: createData })
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
}


const getSeller = async function (req, res) {
    try {
        let getSeller = await client.query("select * from seller where isdeleted = $1 ",[false])
        if (!getSeller.rows.length) return res.status(400).send({ status: false, message: "no such seller" })
        return res.status(200).send({ status: true, message: getSeller.rows })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}


const updateSeller = async function (req, res) {
    try {
        let data = req.body
        let sellerId = req.params.sellerId

        let checkSeller = await client.query("select * from seller where id = $1",[sellerId])
        if (!checkSeller.rows.length) return res.status(400).send({ status: false, message: "seller dosenot exist" })
        if(checkSeller.rows[0].isdeleted==true) return res.status(400).send({status:false,message:"seller info is deleted"})


        if (!validator.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "provide data to update seller" })
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
            const uniqueMobile = await client.query("select phone from seller where phone = $1",[phone])
            if (uniqueMobile.rows.length) return res.status(400).send({ status: false, message: "Phone number already exists." })
        }

        let updatedSeller = await client.query("update seller set name=$1,address=$2,phone=$3 where id=$4",[name,address,phone,sellerId])
        return res.status(200).send({ status: true, updateCount: updatedSeller })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}


const deleteSeller = async function (req, res) {
    try {
        let sellerId = req.params.sellerId

        let checkSeller = await client.query("select * from seller where id = $1",[sellerId])
        if (!checkSeller.rows.length) return res.status(400).send({ status: false, message: "seller dosenot exist" })
        if(checkSeller.rows[0].isdeleted==true) return res.status(400).send({status:false,message:"seller info is deleted"})

        let updatedSeller = await client.query("update seller set isdeleted=$1 where id = $2",[true,sellerId])
        return res.status(200).send({ status: true, deleteCount: updatedSeller })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { addSeller, getSeller, updateSeller, deleteSeller }