function eventChangeTypeImage() {
  let uploadRadio = document.querySelectorAll('.upload-radio');
  let inputUpLink = document.querySelector('.inputUpLink');
  let inputUpFile = document.querySelector('.inputUpFile');
  let fileForm = document.querySelector('#fileForm');

  uploadRadio.forEach((item) => {
    item.addEventListener('change', (e) => {
      if(e.target.classList.contains('upload-file')) {
        inputUpLink.setAttribute('disabled', 'disabled');
        inputUpFile.style.opacity = '1';
        inputUpLink.value = '';
        fileForm.removeAttribute('disabled');
      } else {
        inputUpFile.style.opacity = '0.6';
        inputUpLink.removeAttribute('disabled');
        inputUpFile.value = null;
        fileForm.setAttribute('disabled', 'disabled');
      }
    });
  });
}

eventChangeTypeImage();