const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});

const sendEmail = async (to, subject, text) => {
    try {

        const result =
            await brevo.transactionalEmails.sendTransacEmail({

                sender: {
                    name: "NewsNest",
                    email: "newnest2026@gmail.com"
                },

                to: [
                    {
                        email: to
                    }
                ],

                subject: subject,

                textContent: text
            });

        console.log(
            "Email sent successfully:",
            result.messageId
        );

    } catch (error) {

        console.error(
            "Email sending error:",
            error
        );

        throw error;
    }
};

module.exports = sendEmail;