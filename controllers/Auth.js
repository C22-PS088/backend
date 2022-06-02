require('dotenv').config();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const { User } = require('../models');

const Login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Password salah'
        })
    }

    const userId = user.id;
    const nama = user.nama;
    const username = user.username;
    const accessToken = jwt.sign({ userId, nama, username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
    const refreshToken = jwt.sign({ userId, nama, username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    await User.update({ refresh_token: refreshToken }, {
      where: {
        id: userId
      }
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000
      // , secure: true
    });

    res.json({ accessToken });
  } catch (error) {
    res
      .status(404)
      .json({
        status: 'fail',
        message: 'Username tidak ditemukan'
      })
  }
}

const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  const user = await User.findOne({
    where: {
      refresh_token: refreshToken
    }
  });

  if (!user) return res.sendStatus(204);

  const userId = user.id;
  await User.update({ refresh_token: null }, {
    where: {
      id: userId
    }
  });

  res.clearCookie('refreshToken');
  return res.sendStatus(200);
}

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const user = await User.findOne({
      where: {
        refresh_token: refreshToken
      }
    });

    if (!user) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const userId = user.id;
      const nama = user.nama;
      const username = user.username;
      const accessToken = jwt.sign({ userId, nama, username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15s'
      });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  Login,
  Logout,
  refreshToken
};
