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
const titleProyect = 'Fast Delivery';
const nameTable = 'productos';

async function consultEstablis(connection) {
  const [rows] = await connection.query(`SELECT codigo,nombre FROM establecimiento`);
  return rows;
}

async function consultCategorias(connection) {
  const [rows] = await connection.query(`SELECT codigo,nombre FROM categoria`);
  return rows;
}

ctrl.register = async (req, res) => {
  let user = req.user;
  const connection = await connect();
  const establecimientos = await consultEstablis(connection);
  const categorias = await consultCategorias(connection);
  res.render('index', {
    title: titleProyect,
    section: 'productos/registro',
    data: false,
    establecimientos,
    categorias,
    edit: false,
    user
  });
}

ctrl.report = async (req, res) => {
  let user = req.user;
  const connection = await connect();
  const [rows] = await connection.query(`SELECT prod.codigo, prod.nombre, prod.descripcion, prod.precio, prod.stock, esta.nombre as establecimiento, cat.nombre as categoria, prod.unidad_med, prod.imagen FROM ${nameTable} prod INNER JOIN establecimiento esta ON prod.cod_establecimiento = esta.codigo INNER JOIN categoria cat ON prod.cod_categoria = cat.codigo`);
  res.render('index', {
    title: titleProyect,
    section: 'productos/reporte',
    data: rows,
    user
  });
}

ctrl.save = async (req, res) => {
  let body = req.body;
  let urlResult = '';
  if(req.body.url) {
    const urlReceived = req.body.url;
    // console.log(urlReceived);
    const ext = '.jpg';
    const fileUrl = uuid.v4();
    const newUrlDownload = path.resolve(`src/public/upload/${fileUrl}${ext}`);
    await download(urlReceived, newUrlDownload, async function(){
      const result = await cloudinary.v2.uploader.upload(newUrlDownload);
      // console.log(newUrlDownload);
      await fs.unlink(newUrlDownload);
      urlResult = result.url;
      const connection = await connect();
      delete body.url;
      const dataSaved = await saveQuery(connection, {...body, imagen: urlResult}, nameTable);
      res.json({success: true});
    });
  } else {
    if(!req.file) {
      const connection = await connect();
      const dataSaved = await saveQuery(connection, body);
      return res.json({success: true}, nameTable);
    }
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
  
    // req.user.foto = result.url;
    urlResult = result.url;
    const connection = await connect();

    const dataSaved = await saveQuery(connection, {...body, imagen: urlResult}, nameTable);
    res.json({success: true});
  }
}

ctrl.edit = async (req, res) => {
  let user = req.user;
  const { id } = req.params;
  const connection = await connect();
  const [rows] = await connection.query(`SELECT prod.codigo, prod.nombre, prod.descripcion, prod.precio, prod.stock, esta.nombre as establecimiento, cat.nombre as categoria, prod.unidad_med, prod.imagen FROM ${nameTable} prod INNER JOIN establecimiento esta ON prod.cod_establecimiento = esta.codigo INNER JOIN categoria cat ON prod.cod_categoria = cat.codigo WHERE prod.codigo = ${id}`);
  const establecimientos = await consultEstablis(connection);
  const categorias = await consultCategorias(connection);
  res.render('index', {
    title: titleProyect,
    section: 'productos/registro',
    data: rows[0],
    establecimientos,
    categorias,
    edit: true,
    user
  });
}

ctrl.update = async (req, res) => {
  let body = req.body;
  const { id } = req.params;
  let urlResult = '';
  if(req.body.url) {
    const urlReceived = req.body.url;
    // console.log(urlReceived);
    const ext = '.jpg';
    const fileUrl = uuid.v4();
    const newUrlDownload = path.resolve(`src/public/upload/${fileUrl}${ext}`);
    await download(urlReceived, newUrlDownload, async function(){
      const result = await cloudinary.v2.uploader.upload(newUrlDownload);
      // console.log(newUrlDownload);
      await fs.unlink(newUrlDownload);
      urlResult = result.url;
      const connection = await connect();
      delete body.url;
      const results = await connection.query(`UPDATE ${nameTable} SET ? WHERE codigo = ?`, [
        {...body, imagen: urlResult},
        id
      ]);
      console.log(results);
      res.json({success: true});
    });
  } else {
    if(!req.file) {
      const connection = await connect();
      const results = await connection.query(`UPDATE ${nameTable} SET ? WHERE codigo = ?`, [
        body,
        id
      ]);
      console.log(results);
      return res.json({success: true});
    }
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
  
    // req.user.foto = result.url;
    urlResult = result.url;
    const connection = await connect();

    const results = await connection.query(`UPDATE ${nameTable} SET ? WHERE codigo = ?`, [
      {...body, imagen: urlResult},
      id
    ]);
    console.log(results);
    res.json({success: true});
  }
}

module.exports = ctrl;