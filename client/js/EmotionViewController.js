 angular.module('YAH')
  .controller('EmotionViewController', function($scope, $location, GlobalContext) {
   var context = this;
   var snapInterval;
   var countdownInterval;

   context.GC = GlobalContext;
   context.emotionLevels = {};
   context.timeLeft = 20;
   context.movieUrl = "https://www.youtube.com/embed/" + youtube_parser(GlobalContext.currentRound.movieUrl) + "?rel=0&controls=0&showinfo=0&autoplay=1";

   function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
   }

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
      GlobalContext.getCurrentPlayer().emotions.push(data);

      $scope.$apply(function() {
       context.emotionLevels = data;
       GlobalContext.currentRound.mostRecentHappinessLevel = data[0].scores.happiness;
       GlobalContext.checkThreshold();
      });

      console.log(data);
     })
     .fail(function() {
      console.log("error");
     });
   }



   function countdown() {

    $scope.$apply(function() {
     context.timeLeft--;
     if (context.timeLeft <= 0) {
      clearInterval(context.snapInterval);
      clearInterval(countdownInterval);
      $location.path("/roundSummary");
     }
    });

   }

   context.snapInterval = window.setInterval(snapshot, 3000);
   countdownInterval = window.setInterval(countdown, 1000);
   // context.startSnapping = function() {
   // context.snapInterval = window.setInterval(snapshot, 3000);
   // snapshot();
   // }

   // context.stopSnapping = function() {
   // clearInterval(context.snapInterval);
   // }


  });