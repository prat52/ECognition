import { createTransport } from "nodemailer";

const sendMail = async (email, subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            color: #fff;
        }
        .container {
            background-color: rgba(255, 255, 255, 0.9);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 400px;
            width: 100%;
            animation: fadeIn 1s ease-in-out;
        }
        h1 {
            color: #e74c3c;
            font-size: 28px;
            margin-bottom: 10px;
        }
        p {
            margin-bottom: 20px;
            color: #333;
            font-size: 16px;
        }
        .otp {
            font-size: 40px;
            color: #7b68ee; /* Purple text */
            letter-spacing: 3px;
            margin-bottom: 30px;
        }
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello ${data.name}, your One-Time Password for account verification is:</p>
        <p class="otp">${data.otp}</p> 
    </div>
</body>
</html>
`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject,
    html,
  });
};

export default sendMail;

export const sendForgotMail = async (subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #6a11cb, #2575fc);
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: #333;
    }
    .container {
      background-color: rgba(255, 255, 255, 0.9);
      padding: 30px;
      margin: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      max-width: 600px;
      width: 100%;
      animation: fadeIn 1s ease-in-out;
      text-align: center;
    }
    h1 {
      color: #5a2d82;
      font-size: 28px;
      margin-bottom: 20px;
    }
    p {
      color: #555555;
      font-size: 16px;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 15px 25px;
      margin: 20px 0;
      background-color: #5a2d82;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 18px;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #482164;
    }
    .footer {
      margin-top: 30px;
      color: #999999;
      font-size: 14px;
    }
    .footer a {
      color: #5a2d82;
      text-decoration: none;
      font-weight: bold;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Your Password</h1>
    <p>Hello,</p>
    <p>You have requested to reset your password. Please click the button below to reset your password.</p>
    <a href="${process.env.frontendurl}/reset-password/${data.token}" class="button">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    <div class="footer">
      <p>Thank you,<br>ELearnPlatform</p>
      <p><a href="https://elearningapp.netlify.app/">elearningapp.netlify.app/</a></p>
    </div>
  </div>
</body>
</html>

`;

  await transport.sendMail({
    //fixme:rs
    from: process.env.Gmail,
    to: data.email,
    subject,
    html,
  });
};
