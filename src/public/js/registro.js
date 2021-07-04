$('.inputUpLink').on('keyup change paste', function() {
  let imgPreview = document.querySelector('.img__view__preview');
  setTimeout(() => {
    imgPreview.src = this.value;
    imgPreview.onerror = function() {
      this.src = '/img/placeholder-image.png';
    }
  }, 100);  
});

function renderImage(formData, $file) {
  const file = formData.get('archivo');
  const image = URL.createObjectURL(file);
  $file.setAttribute('src', image);
}

if($('#dot-1').is(':checked')) {
  $('.inputUpLink').attr('disabled', 'disabled');
  $('.inputUpFile').attr('style', 'opacity: 1;');
  $('#fileForm').removeAttr('disabled');
} else {
  $('.inputUpFile').attr('style', 'opacity: 0.6;');
  $('.inputUpLink').removeAttr('disabled');
  $('#fileForm').attr('disabled', 'disabled');
}
$('.upload-radio').on('change', function() {
  if(this.id == 'dot-1') {
    $('.inputUpLink').attr('disabled', 'disabled');
    $('.inputUpFile').attr('style', 'opacity: 1;');
    // $('.inputUpLink').val('');
    $('#fileForm').removeAttr('disabled');
  } else {
    $('.inputUpFile').attr('style', 'opacity: 0.6;');
    $('.inputUpLink').removeAttr('disabled');
    // $('.inputUpFile').val(null);
    $('#fileForm').attr('disabled', 'disabled');
  }
  // $('.img__view__preview').attr('src', '/img/placeholder-image.png');
});

$('#fileForm').on('change', function() {
  const $form = document.querySelector('#form__register') || document.querySelector('#form__edit');
  const formData = new FormData($form);
  renderImage(formData, document.querySelector('.img__view__preview'));
});

let activeSubmit = true;
$('#form__register').on('submit', async function(e) {
  e.preventDefault();
  if(!activeSubmit) return;
  const form = this;
  const formData = new FormData(form);
  let newUrlImage = '';
  let linkUrl = false;
  if($('.img__view__preview').attr('src') == '/img/placeholder-image.png') {
    formData.set('imagen', null);
  } else {
    if($('.inputUpLink').val() == '') {
    } else {
      linkUrl = true;
    }
    // formData.set('image', newUrlImage);
  }
  if(linkUrl) {
    formData.set('url', $('.img__view__preview').attr('src'));
  }
  formData.delete('gender');
  activeSubmit = false;
  let urlDestino = `/${nameSection}/guardar`;
  let response = await fetch(urlDestino, {
    method: 'POST',
    body: formData
  }).catch((err) => console.log(err));

  let res = await response.json();
  msgSuccess('Se ha registrado exitosamente');
  // $('.block__chain__container').addClass('d-none');
  // $('.loader__page').addClass('d-none');
  // $('body').removeClass('ov-hidden');
  // form.reset();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  if(res.success) {
    location.href = `/${nameSection}/reporte`;  
  }
  activeSubmit = true;
  // location.href = '/empleados/reporte';
  // console.log(res);
});

$('#form__edit').on('submit', async function(e) {
  e.preventDefault();
  if(!activeSubmit) return;
  const form = this;
  const formData = new FormData(form);
  let newUrlImage = '';
  let linkUrl = false;
  if($('.img__view__preview').attr('src') == '/img/placeholder-image.png') {
    formData.set('imagen', null);
  } else {
    if($('.inputUpLink').val() == '') {
    } else {
      linkUrl = true;
    }
    // formData.set('image', newUrlImage);
  }
  if(linkUrl) {
    formData.set('url', $('.img__view__preview').attr('src'));
  }
  const id = document.querySelector('.codigo__item').textContent.trim();
  formData.delete('gender');
  activeSubmit = false;
  let urlDestino = `/${nameSection}/update/${id}`;
  let response = await fetch(urlDestino, {
    method: 'POST',
    body: formData
  });

  let res = await response.json();
  msgSuccess('Se ha registrado exitosamente');
  // $('.block__chain__container').addClass('d-none');
  // $('.loader__page').addClass('d-none');
  // $('body').removeClass('ov-hidden');
  // form.reset();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  if(res.success) {
    location.href = `/${nameSection}/reporte`;
  }
  activeSubmit = true;
  // location.href = '/empleados/reporte';
  // console.log(res);
});

let btnBackHistory = document.querySelector('.btn-back-history');
if(btnBackHistory) {
  btnBackHistory.addEventListener('click', () => {
    // window.history.back();
    location.href = `/${nameSection}/reporte`;
  });
}