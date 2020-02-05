var inTxt="";
var iconPic = "";

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

clrCity();

$(".btn").on("click", function(e){
    e.preventDefault();
    inCity = $.trim($("#txtbx").val());
    console.log(inTxt);
    queryBlnk = "https:\\api.openweathermap.org/data/2.5/weather?q=";
    query = queryBlnk+inCity+"&APPID=7872f4a78b77312be971aa3219f71aef";
    addCity(inCity);
    clrInput();
    
/*     $.ajax(
        {url:query,
        type:"GET"
        }).then(function(resp){
            console.log(resp);
            console.log(resp.weather[0]);
            iconPic = "http://openweathermap.org/img/wn/"+resp.weather[0].icon+"@2x.png";
            console.log(iconPic);
        }); */

})