const ctrl = {};
const titleProyect = 'Fast Delivery';

ctrl.index = (req, res) => {
 let user = req.user;
 res.render('index', {
  title: titleProyect,
  section: 'inicio',
  user
 });
}

ctrl.redirect = (req, res) => {
  // console.log('xd');
  var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
  delete req.session.redirectTo;
  // is authenticated ?
  res.redirect(redirectTo || '/');
}

module.exports = ctrl;