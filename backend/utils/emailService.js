//created the feature to send the remindet email to the user

import nodemailer from 'nodemailer'


const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.GOOGLE_PASSWORD
    }
})

export const sendReturnReminderEmail = async ({ 
    //getting this things as a parameter when we call this function in the controller
    to,
    name,
    bookTitle,
    dueDate
}) => {
    try {
        await transport.sendMail({
            from: process.env.SENDER_EMAIL,
            to,
            subject: 'Return Book Reminder',
            html: `
                <p>Hello ${name},</p>

                <p>This is a reminder to return the book you borrowed from the library.</p>
                <p><strong>Book:</strong> ${bookTitle}</p>
                <p><strong>Due Date:</strong> ${dueDate}</p>
                <p>Please return the book as soon as possible.</p>
                <p>Thank you for using our library.</p>
                <p>Best regards,</p>
                <p>The Library Team</p>
            `
        })

        console.log('Email sent successfully')
    } catch (error) {
        console.error('Error sending email:', error)
    }
}
