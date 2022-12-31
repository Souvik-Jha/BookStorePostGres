const express = require("express");  
const router = express.Router();
const bookController = require("../Controllers/bookController")
const customerController = require("../Controllers/customerController")
const sellerController = require("../Controllers/sellerController")
const customerBookDiscountController = require("../Controllers/customer_book_discountController")


router.post("/book/:sellerId",bookController.addBook)
router.put("/book/:bookId",bookController.updateBook)
router.get("/book",bookController.getBook)
router.delete("/book/:bookId",bookController.deleteBook)


router.post("/customer",customerController.addCustomer)
router.get("/customer",customerController.getCustomer)
router.put("/customer/:customerId",customerController.updateCustomer)
router.delete("/customer/:customerId",customerController.deleteCoustomer)


router.post("/seller",sellerController.addSeller)
router.get("/seller",sellerController.getSeller)
router.put("/seller/:sellerId",sellerController.updateSeller)
router.delete("/seller/:sellerId",sellerController.deleteSeller)

router.post("/discount/:bookId", customerBookDiscountController.adddiscount)

router.post("/customer/:customerId/book/:bookId",customerBookDiscountController.purchaseBook)
router.get("/customer/book",customerBookDiscountController.bookListByCustomer)
router.get("/seller/book",bookController.bookListBySeller)


module.exports = router