$(document).ready(function () {

    $('#add-train').click(function () {
        if ($(this).text() === "Add Train") {
            $(this).text("Hide Add Train");
        } else {
            $(this).text("Add Train");
        }
    });

  

    
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAN5qpsyJOK-dUnIQXTyjJiyaLTpm4uljs",
        authDomain: "train-homework-60f8c.firebaseapp.com",
        databaseURL: "https://train-homework-60f8c.firebaseio.com",
        projectId: "train-homework-60f8c",
        storageBucket: "train-homework-60f8c.appspot.com",
        messagingSenderId: "466065512480"
      };
      firebase.initializeApp(config);

  var dataRef = firebase.database();

  var train = "";
  var destination = "";
  var first = 0;
  var frequency = 0;
  var timeUntil = 0;

  
  function inputFrequencyCorrection() {
    var modal = $('#myModal');
    $("#correction").text("Please enter a number for frequency.")
    modal.css("display", "block");
    setTimeout(function(){ modal.css("display", "none"); }, 3000);
  }

  function inputTimeCorrection() {
    var modal = $('#myModal');
    $("#correction").text("Please enter a time in military time.")
    modal.css("display", "block");
    setTimeout(function(){ modal.css("display", "none"); }, 3000);
  }

  
  function arrivalTime(time, tFrequency) {
   
    var firstTimeConverted = moment(time, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % tFrequency;
    var tMinutesTillTrain = tFrequency - tRemainder;
    timeUntil = tMinutesTillTrain;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    return moment(nextTrain).format("hh:mm");
  }


  $("#submit-button").on("click", function(event) {
    event.preventDefault();

    train = $("#tName-input").val().trim();
    destination = $("#destination-input").val().trim();
    first = $("#first-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    var re = /\d\d\:\d\d/;
    var OK = re.exec(first);   

    if(isNaN(frequency) || frequency === ""){
      inputFrequencyCorrection();
    }
    else if (!OK) {
        inputTimeCorrection();
    }
    else {

      dataRef.ref('Trains').push({
          trainInput:train,
          destinationInput:destination,
          firstTrainTime:first,
          frequencyInput:frequency,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
    })
  }
    $("#inputInfo").find('input:text').val("");
    $("#frequency-input").val(""); 
});
 
//Creates a table to display the train information (reading from the firebase database values), 
//including the calculated values
    dataRef.ref('Trains').orderByChild("dateAdded").on("child_added", function(snapshot){
        var newRow = $("<tr>");
        var newTrain = $("<td>");
        var newDestination = $("<td>");
        var newFrequency = $("<td>");
        var newArrival = $("<td>");
        var newMinAway = $("<td>");
        newTrain.text(snapshot.val().trainInput);
        newDestination.text(snapshot.val().destinationInput);
        newFrequency.text(snapshot.val().frequencyInput);
        newArrival.text(arrivalTime(snapshot.val().firstTrainTime, snapshot.val().frequencyInput));
        newMinAway.text(timeUntil);
        newRow.append(newTrain, newDestination, newFrequency, newArrival, newMinAway);
        $("#table-body").append(newRow);
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});