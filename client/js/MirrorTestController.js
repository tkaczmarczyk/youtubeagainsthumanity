 angular.module('YAH')
    .controller('MirrorTestController', function() {
    var context = this;
    
    context.lastSnapshotAsDataUrl = "";
    context.cameraVideoWidth = 0;
    context.cameraVideoHeight = 0;
    
    context.captureSnapshot = function() {
      var video = document.querySelector('video');
      var canvas = document.querySelector('canvas');
      
      context.cameraVideoHeight = video.offsetHeight;
      context.cameraVideoWidth = video.offsetWidth;
    
      canvas.height = context.cameraVideoHeight;
      canvas.width = context.cameraVideoWidth;
      
      var canvasContext = canvas.getContext('2d');
      canvasContext.drawImage(video, 0, 0);
      
      context.lastSnapshotAsDataUrl = canvas.toDataURL('image/jpeg');
    };
    
    angular.element(document).ready(function () {
    		var video = document.querySelector('video');
    		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    		if (navigator.getUserMedia) {
    		    navigator.getUserMedia({
    		        audio: false,
    		        video: true
    		    }, function(stream) {
    		        video.src = window.URL.createObjectURL(stream);
    		        context.cameraVideoHeight = video.offsetHeight;
    		        context.cameraVideoWidth = video.offsetWidth;
    		    }, function() {
    		        console.log("Error gettingin navigator.getUserMedia")
    		    });
    		}
    		else {
    		    // fallback.
    		}
    });
});