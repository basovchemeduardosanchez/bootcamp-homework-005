/**
 * Generates one row for the calendar and appends it to the container
 * @param {string} pType either furture,past or present
 * @param {string} pTimestamp  timestamp retreived from moment.js
 * @param {string} pContent event description
 */
function appendRow(pType,pTimestamp,pContent){
    // Generates the following HTML
    // <div class="row time-block future">
    //     <div class="hour">00:00</div>  
    //       <textarea>TEXT</textarea>
    //       <div class="description">DESCRIPTION</div>
    //       <button type="button" class="saveBtn">BUTTON_LABEL</button>
    //   </div>
    var lTimeBlock$ = $( "<div></div>" )
        .addClass( "row time-block" ) 
        .addClass(pType)
        .appendTo(".container");
    var lHour$ = $( "<div></div>" )
        .addClass( "hour" )
        .text( pTimestamp )
        .appendTo( lTimeBlock$ );
    var lTextarea$ = $( "<textarea></textarea>" )
        .val( pContent )
        .appendTo( lTimeBlock$ );
    var lSaveButton$ = $( "<button></button>" )
        .attr( "type", "button" )
        .addClass( "saveBtn" )
        .html( '<i class="far fa-save"></i>' )
        .appendTo( lTimeBlock$ )
        // When saving the event description will push it on the 
        // local storage based on the timestamp 
        .on ("click",function(pEvent){
            localStorage.setItem("content_" + pTimestamp,lTextarea$.val());
        }
            )
    // If the text area of the time block is in the past
    // it will disable the edition on the text area
    if ( pType === "past"){
        lTextarea$.prop( "disabled", true );
        lSaveButton$.prop( "disabled", true );
    }
    $(lTextarea$).keydown(function (pEvent){
        if ((pEvent.metaKey || pEvent.ctrlKey) && pEvent.keyCode == 83) { /*ctrl+s or command+s*/
            pEvent.preventDefault();
            localStorage.setItem("content_" + pTimestamp,lTextarea$.val());
            return false;
        }
    });
}

/**
 * 
 * @param {number} pHour The haur to compart with the current timestamp
 * so it can resolve wether if it is on the past present or future
 * 
 * @return {string} Will return a string definifn past future or present
 */
function getBlockType ( pHour ){
    var lResult = "past";
    var lMomentum =  moment().hour() ;
    if ( pHour > lMomentum ){
        lResult = "future"; 
    } else if ( pHour === lMomentum ){
        lResult = "present";
    }
    return lResult;
}
$( document ).ready( function(){
    var lStartHour = 9;
    var lEndHour = 17;
    $( "#currentDay" ).text( moment().format( 'MMMM Do YYYY, h:mm:ss a' ) );
    for ( var i = lStartHour; i <= lEndHour; i++ ){
        var lTimestamp = String(i).padStart(2,"0") + ":00";
        var lContent = localStorage .getItem( "content_" + lTimestamp );
        var lType = getBlockType(i);
        appendRow(lType,lTimestamp,lContent);  
    }
} );


