const db = require("../models");
const bc = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;
  const targetUser = await db.User.findOne({ where: { username } });

  if (targetUser) {
    const pwIsCorrect = bc.compareSync(password, targetUser.password);

    if (pwIsCorrect) {
      const payload = {
        id: targetUser.id,
        name: targetUser.name,
        surname: targetUser.surname,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: Number(process.env.TIME_TOKEN),
      });

      res.status(200).send({
        message: "Successfully login.",
        access_token: token,
        accessToken: token,
      });
    } else {
      res.status(400).send({ message: "Username or Password is wrong a" });
    }
  } else {
    res.status(400).send({ message: "Username or Password is wrong b" });
  }
};

const register = async (req, res) => {
  const { username, password, name, surname, email, image } = req.body;
  const targetUser = await db.User.findOne({ where: { username } });
  if (targetUser) {
    res.status(400).send({ message: "Something wrong" });
  } else {
    const salt = bc.genSaltSync(12);
    const hashPw = bc.hashSync(password, salt);
    await db.User.create({
      username,
      password: hashPw,
      name,
      surname,
      email,
      image: "123",
    });

    res.status(201).send({ message: "Success Register" });
  }
};

module.exports = {
  login,
  register,
};
