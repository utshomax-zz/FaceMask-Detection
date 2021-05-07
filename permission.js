async function getMedia() {
    try {
      await navigator.mediaDevices.getUserMedia({audio: false, video: true});
    } catch(err) {
      alert("Camera Permission is Required!")
    }
  }
getMedia()