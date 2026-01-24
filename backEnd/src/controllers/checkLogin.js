const checkLogin = async (req, res) => {
  return res.status(200).json({
    loggedIn: true,
    user: req.user,
  });
};

module.exports = checkLogin;
