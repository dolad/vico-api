const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail = (email,token) => {
    const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Account activation link`,
        html: `
            <h1>Please use the following link to activate your account</h1>
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>${process.env.CLIENT_URL}</p>
        `
    };
    
       sgMail.send(emailData).then(sent =>{
           console.log("email sent", sent);
           return {message: `Email has been sent to ${email}. Follow the instruction to activate your account`}
       }).catch(err => {
        return err.message
       })
}




const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'adavidoladele@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
