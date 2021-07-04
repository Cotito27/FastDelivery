let btnUser = document.querySelector('.btn-user');
let panelUser = document.querySelector('.panel-user');
let navbarBrand = document.querySelector('.navbar-brand');
let navbarLogo = document.querySelector('.navbar-brand img');
let btnMenuBars = document.querySelector('.menu-bars');
let btnsExtendSection = document.querySelectorAll('.btn-extend-section');
let blockContainerBody = document.querySelector('.block-container-body');
let inputsWithNumber = document.querySelectorAll('[type="number"]');

const logoOriginal = 'img/logo6.JPG';
const logoIcon = 'img/logo-icon.JPG';


window.onresize = () => {
  resizeSidebar();
}

function clickPanelUser(e) {
  return !e.target.closest('.panel-user') && !e.target.closest('.btn-user');
}

function clickSidebar(e) {
  return !e.target.closest('.sidebar') && !e.target.closest('.menu-bars');
}

function hiddenPanelUser() {
  panelUser.classList.remove('d-flex-show');
}

function togglePanelUser() {
  panelUser.classList.toggle('d-flex-show');
}

function toggleSidebar() {
  sidebar.classList.toggle('show');
  sidebar.classList.contains('show') ? container.classList.remove('all-space-width') : container.classList.add('all-space-width');
  if(window.innerWidth <= 789) {
    blockContainerBody.classList.toggle('d-none');
  }
}

function changeIconExtend(e, data) {
  let classIcon = '';
  data ? classIcon = 'down' : classIcon = 'right';
  e.target.querySelector('.icon-extend').innerHTML = `<i class="fas fa-caret-${classIcon}" aria-hidden="true"></i>`;
}

btnUser.addEventListener('click', () => {
  togglePanelUser();
}); 

document.body.addEventListener('click', (e) => {
  if(clickPanelUser(e)) {
    hiddenPanelUser();
  }
  if(clickSidebar(e)) {
    if(window.innerWidth <= 789) {
      sidebar.classList.remove('show');
      container.classList.add('all-space-width');
      blockContainerBody.classList.add('d-none');
    }
  }
});

btnMenuBars.addEventListener('click', () => {
  toggleSidebar();
});

btnsExtendSection.forEach((item) => {
  item.addEventListener('click', (e) => {
    let parentSection = e.currentTarget.parentElement;
    let elementSelected = parentSection.querySelector('.dropdown-extend');
    elementSelected.classList.toggle('show');
    let boolData = elementSelected.classList.contains('show');
    changeIconExtend(e, boolData);
    e.currentTarget.classList.toggle('selected-section');
  });
});

inputsWithNumber.forEach((item) => {
  item.addEventListener('blur', (e) => {
    if(parseInt(e.currentTarget.value) < 0 || e.currentTarget.value.includes('e')) {
      e.currentTarget.value = 0;
    }
  });
});

let toastError = document.querySelector('.toast-error');
let textError = document.querySelector('.text-error');
let clearTimeError;

function msgError(msg) {
  textError.textContent = msg;
  toastError.classList.add('d-flex-show');
  clearTimeout(clearTimeError);
  clearTimeError = setTimeout(() => {
    toastError.classList.remove('d-flex-show');
  }, 3000);
}

let toastSuccess = document.querySelector('.toast-success');
let textSuccess = document.querySelector('.text-success');
let clearTimeSuccess;

function msgSuccess(msg) {
  textSuccess.textContent = msg;
  toastSuccess.classList.add('d-flex-show');
  clearTimeout(clearTimeSuccess);
  clearTimeSuccess = setTimeout(() => {
    toastSuccess.classList.remove('d-flex-show');
  })
}

let btnCloseError = document.querySelector('.close-error');
btnCloseError.addEventListener('click', (e) => {
  e.currentTarget.parentElement.classList.remove('d-flex-show');
});

let btnCloseSuccess = document.querySelector('.close-success');
btnCloseSuccess.addEventListener('click', (e) => {
  e.currentTarget.parentElement.classList.remove('d-flex-show');
});

$('#change_foto').on('change', function() {
  let imgPreviewUrl;
  if($(this).val() == "" || $(this).val() == null) {
   return; 
  }
  const $form = document.querySelector('#form_foto');
  const formData = new FormData($form);
  imgPreviewUrl = URL.createObjectURL(formData.get('archivo'));
  $('.imgPreview').prop('src', imgPreviewUrl);
  $('.block-preview-foto').removeClass('d-none');
  $('.preview-img-foto').removeClass('d-none');
  $('.sidebar').addClass('side-hide');
});

$('.close-preview').on('click', function() {
  let previousImg = $('.imgPreview').prop('src');
  URL.revokeObjectURL(previousImg);
  $('.block-preview-foto').addClass('d-none');
  $('.preview-img-foto').addClass('d-none');
  $('#change_foto').val(null);
  $('.sidebar').removeClass('side-hide');
});

$('body').on('click', '.btnChangeFoto', async function() {
  $('.btnChangeFoto').replaceWith(`<div class="loading-upload"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>`);
  var form = $('#form_foto')[0];
  var formData = new FormData(form);
  const urlDirect = `/empleados/update/${codigoMe}`;
  const response = await fetch(urlDirect, {
    method: 'POST', // or 'PUT'
    body: formData, // data can be `string` or {object}!
  });
  let datos = await response.json();
  let imageUrl = '';
  if(datos.success) {
    imageUrl = datos.imagen || '/img/usuario.png';
    
    // sessionStorage.foto = datos;
    $('.icon-image img').prop('src', imageUrl);
    $('.img-user img').prop('src', imageUrl);
    if($(`[data-codigo-emp="${codigoMe}"]`)[0]) {
      $(`[data-codigo-emp="${codigoMe}"]`).parent().find('.image-row-table img').prop('src', imageUrl);
    }
    $('.loading-upload').replaceWith(`<div class="btn btn-success btnChangeFoto">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30"><path fill="currentColor" d="M9.9 21.25l-6.7-6.7-2.2 2.2 8.9 8.9L29 6.55l-2.2-2.2-16.9 16.9z"></path></svg>
  </div>`);
    $('.block-preview-foto').addClass('d-none');
    $('.preview-img-foto').addClass('d-none');
    console.log(imageUrl);
  }
});

$('.btn-close-modal').on('click', function() {
  $(this).parent().parent().removeClass('d-flex-show');
  $('body').removeClass('ov-hidden');
});

$('.btn-search-product').on('click', function() {
  $('.modal-productos').addClass('d-flex-show');
  $('body').addClass('ov-hidden');
});

$('.select-cliente .content').on('click', function() {
  $('.modal-clientes').addClass('d-flex-show');
  $('body').addClass('ov-hidden');
});

$('.btn-print').on('click', function() {
  print();
});