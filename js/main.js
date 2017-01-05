/**
 * Created by Aurelio on 30/12/2016.
 */
$(document).ready(function () {

    //TODO: Primero, obtener el listado de clinicas del Open Data
    //TODO: Segundo, cargar una cierta cantidad de esas clinicas como marcadores en el Mapa, limitado por el zoom y coords
    //TODO: Tercero, cuando se haga click, mostrar la informacion y poner el link a una pagina de edicion de ese punto en el mapa
    //TODO: Cuarto, pagina de edicion y evaluacion de la clinica y institucion de salud
    alert("dentro del ready");
    cargarClinicas();
});

//Funcion que inicializa el mapa de Google Maps, aqui se podria poner que cargue los elementos del JSON o
//del repositorio de Open Data
function initMap() {
    var uluru = {lat: -25.363, lng: 131.044};

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });

    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
        '<div id="bodyContent">'+
        '<p><b>Uluru</b>, esto es un texto de prueba... '+
        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
        'south west of the nearest large town, Alice Springs; 450&#160;km '+
        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
        'features of the Uluru - Kata Tjuta National Park. Uluru is '+
        'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
        'Aboriginal people of the area. It has many springs, waterholes, '+
        'rock caves and ancient paintings. Uluru is listed as a World '+
        'Heritage Site.</p>'+
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
        'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
        '(last visited June 22, 2009).</p>'+
        '</div>'+
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: uluru,
        map: map,
        title: 'Uluru (Ayers Rock)'
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    var features = [
        {
            position: new google.maps.LatLng(-31.4039739, 148.5253239),
            type: 'info'
        }, {
            position: new google.maps.LatLng(-33.91539, 151.22820),
            type: 'info'
        }, {
            position: new google.maps.LatLng(-33.91747, 151.22912),
            type: 'info'
        }
    ];

    for (var i = 0, feature; feature = features[i]; i++) {
        addMarker(feature, map);
    }

    cargarClinicas();
}

function addMarker(feature, map) {
    var marker = new google.maps.Marker({
        position: feature.position,
        map: map
    });
}

function cargarClinicas(){

    alert('Cargar clinicas');
    //var url = "http://linkdata.org/api/1/rdf1s4633i/herb_rdf.json";
    var url = "res/json/nagoyahospital_rdf.json";
    //TODO: Cambiarlo a la libreria de RDF

    alert(url);

    $.getJSON(url, function (json) {
        alert("a ");
        var au = "prueba";
        alert(json[0].value);
        $.each(json.list, function (i, fb) {
            alert(fb.value);
        });
    });
}

