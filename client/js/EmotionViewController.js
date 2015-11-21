 angular.module('YAH')
  .controller('EmotionViewController', function($scope, $location, GlobalContext, ngAudio) {


   var context = this;
   var snapInterval;
   var countdownInterval;

   var funnies = [];
   funnies.push("https://www.youtube.com/watch?v=Q9zvgcOrTtw");
   funnies.push("https://www.youtube.com/watch?v=dsHkLJ495Ro");
   funnies.push("https://www.youtube.com/watch?v=s2g9WhgbAus");
   funnies.push("https://www.youtube.com/watch?v=zwjY120dsvk");
   funnies.push("https://www.youtube.com/watch?v=XrqiJBtT6gA");
   funnies.push("https://www.youtube.com/watch?v=vwrvbjBF7YQ");
   funnies.push("https://www.youtube.com/watch?v=1o_kH5tAggk");
   funnies.push("https://www.youtube.com/watch?v=zBJU9ndpH1Q");
   funnies.push("https://www.youtube.com/watch?v=6dhXrzs8pJc");
   funnies.push("https://www.youtube.com/watch?v=lPuZ7aR_Oxw");
   funnies.push("https://www.youtube.com/watch?v=q4UwUdCsgvk");
   funnies.push("https://www.youtube.com/watch?v=AZ6WwVRKWV0");
   funnies.push("https://www.youtube.com/watch?v=AWvefaN8USk");
   funnies.push("https://www.youtube.com/watch?v=AXnrH8RqkpI");
   funnies.push("https://www.youtube.com/watch?v=qGBrYtELsGo");

   context.GC = GlobalContext;
   context.emotionLevels = {};
   context.timeLeft = 20;
   context.movieUrl = "https://www.youtube.com/embed/" + youtube_parser(GlobalContext.currentRound.movieUrl) + "?rel=0&controls=0&showinfo=0&autoplay=1";
   context.forWhom = GlobalContext.getCurrentPlayer();

   apiKeys = [];
   apiKeys.push("04ba23587af84137bc65223296969d13");
   apiKeys.push("578c181b483b44b188d9336832ca9158");
   apiKeys.push("fb2cdf80586e449c98f477ebc43ded8a");
   apiKeyIndex = 0;

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
       xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKeys[apiKeyIndex % apiKeys.length]);
       apiKeyIndex++;

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
      ngAudio.load("/client/audio/214898__copyc4t__cartoon-throw.wav").play();

     }
    });

   }

   context.snapInterval = window.setInterval(snapshot, GlobalContext.emotionCheckInterval);
   countdownInterval = window.setInterval(countdown, 1000);
   // context.startSnapping = function() {
   // context.snapInterval = window.setInterval(snapshot, 3000);
   // snapshot();
   // }

   // context.stopSnapping = function() {
   // clearInterval(context.snapInterval);
   // }


  });