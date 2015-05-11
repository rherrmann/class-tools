var texts = ( function() {
  var lang = tabris.device.get( "language" ).replace( /-.*/, "" );
  try {
    return require( "./" + lang + ".json" );
  } catch( ex ) {
    return require( "./en.json" );
  }
}() );

var page = tabris.create( "Page", {
  id : "page",
  topLevel : true
} );

var actualPointsLabel = tabris.create( "TextView", {
  id: "actualPointsLabel",
  layoutData : {
    top: "10%",
    left: "10%"
  }
} ).appendTo( page );

var actualPointsInput = tabris.create( "TextInput", {
  keyboard: "decimal",
  layoutData : {
    baseline: actualPointsLabel,
    left: [ actualPointsLabel, 20 ],
    width: 100
  }
} ).appendTo( page );

var clearActualPointsButton = tabris.create( "Button", {
  image: "src/clear.png",
  layoutData : {
    baseline: actualPointsInput,
    left: [ actualPointsInput, 20 ],
  }
} ).appendTo( page );

var totalPointsLabel = tabris.create( "TextView", {
  id: "totalPointsLabel",
  layoutData : {
    top: [ actualPointsLabel, 20 ],
    left: "10%"
  }
} ).appendTo( page );

var totalPointsInput = tabris.create( "TextInput", {
  keyboard: "decimal",
  layoutData : {
    baseline: totalPointsLabel,
    left: [ actualPointsLabel, 20 ],
    width: 100
  }
} ).appendTo( page );

var resultingMarkLabel = tabris.create( "TextView", {
  id: "resultingMarkLabel",
  layoutData : {
    top: [ totalPointsLabel, 60 ],
    left: "10%"
  }
} ).appendTo( page );

var resultingMarkView = tabris.create( "TextView", {
  layoutData : {
    baseline: resultingMarkLabel,
    left: [ resultingMarkLabel, 20 ]
  }
} ).appendTo( page );

var updateResultingMark = function() {
  var text = "";
  var actualPoints = parseFloat( actualPointsInput.get( "text" ) );
  var totalPoints = parseFloat( totalPointsInput.get( "text" ) );
  if( !isNaN( actualPoints ) && !isNaN( totalPoints ) ) {
    var resultingMark = 6 - ( actualPoints / totalPoints * 5 );
    if( resultingMark >= 1 && resultingMark <= 6 ) {
      text = resultingMark.toFixed( 1 );
    }
  }
  resultingMarkView.set( "text", text );
}

clearActualPoints = function() {
  actualPointsInput.set( "text", "" );
  updateResultingMark();
}

saveSettings = function() {
  localStorage.setItem( "markCalculator.actualPoints", actualPointsInput.get( "text" ) );
  localStorage.setItem( "markCalculator.totalPoints", totalPointsInput.get( "text" ) );
}

restoreSettings = function() {
  var actualPoints = localStorage.getItem( "markCalculator.actualPoints" );
  if( actualPoints != null ) {
    actualPointsInput.set( "text", actualPoints );
  }
  var totalPoints = localStorage.getItem( "markCalculator.totalPoints" );
  if( totalPoints != null ) {
    actualPointsInput.set( "text", totalPoints );
  }
  updateResultingMark();
}

actualPointsInput.on( "input", updateResultingMark );
totalPointsInput.on( "input", updateResultingMark );
clearActualPointsButton.on( "select", clearActualPoints );
tabris.app.on( "pause", saveSettings );
tabris.app.on( "resume", restoreSettings );

page.apply( texts ).open();
