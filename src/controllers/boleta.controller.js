const {connect} = require('../database');
const request = require('request');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs-extra');
const fsNrm = require('fs');
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const { saveQuery } = require('../helpers/query');

const ctrl = {};
const titleProyect = 'FastDelivery';

async function getClientes(connection) {
  const [rows] = await connection.query(`SELECT cli.codigo, cli.nombres, cli.apellido_paterno, cli.apellido_materno, cli.dni, cli.direccion, cli.telefono, esta.nombre as estado, cli.correo, cli.imagen FROM ${'clientes'} cli INNER JOIN estado_cliente esta ON cli.cod_estado = esta.codigo`);
  return rows;
}

async function getProductos(connection) {
  const [rows] = await connection.query(`SELECT prod.codigo, prod.nombre, prod.descripcion, prod.precio, prod.stock, esta.nombre as establecimiento, cat.nombre as categoria, prod.unidad_med, prod.imagen FROM ${'productos'} prod INNER JOIN establecimiento esta ON prod.cod_establecimiento = esta.codigo INNER JOIN categoria cat ON prod.cod_categoria = cat.codigo`);
  return rows;
}

async function getMaxCodeBoleta(connection) {
  const [rows] = await connection.query(`SELECT MAX(codigo) as cod_boleta FROM boleta`);
  return rows[0].cod_boleta;
}

ctrl.register = async (req, res) => {
  let user = req.user;
  const connection = await connect();
  const clientes = await getClientes(connection);
  const productos = await getProductos(connection);
  const maxCodeBoleta = await getMaxCodeBoleta(connection) || 1;
  res.render('index', {
    title: titleProyect,
    section: 'boleta/registro',
    maxCodeBoleta: maxCodeBoleta,
    clientes,
    productos,
    data: false,
    edit: false,
    user
  });
}

module.exports = ctrl;