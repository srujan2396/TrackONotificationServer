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
      request.fphno,
      request.fname,
      request.message,
      request.selfphone,
      request.selfname,
      function() {
       // requestSnapshot.ref.remove();
       console.log("notification sended");
      }
    );
  }, function(error) {
    console.error(error);
  });
   console.log("sended notification");
}

function sendNotificationToUser(fphno,fname, message,selfphno,selfname, onSuccess) {
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
         notification:"true",
         title: "Location Request From "+fname,
         icon: "ic_action_locatio",
         body: message,
         click_action: "com.example.srujansai.myapplication_TARGET_REQUEST",
         phno:fphno,
         name:fname,
         fromphno:selfphno,
         fromname:selfname
    },
      to : '/topics/TRACKO_'+fphno
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

function AcceptRequests() {
  var requests = ref.child('acceptrequests');
  requests.on('child_added', function(requestSnapshot) {
    var request = requestSnapshot.val();
    sendAcceptDataToUser(

      request.fname,
       request.fphno,
      request.message,
      request.selfname,
      request.selfphno,
      request.status,
      function() {
       // requestSnapshot.ref.remove();
       console.log("readed")
      }
    );
  }, function(error) {
    console.error(error);
  });
   console.log("sended notification");
}

function sendAcceptDataToUser(fname,fphno,message,selfname,selfphno,status, onSuccess) {
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
         notification:"false",
         fname:fname,
         fphno:fphno,
         message:message,
         selfname:selfname,
         selfphno:selfphno,
         status:status


    },
      to : '/topics/TRACKO_'+fphno
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
AcceptRequests();