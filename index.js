
let processor = {
    timerCallback: function() {
      if (this.video.paused || this.video.ended) {
        return;
      }
      this.computeFrame();
      let self = this;
      setTimeout(function () {
          self.timerCallback();
        }, 0);
    },
  
    doLoad: function() {
      this.video = document.getElementById("video");
      this.canvas = document.getElementById("maincanvas");
      this.context = this.canvas.getContext("2d");
      
      let self = this;
      this.video.addEventListener("play", function() {
          self.width = self.video.videoWidth ;
          self.height = self.video.videoHeight;
          self.timerCallback();
        }, false);
    },
  
    computeFrame: function() {
      const kernel = [0,1,0,1,-4,1,0,1,0];
      this.context.drawImage(this.video, 0, 0, this.width, this.height);
      
      let frame = this.context.getImageData(0, 0, this.width, this.height);
      let frame_edited = this.context.getImageData(0, 0, this.width, this.height);
          let l = frame.data.length;
      
      for (let i =this.video.videoWidth+1; i <=  l/4- 2 -this.video.videoWidth ; i++) {
        let temp = [];
        let kernel_index = 0;
        let sum = 0;
        for (let r = -1; r <= 1; r+=1) {
            for (let c = -1; c <=1 ; c+=1){
              let index = (i+r*this.video.videoWidth+c);
              let grey =0.299*frame.data[index*4] + 0.587*frame.data[index*4+1] + 0.114*frame.data[index*4+2];
              sum += grey * kernel[kernel_index];
              kernel_index++;
            }
        }
        frame_edited.data[i*4] = sum;
        frame_edited.data[i*4+1] = sum;
        frame_edited.data[i*4+2] = sum;
      }
      this.context.putImageData(frame_edited, 0, 0);
      return;
    }
  };

document.addEventListener("DOMContentLoaded", () => {
  
  processor.doLoad();
});