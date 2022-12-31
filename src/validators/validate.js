const isValidRequestBody = function (request) {
    return Object.keys(request).length > 0;
}

const isValid = (value) => {
    if (typeof value === "undefined" || typeof value === "null") return false;
    if (typeof value === "string" && value.trim().length == 0) return false;
    if (typeof value == "string") return true;
}



module.exports = {isValid, isValidRequestBody}