import { createTransport, TransportOptions, SendMailOptions } from 'nodemailer'

const mailTransport = createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_INSECURE === '1' ? false : true, // use TLS
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
        ciphers: process.env.EMAIL_CIPHERS
    }
} as TransportOptions)

export const sendEmail = async (options: SendMailOptions): Promise<any> =>
    await mailTransport.sendMail({
        ...options,
        from: process.env.EMAIL_USERNAME
    })

export const template = `<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    </head>
    <body>
    {content}
    </body>
</html>`
