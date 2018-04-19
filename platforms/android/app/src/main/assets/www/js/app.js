$(document).ready(function() {
 
  var city = localStorage.getItem("ville"); //on récupere la variable localStorage ayant pour clé city, puis on la met dans une variable
  var cardSelector = $("#card"); //on met notre sélecteur dans une variable
 
  function getWeather() { // on crée une fonction qui récupere la météo avec les instructions suivantes
    if (city == null) { // on teste si la variable city est nulle
      cardSelector.append("<p>Vous n'avez pas encore renseign&eacute; de ville.</p>"); // on affiche un message dans la card
    } else { // sinon ...
      $("#card *:not(div)").remove();
 
      var APPID_temps = "145fb049dbecc0d85cb56344829221ec"; //ici on déclare notre APPID pour OpenWeatherMap
      var APPID_fuseau = "AIzaSyB7jdHDAMP9HaO6L3jfL9fb-iBkZFDGY_I"
     
      $.getJSON("http://api.openweathermap.org/data/2.5/weather?APPID=" + APPID_temps + "&q=" + city, function(result) { // on mets le résultat dans une variable result qui vaut le code JSON qu'on voit dans le navigateur
        var cityName = result.name; // le nom de la ville est directement accesible donc pas de souci
        var weatherType = result.weather[0].main; // la description du temps est dans le tableau weather (un tableau est défini par des []), on vise le premier (0 = le premier en programmation), puis on prend la valeur de main
        var iconCode = result.weather[0].icon; // Meme chose qu'au dessus sauf qu'on prend la valeur de icon
        var temp = result.main.temp+10; // cette fois ci on va dans main qui n'est pas un tableau donc pas de '[]', on va de main a temp sans souci
        var tempInCelsius = (temp - 273.15).toFixed(1); // notre temperature est en Kelvin donc on effectue notre soustration pour l'avoir en Celsius, puis le toFixed permet d'arrondir une valeur, le 1 correspond à un chiffre apres la virgule
        var lattitude = result.coord.lat;
        var longitude = result.coord.lon;
        var sunrise = result.sys.sunrise;
        var sunset = result.sys.sunset;
        var timestamp = result.dt;

        console.log(result);
        // ici on rempli la card avec nos valeurs, premierement la liste d'information, puis ensuite on affiche l'image avec le code icone
        function timeConverter(UNIX_timestamp){
            var a = new Date(UNIX_timestamp*1000);
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var temps = hour + ':' + min + ':' + sec;
            return temps;
        }


          $.getJSON("https://maps.googleapis.com/maps/api/timezone/json?location=" + lattitude + "," + longitude + "&timestamp="+ timestamp+ "&key=" + APPID_fuseau, function(result2) {
              var rawOffset = result2.rawOffset;
          
          
            decalageHoraire= timeConverter(rawOffset);
            console.log(rawOffset);
            console.log("lever de soleil : " + sunrise);
            console.log("coucher de soleil : " + sunset);
            if ( lattitude < 0 )
            {
              sunrise = sunrise - rawOffset - 3600;
              sunset = sunset - rawOffset - 3600;
            }
            else
            {
              sunrise = sunrise + rawOffset - 3600;
              sunset = sunset + rawOffset - 3600;
            }
            
            console.log("lever de soleil : " + sunrise);
            console.log("coucher de soleil : " + sunset);
        
        var leverSoleil = timeConverter(sunrise);
        var coucherSoleil = timeConverter(sunset);
        cardSelector.append("<ul id=\"cemenu\"><li>Ville : " + cityName + "</li><li>Temps : " + weatherType + "</li><li> Temperature : " + tempInCelsius + " &deg;C</li><li>Lever de soleil : " + leverSoleil + "</li><li>Coucher de soleil : " + coucherSoleil + "</li></ul>");
        cardSelector.append("<img src='img/" + iconCode + ".png' alt='Weather Icon' width='80px' height='80px'>");
 
        // voila notre utilisateur voit les informations météo de sa ville
        })
      });
    }
  }
 
  function submitForm() { // on crée une fonction qui récupere la valeur du formulaire
    var mycity = $('input').val(); // on récupere la valeur de notre input avec .val() et on la mets dans une variable
    if (mycity.length >= 3) { // si la variable donc la ville de l'utilisateur est plus grande ou egale que 3 caracteres alors ...
      localStorage.setItem("city", mycity); // on crée une variable localStorage, avec pour clé city et comme valeur la ville de l'utilisateur
      city = mycity; // on donne la ville à la variable city qui est utilisée dans la fonction getWeather
      getWeather(); // on appelle la fonction getWeather pour récuperer la météo de cette ville, ville qui est stockée dans la variable city
    } else { // si le champs fait 2 caracteres ou moins on ...
      alert('empty field'); // affiche une erreur
    }
  }
 
  $('#getWeather').on('touchstart', function() { // quand on commence à toucher le bouton avec l'id getWeather, alors ...
    submitForm(); // ... on appelle la fonction submitForm qui va traiter ce qu'il y a dans le champ de la ville
  });
 
  $('form').submit(function(event) { // quand on soumet le formulaire, c'est à dire qu'on appuie sur la touche Entrée, alors ...
    console.log("test");


        
    event.preventDefault(); // ici on annule le comportement par défault qui est de recharger la page quand on soumet un formulaire
    submitForm(); // ... on appelle la fonction submitForm qui va traiter ce qu'il y a dans le champ de la ville
  });

     $('#getPos').on('touchstart', function() { // quand on commence à toucher le bouton avec l'id getWeather, alors ...
    var onSuccess = function(position) {
            alert('Latitude: '          + position.coords.latitude          + '\n' +
                  'Longitude: '         + position.coords.longitude         + '\n' +
                  'Altitude: '          + position.coords.altitude          + '\n' +
                  'Accuracy: '          + position.coords.accuracy          + '\n' +
                  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                  'Heading: '           + position.coords.heading           + '\n' +
                  'Speed: '             + position.coords.speed             + '\n' +
                  'Timestamp: '         + position.timestamp                + '\n');
        };

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
  });
 
  getWeather(); // ici on appelle à l'allumage de l'application la fonction getWeather
});