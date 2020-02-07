var inTxt="";
var iconPic = "";
var lat="";
var lng="";
var m = moment();
var nowDate = m.format("MM/DD/YYYY");

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
    console.log("n");
    console.log(n);
    if (n <=2) {
        console.log("<=2");
        return "#76A942";
    } else if (n<=5) {
        console.log("<=5");
        return "#F7ED00";
    } else if (n<=7) {
        console.log("<=7");
        return "#E1AF33";
    } else if (n<=10) {
        console.log("<=10");
        return "#C42B00";
    } else {
        console.log(">10");
        return "#603BBF";
    }
}

clrCity();

$(".btn").on("click", function(e){

    e.preventDefault();
    inCity = $.trim($("#txtbx").val());
    console.log(inTxt);
    qBlnk1 = "https:\\api.openweathermap.org/data/2.5/weather?q=";
    qBlnk2 = "https:\\api.openweathermap.org/data/2.5/forecast?q=";

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
                iconPic = "http://openweathermap.org/img/wn/"+resp.weather[0].icon+"@2x.png";
                //console.log(iconPic);
                console.log(resp);
                //isoDate = resp.
                $("#dispCity").html(inCity + " (" + nowDate +")" + "<img <img style='vertical-align:middle; width:6%; padding:0; margin:0' src="+ iconPic + ">");
                $("#dispTmp").html(" "+parseFloat(resp.main.temp).toFixed(1) + "<span>&#176</span>" +"F");
                $("#dispHum").text(" "+resp.main.humidity+"%")
                $("#dispWnd").text(" "+resp.wind.speed + " MPH")
                console.log(resp.coord.lon);
                console.log(resp.coord.lat);
                lng=resp.coord.lon;
                lat=resp.coord.lat;

                qUVI = "https:\\api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lng;
                qU = qUVI + API;
            
                $.ajax(
                    {url:qU,
                    type:"GET"
                    }).then(function(resp2){
                        console.log(resp2);
                        uvTxt = parseFloat(resp2.value).toFixed(1);
                        $("#dispUV").text(" " + uvTxt +" ");
                        // get the appropriate background color
                        color = uviColor(uvTxt); 
                        console.log(color);
                        $("#dispUV").attr("style", "background-color:" + color + "; color:white; margin-left:2px; padding-right:5px");
                });
            
        }); 


})