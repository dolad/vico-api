const successMessage = (para = "request") => {
    return `${para} succesfully`
    
}

const errMessage = (para = "request") => {
    return `${para} unsuccesfully`
    
}

module.exports = {
    successMessage,
    errMessage
}