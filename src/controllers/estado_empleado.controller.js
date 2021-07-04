const getControl = require('./subTables.controller');
const titleProyect = 'Fast Delivery';
const nameTable = 'estado_empleado';

const ctrl = getControl.getCtrlSub(titleProyect,nameTable);

module.exports = ctrl;