//require("./styles/style.css");
require("./styles/style.scss");
require("jquery");
var pb=require("progressbar.js");

// Main app

var state={
    work_running: false,
    rest_running: false,
    paused: false,
    work_time: 25,
    rest_time: 5,
    end_time: undefined,
    remaining_time: {
      min: 25,
      sec: 5
    },
    percent: 0,
    progress: new pb.Circle('div#progress', {
        color: '#FCB03C',
        duration: 1000,
        easing: 'linear',
        strokeWidth: 10
    }),
    render: function() {
        $('#work').text(this.work_time+' min');
        $('#rest').text(this.rest_time+' min');
        $('#time-text-out').text(this.lpad(this.remaining_time.min.toString(), '0', 2)+':'+this.lpad(this.remaining_time.sec.toString(), '0', 2));
        if (this.rest_running)
          $('#time-text-prompt').text('Rest');
        else
          $('#time-text-prompt').text('Work');
        this.progress.animate(this.percent);
    },
    setEndTime: function() {
      /* sets end_time from remaining_time */
      this.end_time=new Date();
      this.end_time.setMinutes(this.end_time.getMinutes() + this.remaining_time.min);
      this.end_time.setSeconds(this.end_time.getSeconds() + this.remaining_time.sec);
    },
    updateRemainfromEndTime: function() {
      /* updates remain from curr_time and end_time */
      var curr_time=new Date();
      var diff=Math.round((this.end_time-curr_time)/1000);
      this.remaining_time.min=Math.floor(diff/60);
      this.remaining_time.sec=diff%60;
      if (this.work_running) {
        this.percent=1-(this.remaining_time.min*60+this.remaining_time.sec)/(this.work_time*60);
      }
      else {
        this.percent=1-(this.remaining_time.min*60+this.remaining_time.sec)/(this.rest_time*60);
      }
    },
    resetRemain: function() {
      //reset remain on begin
      if (this.rest_running) {
        this.remaining_time.min=this.rest_time;
        this.remaining_time.sec=0;
      }
      else {
        this.remaining_time.min=this.work_time;
        this.remaining_time.sec=0;
      }
    },
    onStart: function() {
      var self=this;
      if (this.work_running || this.rest_running) {
        if (this.paused) { //resume from pause
          this.paused=false;
          this.setEndTime();
          setTimeout(this.updateStatus, 1000, self);
        }
        else { //pause
          this.paused=true;
          this.updateRemainfromEndTime();
        }
      }
      else { // start
        this.work_running=true;
        this.rest_running=false;
        this.resetRemain();
        this.setEndTime();
        setTimeout(this.updateStatus, 500, self);
      }
    },
    updateStatus: function(self) {
      if ((self.work_running || self.rest_running) && !self.paused) {
        var curr_time=new Date();
        if (curr_time >= self.end_time) {
          // end of period
          self.work_running=!self.work_running;
          self.rest_running=!self.rest_running;
          self.resetRemain();
          self.setEndTime();
        }
        else {
          self.updateRemainfromEndTime();
        }
        setTimeout(self.updateStatus, 500, self);
        self.render();
      }
    },
    resetAll: function() {
      this.work_running=false;
      this.paused=false;
      this.rest_running=false;
      this.resetRemain();
      this.setEndTime();
    },
    modifyWork: function(inc) {
      if (this.work_running && !this.paused) return;
      this.work_time+=inc;
      if (this.work_time<0) this.work_time=0;
      if (this.work_running || (!this.work_running && !this.rest_running)) {
        this.resetAll();
      }
      this.render();
    },
    modifyRest: function(inc) {
      if (this.rest_running && !this.paused) {
        return;
      }
      this.rest_time+=inc;
      if (this.rest_time<0) this.rest_time=0;
      if (this.rest_running || (!this.work_running && !this.rest_running)) {
        this.resetAll();
      }
      this.render();
    },
    rmRest: function() {
        if (this.rest_time > 0) {
            this.rest_time-=1;
            this.render();
        }
    },
    lpad: function(str, char, size) {
      return (str.length<size?this.lpad(char+str, char, size-1):str);
    },
};

$(document).ready(function(){
    $('button#add-work').on('click', function() {
        state.modifyWork(1);});
    $('button#d-work').on('click', function() {
        state.modifyWork(-1);});
    $('button#add-rest').on('click', function() {
      state.modifyRest(1);});
    $('button#d-rest').on('click', function() {
        state.modifyRest(-1);});
    $('div.indicator').on('click', function() {
        state.onStart();
    });
    state.resetRemain();
    state.setEndTime();
    state.render();
    /*
    var circle = new pb.Circle('div.indicator', {
        color: '#FCB03C',
        duration: 3000,
        easing: 'easeInOut'
    });
    circle.animate(0.5);
    */
});
