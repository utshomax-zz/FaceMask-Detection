const URL = "https://teachablemachine.withgoogle.com/models/LUWkaHPj4/"
const DTCURL = "https://dtcmask.herokuapp.com/api/dtcdata"
let gotpermission = false
var isMasked = false;
var isNotMasked = false;
let model, webcam, labelContainer, maxPredictions;
let notifier = document.getElementById("notify")
let loader = document.getElementById("loader")
var sndtrue = new Audio('./audio/sd_c.mp3')
var sndfalse = new Audio('./audio/sd_w.mp3')

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip); 
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    loader.classList.add('hidden')
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    
}
async function beep(cmd) {
    if(cmd){
        sndtrue.play()
    }
    else{
        sndfalse.play()
    }
}
async function loop() {
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop);
}
function badge_ok(){
    beep(true)
    sendToAdmin(true)
    notifier.innerHTML = `<div>
    <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
        <div class="text">Thank You ! <br>
        For Using Mask</div>
        </div>`
}
function badge_fail(){
    beep(false)
    sendToAdmin(false)
    notifier.innerHTML = `<div><svg xmlns="http://www.w3.org/2000/svg" class="icon c-c" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
        <div class="text">Opps ! <br>
        Mask is Mandatory</div>
    </div>`
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        if(prediction[i].probability > .90){
           if(prediction[i].className == 'MASK' && !isMasked){
               badge_ok()
               isMasked = true
               isNotMasked = false
           }
           if(prediction[i].className == 'NO MASK' && !isNotMasked){
                badge_fail()
                isMasked = false
                isNotMasked= true
        }
        }
       
    }
}

async function sendToAdmin(maskState){
    let date = new Date()
    var data ={
        state:maskState,
        dateTime: date.toISOString()
    }
    console.log(data)
    const response = await fetch(DTCURL, {
        method: 'POST', 
        mode: 'cors', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      console.log(await response.json());
}