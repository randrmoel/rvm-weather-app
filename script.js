var inTxt="";
var iconPic = "";

$(".btn").on("click", function(e){
    e.preventDefault();
    inCity = $.trim($("#txtbx").val());
    console.log(inTxt);
    queryBlnk = "https:\\api.openweathermap.org/data/2.5/weather?q=";
    query = queryBlnk+inCity+"&APPID=7872f4a78b77312be971aa3219f71aef";
    
    $.ajax(
        {url:query,
        type:"GET"
        }).then(function(resp){
            console.log(resp);
            console.log(resp.weather[0]);
            iconPic = "http://openweathermap.org/img/wn/"+resp.weather[0].icon+"@2x.png";
            console.log(iconPic);
        });

})