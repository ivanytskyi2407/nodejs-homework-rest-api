const { User, joiEmailSchema } = require("../../models");
const { createError, sendEmail } = require("../../helpers");

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const { error } = joiEmailSchema.validate(req.body);
  if (error) {
    throw createError(400, error.message);
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw createError(404);
  }
  if (user.verify) {
    throw createError(400, "Verification has already been passed");
  }
  const mail = {
    to: email,
    subject: "Підтвердження реєстрації",
    html: `<a target="_blank" href="http://localhost:3000/api/auth/verify/${user.verificationToken}">Натисни для підтеврдження реєстрації</a>`,
  };

  await sendEmail(mail);

  res.status(200).json({ message: "Verification email sent" });
};
module.exports = resendVerifyEmail;
