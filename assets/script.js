//Initialize variables

var inTxt="";
var iconPic = "";
var lat="";
var lng="";
var m = moment();
var nowDate = m.format("M/D/YYYY");
var inCity = "";
var cityList =[];
const initCity = [];
addIt = true;

function noLeadZero(sDatePart){
    if(sDatePart[0]==="0"){
        return sDatePart.slice(1);
    } else return sDatePart;
}

// prepend a city to the html, city name has been processed as Title Case
// and won't be added if it's not found by the weather api
function addCity(cityName){
    newLi = $("<li>").text(cityName).attr("class","list-group-item");
    $("#city").prepend(newLi);
} 

// Renders the local storage list to the HTML
function rendHist(){
    for(i=cityList.length-1; i > -1; i--){
        addCity(cityList[i]);
    }
    runQuery(cityList[0], false);
}


// Resets the HTML to its initial state
function initHTML(){
    $("#dispCity").text("City");
    $("#dispTmp").text("");
    $("#dispHum").text("");
    $("#dispWnd").text("");
    $("#dispUV").text("");
    $("#dispUV").attr("style", "background-color:white; color:white; margin-left:2px; padding-right:5px");

    
    dateTxt = ["Date 0", "Date 1", "Date 2", "Date 3", "Date 4"]
    dateStr = ["#Date-0", "#Date-1", "#Date-2", "#Date-3", "#Date-4"];
    iconStr = ["#Weather-Icon-0", "#Weather-Icon-1", "#Weather-Icon-2", "#Weather-Icon-3", "#Weather-Icon-4"];
    tempStr = ["#Temp-0", "#Temp-1", "#Temp-2", "#Temp-3", "#Temp-4"];
    humStr = ["#Hum-0", "#Hum-1", "#Hum-2", "#Hum-3", "#Hum-4"];

    for(i=0; i<5; i++){
        $(dateStr[i]).text(dateTxt[i]);
        $(iconStr[i]).html("<img  style='width:90%; padding:0; margin:0' src='https://openweathermap.org/img/wn/01d@2x.png'>");
        $(tempStr[i]).text("Temp");
        $(humStr[i]).text("Humidity");
    }
}

// Initializes local memory and adds an object if missing
function initMem(){
    var memTest = JSON.parse(localStorage.getItem("pCityList"));
    
    if(memTest === null){
        localStorage.setItem("pCityList",JSON.stringify(initCity));
        cityList = [];
    } else if (memTest.length !== 0){
        cityList=JSON.parse(localStorage.getItem("pCityList"));
        clrCity();
        rendHist();
        
    }
}


// Function for creating Title case from city name, ensures proper capitalization
// of city names
function titleCase(s){
    s=s.toLowerCase().trim();
  
    l = s.split(" ");
    for(i=0; i<l.length; i++){
        l[i] = l[i][0].toUpperCase() + l[i].slice(1);
    };
    s = l.join(" ");
    return s;
}


// clears the text box input
// used after input
function clrInput(){
    $("#txtbx").val("");
}

// Clears the local memory
function clrCity(){
    $("#city").empty();
}


// Sets the color of the UV Index based on a color standard
// see: http://www.theozonehole.com/images/category.gif  Colors were matched
function uviColor(uvIndx){
    n = parseFloat(uvIndx);

    if (n <=2) {
        return "#76A942";
    } else if (n<=5) {
        return "#F7ED00";
    } else if (n<=7) {
        return "#E1AF33";
    } else if (n<=10) {
        return "#C42B00";
    } else {
        return "#603BBF";
    }
}

