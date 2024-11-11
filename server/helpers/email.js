import * as config from "../config.js";

const style = `
    background: #eee;
    padding: 20px;
    border-radius: 20px;
`;

export const emailTemplate = (email, content, replyTo, subject) => {
  return {
    // Source: config.EMAIL_FROM,
    // Destination: {
    //   ToAddresses: [email],
    // },
    // Message: {
    //   Body: {
    //     Html: {
    //       Charset: "UTF-8",
    //       Data: `
    //             <html>
    //                 <div style="${style}">
    //                     <h1>Welcome to Real Estate</h1>
    //                     ${content}
    //                     <p>&copy; ${new Date().getFullYear()}</p>
    //                 </div>
    //             </html>
    //           `,
    //     },
    //   },
    //   Subject: {
    //     Charset: "UTF-8",
    //     Data: "Welcome to Real Estate",
    //   },
    // },
    from: config.EMAIL_FROM,
    to: [email],
    subject: subject,
    html: ` <div style="${style}">
              <h1>Welcome to Real Estate</h1>
              ${content}
              <p>&copy; ${new Date().getFullYear()}</p>
            </div>
        `,
  };
};
