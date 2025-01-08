// Session handling middleware 
const isAuthenticated = (req, res, next) => {
  if(req.session.userId || req.session.isAdmin) {
      return next();
  }
  res.redirect('/users/login?msg=Please%20log%20in');
};


module.exports = {
  isAuthenticated
}