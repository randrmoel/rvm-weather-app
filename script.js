var inTxt="";
var iconPic = "";
var lat="";
var lng="";
var m = moment();
var nowDate = m.format("MM/DD/YYYY");

// Need another button listener for the added cities to recall the forcast

function addCity(cityName){
    newLi = $("<li>").text(cityName).attr("class","list-group-item");
    $("#city").prepend(newLi);
}

function clrInput(){
    $("#txtbx").val("");
}

function clrCity(){
    $("#city").empty();
}

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

function runQuery(inCity){
    qBlnk1 = "https://api.openweathermap.org/data/2.5/weather?q=";
    qBlnk2 = "https://api.openweathermap.org/data/2.5/forecast?q=";

    Units = "&units=imperial"; 
    API = "&APPID=7872f4a78b77312be971aa3219f71aef";
    qNow = qBlnk1+inCity+Units+API;
    
    qFutr = qBlnk2+inCity+Units+API;

    addCity(inCity);
    clrInput();
        $.ajax(
            {url:qNow,
            type:"GET"
            }).then(function(resp){
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
        }); // End of outer ajax call 1

        $.ajax(
            {url:qFutr,
            type:"GET"
        }).then(function(resp3){
            frcstArry = [];
            //console.log(resp3);
            for(i=0; i<resp3.list.length; i++){
                if (resp3.list[i].dt_txt.indexOf("15:00:00") !== -1){
                    frcstArry.push(resp3.list[i]);
                }
            }
            //console.log(frcstArry);
            for(i=0; i<5; i++){
                dateStr = ["#Date-0", "#Date-1", "#Date-2", "#Date-3", "#Date-4"];
                iconStr = ["#Weather-Icon-0", "#Weather-Icon-1", "#Weather-Icon-2", "#Weather-Icon-3", "#Weather-Icon-4"];
                tempStr = ["#Temp-0", "#Temp-1", "#Temp-2", "#Temp-3", "#Temp-4"];
                humStr = ["#Hum-0", "#Hum-1", "#Hum-2", "#Hum-3", "#Hum-4"];
                dt = frcstArry[i].dt_txt;
                dt = dt.substring(5,7) + "/" + dt.substring(8,10) + "/" + dt.substring(0,4);
                dt = dt.trim();
                //console.log(dt);
                
                $(dateStr[i]).text(dt);
   
                icon = frcstArry[i].weather[0].icon;
                iconPic = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
                //console.log(iconPic);
                $(iconStr[i]).html("<img style='width:90%; padding:0; margin:0' src="+ iconPic + ">");
                $(tempStr[i]).html(parseFloat(frcstArry[i].main.temp).toFixed(1) + "&#176" +"F");
                $(humStr[i]).text(frcstArry[i].main.humidity+"%")
            }
        }); //End of outer ajax call for forecast
}

clrCity();

$(".btn").on("click", function(e){
    e.preventDefault();
    inCity = $.trim($("#txtbx").val());
    runQuery(inCity);
}); // End of button listener 1

$("#city").on("click", function(e){
    e.preventDefault();
    e.stopPropagation();
    whcCity = $(event.target).text();
    runQuery(whcCity); 
});