document.getElementById('file_select').addEventListener('submit', function(e) {
  e.preventDefault();
  const file = e.target.uploadfile.files[0];
  const responseMessage = document.getElementById('responseMessage');

  if (file) {
    const formData = new FormData();
    formData.append('uploadfile', file);

    fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    })
    .then((res) => res.json())
    
    .then((data) => {
      if (data.error) {
        responseMessage.textContent = 'Upload failed: ' + data.error;
        responseMessage.style.color = 'red';
      } else {
        responseMessage.textContent = 'Upload successful: ' + data.message;
        responseMessage.style.color = 'green';
      }
    })
    .catch(() => {
      responseMessage.textContent = 'Upload failed!';
      responseMessage.style.color = 'red';
    });
  } else {
    responseMessage.textContent = 'No file selected';
  }

  setTimeout(() => {
    location.reload();
    document.getElementById('file_select').reset();
  }, 3000);
});
