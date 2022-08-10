const { User } = require("../../models");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const { sendEmail } = require("../../helpers");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      data: "Conflict",
      message: "Email is already use",
    });
  }
  const hashpassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();
  const newUser = await User.create({
    email,
    password: hashpassword,
    avatarURL,
    subscription: "starter",
    verificationToken,
  });

  const mail = {
    to: email,
    subject: "Підтвердження реєстрації",
    html: `<a target="_blank" href="http://localhost:3000/api/auth/verify/${verificationToken}">Натисни для підтеврдження реєстрації</a>`,
  };
  await sendEmail(mail);

  res.status(201).json({
    status: "Created",
    ResponseBody: {
      user: newUser,
    },
  });
};
module.exports = register;
