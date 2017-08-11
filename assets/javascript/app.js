
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAsLYR36HcTtl6dC1926N0aeZ-wT-Zz7o0",
    authDomain: "train-scheduler-577aa.firebaseapp.com",
    databaseURL: "https://train-scheduler-577aa.firebaseio.com",
    projectId: "train-scheduler-577aa",
    storageBucket: "",
    messagingSenderId: "21660461554"
  };
  firebase.initializeApp(config);

var database = firebase.database();
var trainName="";
var destination="";
var firstTrain=0;
var frequency=0;

 $("#submitButton").on("click", function() {
      // Don't refresh the page!
      event.preventDefault();

trainName = $("#trainName").val().trim();
destination = $("#destination").val().trim();
firstTrain = $("#firstTrain").val().trim();
frequency = $("#frequency").val().trim();

//pushing the data to database
database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
      });
$(".form-control").empty();
});

//to get the data from our database
database.ref().on("value", function(snapshot) {

//clearing the table before append the new input
$("tbody").empty();

//"for every train..."
for (var train in snapshot.val()) {

  //dynamically creating td for each train and assign it to a value
    var trainNameTd = $("<td class='trainName'>").text(snapshot.val()[train].trainName);
    var destinationTd=$("<td class='destination'>").text(snapshot.val()[train].destination);
    var frequencyTd=$("<td class='frequency'>").text(snapshot.val()[train].frequency);
    
    //storing firstTrain in to variable 
    var firstTrain = snapshot.val()[train].firstTrain;
    //storing frequency to a variable
    var freq = snapshot.val()[train].frequency;

    //pushed back 1 year to make sure it comes before current time
    firstTrain = moment(firstTrain, "HH:mm").subtract(1, "years");
    
    //current time 
    var currentTime = moment();
    //consoling current time in military time
    //console.log("current ob: " + moment(currentTime).format("HH:mm"));

    //getting the diffrence between current time and first train time in minutes 
    var diff = currentTime.diff(firstTrain, "minutes");
   
    //get remender
    var remender = diff%freq;
    var minutes = freq-remender;
    //updating the DOM
    var minutesAwayTd=$("<td class='minutesAway'>").text(minutes);
    //calculating the next arival time
    var nextArival = moment().add(minutes, "minutes").format("HH:mm");
    var nextArivalTd=$("<td class='nextArival'>").text(nextArival); 
   
//subtract from current time first train time
//divide the result by the frequency
//get the difference 
//first train 3:00
//3:16
//7min,3:14, 3:21
//16%7=2
//7-2= 5
//3:21

  //append all tds to a new tr
    var trainRow = $("<tr>")
      .append(trainNameTd)
      .append(destinationTd)
      .append(frequencyTd)
      .append(nextArivalTd)
      .append(minutesAwayTd);
      
  //append the dynamically created tr to tbody
    $("tbody").append(trainRow);
  } 

        // Handle the errors
}, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
});
