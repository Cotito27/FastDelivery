const express = require("express");
const router = express.Router();
const passport = require("passport");
// let { sessionsRoom } = require('../variables');
// let { usersSession } = require('../variables');


function validarUser(req, res, next) {
  // console.log(req.session);
  if (req.isAuthenticated()) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=1, pre-check=0');
    return next();
  }
  req.session.redirectTo = req.path;
  // next();
  res.redirect("/login");
}

function redirectHome(req, res, next) {
  if (req.isAuthenticated()) return res.redirect("/");
  next();
}

// Controllers
const home = require("../controllers/home.controller");
const producto = require('../controllers/producto.controller');
const cliente = require('../controllers/cliente.controller');
const empleado = require('../controllers/empleado.controller');
const login = require('../controllers/login.controller');
const cargo = require('../controllers/cargo.controller');
const categoria = require('../controllers/categoria.controller');
const establecimiento = require('../controllers/establecimiento.controller');
const boleta = require('../controllers/boleta.controller');
const estado_cliente = require('../controllers/estado_cliente.controller');
const estado_empleado = require('../controllers/estado_empleado.controller');

function validateCors(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
};
// router.get('/', validarUser, home.index);
router.get("/login", login.index);
router.post('/login', login.verify);
router.get('/logout', login.logout);
router.get('/', validarUser, home.index);
router.get('/redirectUrl', home.redirect);
router.get('/productos/registro', validarUser, producto.register);
router.post('/productos/guardar', validarUser, producto.save);
router.get('/productos/reporte', validarUser, producto.report);
router.get('/productos/editar/:id', validarUser, producto.edit);
router.post('/productos/update/:id', validarUser, producto.update);
router.get('/empleados/registro', validarUser, empleado.register);
router.post('/empleados/guardar', validarUser, empleado.save);
router.get('/empleados/reporte', validarUser, empleado.report);
router.get('/empleados/editar/:id', validarUser, empleado.edit);
router.post('/empleados/update/:id', validarUser, empleado.update);
router.get('/cargo/registro', validarUser, cargo.register);
router.post('/cargo/guardar', validarUser, cargo.save);
router.get('/cargo/reporte', validarUser, cargo.report);
router.get('/cargo/editar/:id', validarUser, cargo.edit);
router.post('/cargo/update/:id', validarUser, cargo.update);
router.get('/clientes/reporte', validarUser, cliente.report);
router.get('/clientes/editar/:id', validarUser, cliente.edit);
router.post('/clientes/update/:id', validarUser, cliente.update);
router.get('/categoria/registro', validarUser, categoria.register);
router.post('/categoria/guardar', validarUser, categoria.save);
router.get('/categoria/reporte', validarUser, categoria.report);
router.get('/categoria/editar/:id', validarUser, categoria.edit);
router.post('/categoria/update/:id', validarUser, categoria.update);
router.get('/establecimiento/registro', validarUser, establecimiento.register);
router.post('/establecimiento/guardar', validarUser, establecimiento.save);
router.get('/establecimiento/reporte', validarUser, establecimiento.report);
router.get('/establecimiento/editar/:id', validarUser, establecimiento.edit);
router.post('/establecimiento/update/:id', validarUser, establecimiento.update);
router.get('/estado_cliente/registro', validarUser, estado_cliente.register);
router.post('/estado_cliente/guardar', validarUser, estado_cliente.save);
router.get('/estado_cliente/reporte', validarUser, estado_cliente.report);
router.get('/estado_cliente/editar/:id', validarUser, estado_cliente.edit);
router.post('/estado_cliente/update/:id', validarUser, estado_cliente.update);
router.get('/estado_empleado/registro', validarUser, estado_empleado.register);
router.post('/estado_empleado/guardar', validarUser, estado_empleado.save);
router.get('/estado_empleado/reporte', validarUser, estado_empleado.report);
router.get('/estado_empleado/editar/:id', validarUser, estado_empleado.edit);
router.post('/estado_empleado/update/:id', validarUser, estado_empleado.update);
router.get('/boleta', validarUser, boleta.register);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/redirectUrl");
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/redirectUrl",
    failureRedirect: "/login",
  })
);

router.get('/outlook',
  passport.authenticate('windowslive', {
    scope: [
      'openid',
      'profile',
      'offline_access',
      'https://outlook.office.com/Mail.Read',
    ]
  })
);

router.get('/outlook/callback', 
  passport.authenticate('windowslive', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


module.exports = { router };
