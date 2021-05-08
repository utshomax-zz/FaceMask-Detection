<template>
  <div class="flex-col">
    <div class="headerText">FACE MASK DETECTION</div>
    <loader v-if="loading"></loader>
    <div class="cam-container flex-col">
      <div id="cameraPreview" class="cameraPreview flex-center">
      </div>
      <notify :state="maskS"></notify>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  import * as tf from '@tensorflow/tfjs';
  import * as tmImage from '@teachablemachine/image';
  import {
    Plugins
  } from "@capacitor/core"
  const {
    CameraPreview
  } = Plugins;
  //import '@capacitor-community/camera-preview'
  import loader from './components/Loader'
  import notify from './components/Notify'
  const URL = "https://teachablemachine.withgoogle.com/models/LUWkaHPj4/"
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  const DTCURL = "https://dtcmask.herokuapp.com/api/dtcdata"

  var isMasked = false;
  var isNotMasked = false;
  let model, maxPredictions;
  const cameraSampleOptions = {
    quality: 40,
    height: 100,
    width: 100,
    position: 'front',
    parent: 'cameraPreview',
    className: 'cameraPriview',
  }
  var sndtrue = new Audio(require("./assets/audio/sd_c.mp3"))
  var sndfalse = new Audio(require("./assets/audio/sd_w.mp3"))
  export default {
    name: 'App',
    components: {
      // eslint-disable-next-line vue/no-unused-components
      loader,
      notify
    },
    data() {
      return {
        ready: false,
        maskS: 0,
        loading: true
      }
    },
    async mounted() {
      model = await tmImage.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();
      console.log(maxPredictions)
      this.ready = true
      CameraPreview.start(cameraSampleOptions)
      this.init()
      this.loading = false
    },
    methods: {
      init() {
        const self = this
        setInterval(function () {
            self.predict()
          },
          800);
      },
      async predict() {
        const result = await CameraPreview.capture(cameraSampleOptions);
        let base64PictureData = result.value;
        let canvas = await this.getCanvas(base64PictureData)
        const prediction = await model.predict(canvas);
        for (let i = 0; i < maxPredictions; i++) {
          if (prediction[i].probability > .90) {
            if (prediction[i].className == 'MASK' && !isMasked) {
              this.badge_ok()
              isMasked = true
              isNotMasked = false
              console.log('ok')
            }
            if (prediction[i].className == 'NO MASK' && !isNotMasked) {
              this.badge_fail()
              isMasked = false
              isNotMasked = true
              console.log('nok')
            }
          }

        }
      },
      async badge_fail() {
        this.beep(false)
        this.maskS = 2
        this.sendToAdmin(false)
      },
      async badge_ok() {
          this.beep(true)
          this.maskS = 1
          this.sendToAdmin(true)
        }

        ,
      async beep(cmd) {
        if (cmd) {
          sndtrue.play()
        } else {
          sndfalse.play()
        }
      },
      async getCanvas(base) {
        return new Promise((resolve, reject) => {
          try {
            let image = new Image();
            image.src = `data:image/png;base64,${base}`;
            resolve(image);
          } catch (error) {
            reject(error);
          }
        })
      },
      async sendToAdmin(maskState) {
        var data = {
          state: maskState,
          dateTime:Date.now()
        }
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
    },
  }
</script>

<style>
  .cameraPreview {
    display: flex;
    height: 100%;
    width: 90%;
    overflow: hidden;
    text-align: center;
    padding: 10px;
    border-radius: 10px;
  }
</style>