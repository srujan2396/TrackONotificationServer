var admin = require("firebase-admin");

var serviceAccount = require("C:/New folder/TrackO/SampleServer/TrackO-eca2781350b8.json");
var request = require('request');

var API_KEY = "AAAAOT4O-CQ:APA91bEPdfa7LH1MkQsp8gBS7d7yQ-kLya2JTCTL2l6Uu2OjS7epCVNv3ugAJqwBxNYl66Yg_EEuNsMqb8IgvF2aKU_3OoIhBuStrUk-U_3xtJH3FyQreQGxUWJbO0rdjSMeogUmE8aM"; // Your Firebase Cloud Messaging Server API key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tracko-994e3.firebaseio.com"
});

ref = admin.database().ref();

function listenForNotificationRequests() {
  var requests = ref.child('notificatiorequests');
  requests.on('child_added', function(requestSnapshot) {
    var request = requestSnapshot.val();
    sendNotificationToUser(
      request.phno,
      request.fname,
      request.message,
      request.fromphno,
      request.name,
      function() {
        requestSnapshot.ref.remove();
      }
    );
  }, function(error) {
    console.error(error);
  });
   console.log("sended notification");
}

function sendNotificationToUser(phno,username, message,fromphno,name, onSuccess) {
  request({
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type' :' application/json',
      'Authorization': 'key='+API_KEY
    },
    body: JSON.stringify({
    //   notification: {
    //     title: "Location Request From "+username,
    //     icon: "ic_action_locatio",
    //     body: message,
    //     click_action: "com.example.srujansai.myapplication_TARGET_REQUEST"
    //  },
    data:{
         title: "Location Request From "+username,
         icon: "ic_action_locatio",
         body: message,
         click_action: "com.example.srujansai.myapplication_TARGET_REQUEST",
         phno:phno,
         name:username,
         fromphno:fromphno,
         fromname:name
    },
      to : '/topics/TRACKO_'+phno
    })
  }, function(error, response, body) {
    if (error) { console.error(error); }
    else if (response.statusCode >= 400) { 
      console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage); 
    }
    else {
      onSuccess();
    }
  });
}

// start listening
listenForNotificationRequests();