// This is the main query function
// It contains all the AJAX Calls and performs error handling
// HTML updates, and other housekeeping
function runQuery(inCity, addIt){
    qBlnk1 = "https://api.openweathermap.org/data/2.5/weather?q=";
    qBlnk2 = "https://api.openweathermap.org/data/2.5/forecast?q=";

    Units = "&units=imperial"; 
    API = "&APPID=7872f4a78b77312be971aa3219f71aef";
    qNow = qBlnk1+inCity+Units+API;
    
    qFutr = qBlnk2+inCity+Units+API;

    clrInput();
        $.ajax(
            {url:qNow,
            type:"GET"
            }).then(function(resp){
                if(addIt){
                    addCity(inCity);
                    cityList.unshift(inCity);
                    localStorage.setItem("pCityList", JSON.stringify(cityList));
                }

               
                iconPic = "https://openweathermap.org/img/wn/"+resp.weather[0].icon+"@2x.png";

                $("#dispCity").html(inCity + " (" + nowDate +")" + "<img  style='vertical-align:middle; width:6%; padding:0; margin:0' src="+ iconPic + ">");
                $("#dispTmp").html(" "+parseFloat(resp.main.temp).toFixed(1) + "<span>&#176</span>" +"F");
                $("#dispHum").text(" "+resp.main.humidity+"%")
                $("#dispWnd").text(" "+resp.wind.speed + " MPH")
                //UV Index Requires Latitude and Longitude and is a separate call
                lng=resp.coord.lon;
                lat=resp.coord.lat;

                qUVI = "https://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lng;
                qU = qUVI + API;
            
                $.ajax(
                    {url:qU,
                    type:"GET"
                    }).then(function(resp2){
                        uvTxt = parseFloat(resp2.value).toFixed(1);
                        $("#dispUV").text(" " + uvTxt +" ");
                        // get the appropriate background color
                        color = uviColor(uvTxt); 
                        $("#dispUV").attr("style", "background-color:" + color + "; color:white; margin-left:2px; padding-right:5px");
                }); // End of nexted ajax call 1
        }).catch(function(err){
            
            alert(err.responseJSON.message);
            return;
        }); // End of outer ajax call 1

        $.ajax(
            {url:qFutr,
            type:"GET"
        }).then(function(resp3){
            frcstArry = [];
            
            for(i=0; i<resp3.list.length; i++){
                if (resp3.list[i].dt_txt.indexOf("15:00:00") !== -1){
                    frcstArry.push(resp3.list[i]);
                }
            }
            
            for(i=0; i<5; i++){
                dateStr = ["#Date-0", "#Date-1", "#Date-2", "#Date-3", "#Date-4"];
                iconStr = ["#Weather-Icon-0", "#Weather-Icon-1", "#Weather-Icon-2", "#Weather-Icon-3", "#Weather-Icon-4"];
                tempStr = ["#Temp-0", "#Temp-1", "#Temp-2", "#Temp-3", "#Temp-4"];
                humStr = ["#Hum-0", "#Hum-1", "#Hum-2", "#Hum-3", "#Hum-4"];
                dt = frcstArry[i].dt_txt;
                dt = noLeadZero(dt.substring(5,7)) + "/" + noLeadZero(dt.substring(8,10)) + "/" + dt.substring(0,4);
                dt = dt.trim();
                
                
                $(dateStr[i]).text(dt);
   
                icon = frcstArry[i].weather[0].icon;
                iconPic = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
                
                $(iconStr[i]).html("<img style='width:80%; padding:0; margin:0' src="+ iconPic + ">");
                $(tempStr[i]).html("Temp: "+parseFloat(frcstArry[i].main.temp).toFixed(0) + "&#176" +"F");
                $(humStr[i]).text("Hum: " + frcstArry[i].main.humidity+"%")
            }
        }); //End of outer ajax call for forecast
}

// Start processing
initMem();


// Button listener for adding a city and finding its weather
$("#button-addon2").on("click", function(e){
    e.preventDefault();
    inCity = $.trim($("#txtbx").val());
    inCity = titleCase(inCity);
    if(cityList.indexOf(inCity) === -1){
        runQuery(inCity, true);
    }
    else {
        runQuery(inCity, false);
    }
}); // End of button listener 1


// Button listener for refinding weather from previous cities
// in the list
$("#city").on("click", function(e){
    e.preventDefault();
    e.stopPropagation();
    whcCity = $(event.target).text();
    runQuery(whcCity, false); 
});


//Button listener for erasing history and wiping the HTML
// form where cities are kept
$("#button-erase").on("click", function(e){
    e.preventDefault();
    clrCity();
    initHTML();
    localStorage.setItem("pCityList",JSON.stringify(initCity));
});
