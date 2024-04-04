const nodemailer = require("nodemailer");
const fs = require("fs");

function sendMail(recipient, type, opt) {
  const templatePath = `./template/${type}.html`;
  let template = fs.readFileSync(templatePath, "utf8");

  template = template.replace(/{{url}}|{{code}}|{{name}}/g, (match) => {
    switch (match) {
      case "{{url}}":
        return opt.url || "";
      case "{{code}}":
        return opt.code || "";
      case "{{name}}":
        return opt.name || "";
      default:
        return match;
    }
  });

  let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    auth: {
      user: "test.tije@outlook.com",
      pass: "pengabdihesa",
    },
  });

  let message = {
    html: template,
    from: "test.tije@outlook.com", // listed in rfc822 message header
    to: recipient, // listed in rfc822 message header
    envelope: {
      from: "test tije <test.tije@outlook.com>", // used as MAIL FROM: address for SMTP
      to: `${recipient.split("@")[0]} <${recipient}>`, // used as RCPT TO: address for SMTP
    },
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
  });
}

module.exports = {
  sendMail,
};
