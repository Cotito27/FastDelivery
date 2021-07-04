const getControl = require('./subTables.controller');
const titleProyect = 'Fast Delivery';
const nameTable = 'establecimiento';

const ctrl = getControl.getCtrlSub(titleProyect,nameTable);

module.exports = ctrl;