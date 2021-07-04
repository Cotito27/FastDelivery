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
const nameTable = 'empleados';

async function consultCargos(connection) {
  const [rows] = await connection.query(`SELECT codigo,nombre FROM cargo`);
  return rows;
}

async function consultEstadosEmp(connection) {
  const [rows] = await connection.query(`SELECT codigo,nombre FROM estado_empleado`);
  return rows;
}

ctrl.register = async (req, res) => {
  let user = req.user;
  const connection = await connect();
  const cargos = await consultCargos(connection);
  const estados = await consultEstadosEmp(connection);
  res.render('index', {
    title: titleProyect,
    section: 'empleados/registro',
    data: false,
    cargos,
    estados,
    edit: false,
    user
  });
}

ctrl.report = async (req, res) => {
  let user = req.user;
  const connection = await connect();
  const [rows] = await connection.query(`SELECT emp.codigo,emp.nombres,emp.apellidos,c.nombre as cargo,est.nombre as estado,emp.domicilio,emp.telefono,emp.usuario,emp.pass,emp.correo,emp.dni,emp.imagen FROM ${nameTable} emp INNER JOIN cargo c ON emp.cod_cargo = c.codigo INNER JOIN estado_empleado est ON emp.cod_estado = est.codigo`);
  res.render('index', {
    title: titleProyect,
    section: 'empleados/reporte',
    data: rows,
    user
  });
}

let download = async function(uri, filename, callback){
  await request.head(uri, async function(err, res, body){
    await request(uri).pipe(fsNrm.createWriteStream(filename)).on('close', callback);
  });
};

ctrl.downloadImage = async (req, res) => {
  if(!req.file) {
    res.send('error');
    return;
  }
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  await fs.unlink(req.file.path);

  // req.user.foto = result.url;
  res.send(result.url);
};

ctrl.downloadImgExtern = async(req, res) => {
  const urlReceived = JSON.parse(req.body.json).fileSrc.replace(/amp;/g, '');
  const ext = '.jpg';
  const fileUrl = uuid.v4();
  const newUrlDownload = path.resolve(`src/public/upload/${fileUrl}${ext}`);
  await download(urlReceived, newUrlDownload, async function(){
    const result = await cloudinary.v2.uploader.upload(newUrlDownload);
    await fs.unlink(newUrlDownload);
    res.send(result.url);
  });
}

ctrl.save = async (req, res) => {
  let body = req.body;
  let urlResult = '';
  let public_id = '';
  const connection = await connect();

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
      public_id = result.public_id;
      delete body.url;
      const dataSaved = await saveQuery(connection, {...body, imagen: urlResult, public_id}, nameTable);
      res.json({success: true});
    });
  } else {
    if(!req.file) {
      const dataSaved = await saveQuery(connection, body);
      return res.json({success: true}, nameTable);
    }
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
  
    // req.user.foto = result.url;
    urlResult = result.url;
    public_id = result.public_id;
    const dataSaved = await saveQuery(connection, {...body, imagen: urlResult, public_id}, nameTable);
    res.json({success: true});
  }
  
}

ctrl.edit = async (req, res) => {
  let user = req.user;
  const { id } = req.params;
  const connection = await connect();
  const [rows] = await connection.query(`SELECT emp.codigo,emp.nombres,emp.apellidos,c.nombre as cargo,est.nombre as estado,emp.domicilio,emp.telefono,emp.usuario,emp.pass,emp.correo,emp.dni,emp.imagen FROM ${nameTable} emp INNER JOIN cargo c ON emp.cod_cargo = c.codigo INNER JOIN estado_empleado est ON emp.cod_estado = est.codigo WHERE emp.codigo = ${id}`);
  const cargos = await consultCargos(connection);
  const estados = await consultEstadosEmp(connection);
  res.render('index', {
    title: titleProyect,
    section: 'empleados/registro',
    data: rows[0],
    cargos,
    estados,
    edit: true,
    user
  });
}

ctrl.update = async (req, res) => {
  let body = req.body;
  const { id } = req.params;
  let urlResult = '';
  let public_id = '';
  const connection = await connect();
  const [rows] = await connection.query(`SELECT imagen, public_id FROM ${nameTable} WHERE codigo = ${id}`);
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
      req.user.imagen = result.url;
      urlResult = result.url;
      public_id = result.public_id;
      delete body.url;
      if(rows[0].imagen !== urlResult) {
        if(rows[0].public_id) {
          await cloudinary.v2.uploader.destroy(rows[0].public_id);
        }
      }
      const results = await connection.query(`UPDATE ${nameTable} SET ? WHERE codigo = ?`, [
        {...body, imagen: urlResult, public_id},
        id
      ]);
      console.log(results);
      res.json({success: true, imagen: urlResult});
    });
  } else {
    if(!req.file) {
      const results = await connection.query(`UPDATE ${nameTable} SET ? WHERE codigo = ?`, [
        body,
        id
      ]);
      console.log(results);
      return res.json({success: true, imagen: null});
    }
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
  
    req.user.imagen = result.url;
    urlResult = result.url;
    public_id = result.public_id;
    if(rows[0].imagen !== urlResult) {
      if(rows[0].public_id) {
        await cloudinary.v2.uploader.destroy(rows[0].public_id);
      }
    }
    const results = await connection.query(`UPDATE ${nameTable} SET ? WHERE codigo = ?`, [
      {...body, imagen: urlResult, public_id},
      id
    ]);
    console.log(results);
    res.json({success: true, imagen: urlResult});
  }
}

module.exports = ctrl;