import { createTransport } from 'nodemailer'

import type { SendMailOptions, TransportOptions } from 'nodemailer'

const mailTransport = createTransport({
    // use TLS
    auth: {
        pass: process.env.EMAIL_PASSWORD,
        user: process.env.EMAIL_USERNAME
    },

    host: process.env.EMAIL_HOST,

    port: process.env.EMAIL_PORT,

    secure: process.env.EMAIL_INSECURE === '1' ? false : true,
    service: process.env.EMAIL_SERVICE,
    tls: {
        ciphers: process.env.EMAIL_CIPHERS,
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
} as TransportOptions)

export const sendEmail = async (options: SendMailOptions): Promise<any> =>
    await mailTransport.sendMail({
        ...options,
        from: process.env.EMAIL_USERNAME,
        ...(process.env.NODE_ENV === 'development' && process.env.DEV_EMAIL
            ? {
                  html:
                      options.html &&
                      `<p>To: ${options.to}</p><br><br>${options.html}`,
                  text: options.text && `To: ${options.to}\n\n${options.text}`,
                  to: process.env.DEV_EMAIL
              }
            : {})
    })

export const template = `<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    </head>
    <body>
    {content}
    </body>
</html>`
