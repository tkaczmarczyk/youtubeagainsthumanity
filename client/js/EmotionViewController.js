 angular.module('YAH')
  .controller('EmotionViewController', function($scope) {
   var context = this;
   var snapInterval;
   
   context.emotionLevels = {};

   function dataURItoBlob(dataURI) {
    'use strict'
    var byteString,
     mimestring

    if (dataURI.split(',')[0].indexOf('base64') !== -1) {
     byteString = atob(dataURI.split(',')[1])
    }
    else {
     byteString = decodeURI(dataURI.split(',')[1])
    }

    mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]

    var content = new Array();
    for (var i = 0; i < byteString.length; i++) {
     content[i] = byteString.charCodeAt(i)
    }

    return new Blob([new Uint8Array(content)], {
     type: mimestring
    });
   }

  
   function snapshot() {
    var blob;

    video = document.querySelector('video');
    canvas = document.querySelector('canvas');
    canvasContext = canvas.getContext('2d');


    console.log("oh snap!");
    canvasContext.drawImage(video, 0, 0);
    // "image/webp" works in Chrome.
    // Other browsers will fall back to image/png.
    document.querySelector('img').src = canvas.toDataURL('image/jpeg');

    var dataURI = canvas.toDataURL('image/jpeg');

    blob = dataURItoBlob(dataURI);

    $.ajax({
      url: "https://api.projectoxford.ai/emotion/v1.0/recognize",
      beforeSend: function(xhrObj) {
       // Request headers
       xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
       xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", " 04ba23587af84137bc65223296969d13");
      },
      type: "POST",
      // Request body
      data: blob, // //.replace("image/jpeg", "application/octet-stream"),
      processData: false
     })
     .done(function(data) {
      $("pre").text(JSON.stringify(data, null, '\t'));
      $scope.$apply(function(){
       context.emotionLevels = data;
      });
      console.log(data);
     })
     .fail(function() {
      console.log("error");
     });
   }


   context.startSnapping = function() {
    context.snapInterval = window.setInterval(snapshot, 3000);
    snapshot();
   }

   context.stopSnapping = function() {
    clearInterval(context.snapInterval);
   }

   angular.element(document).ready(function() {

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    var video = document.querySelector('video');


    var vgaConstraints = {
     video: {
      mandatory: {
       maxWidth: 640,
       maxHeight: 360
      }
     }
    };

    if (navigator.getUserMedia) {
     navigator.getUserMedia(vgaConstraints, function(stream) {
      video.src = window.URL.createObjectURL(stream);
     }, function() {
      console.log("ERRORERROR");
     });
    }
    else {
     // video.src = 'somevideo.webm'; // fallback.
    }

   });

  });