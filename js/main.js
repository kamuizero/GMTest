/**
 * Created by Aurelio on 30/12/2016.
 */
$(document).ready(function () {

    //El codigo contenido aqui cargara despues de finalizar todas las demas funciones

    //TODO: Primero, obtener el listado de clinicas del Open Data
    //TODO: Segundo, cargar una cierta cantidad de esas clinicas como marcadores en el Mapa, limitado por el zoom y coords
    //TODO: Tercero, cuando se haga click, mostrar la informacion y poner el link a una pagina de edicion de ese punto en el mapa
    //TODO: Cuarto, pagina de edicion y evaluacion de la clinica y institucion de salud

    //cargarClinicasv2();
});

//////////////////////////////
///// Variables globales /////
//////////////////////////////

var posicionInicial = {lat: 35.1547072, lng: 136.9613086};
var map;

var allMarkersData =[];
var activeInfoWindow;

//////////////////////////////

//Funcion que inicializa el mapa de Google Maps
function initMap() {

    //var uluru = {lat: -25.363, lng: 131.044};

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        //center: uluru,
        center: posicionInicial,
        mapTypeControl: false,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,
        streetViewControl: false
    });

    /*
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

    //Agregar el marcador ULURU
    var marker = new google.maps.Marker({
        position: uluru,
        map: map,
        title: 'Uluru (Ayers Rock)'
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
    */

    cargarClinicasv2();
}



function addMarkerInfoWindow(feature, mapa){

    var marker = new google.maps.Marker({
        description:feature.description,
        position: feature.position,
        map: mapa,
        title: feature.title,
        type: feature.type
    });


    var infowindow = new google.maps.InfoWindow();
    infowindow.setContent(crearContenido2(marker));

    function toggleBounce () {
        if (marker.getAnimation() != null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    // this part makes the markers clickable
    google.maps.event.addListener(marker, 'click', function() {

        if(activeInfoWindow != null) activeInfoWindow.close();

        // Open InfoWindow - on click
        toggleBounce();
        infowindow.open(map, marker);
        setTimeout(toggleBounce, 780);

        // Store new open InfoWindow in global variable
        activeInfoWindow = infowindow;

        //toggleBounce();
        //setTimeout(toggleBounce, 780);
    });

    /*

    marker.addListener('click', function() {
        infowindow.close();
        toggleBounce();
        infowindow.open(mapa, marker);
        setTimeout(toggleBounce, 780);
    }); */

    //Agregamos el marcador a la lista total
    allMarkersData.push(marker);
    return(marker);
}

function crearContenido2(marker){
    var html = '<p style="align-content: center"><strong>' + marker.title + '</strong></p><br>' + marker.description +
        '<br><br>' +
        'Languages: ' +
        '<p><a href="clinicReview.html?name=' + marker.title + '">'+
        'Review clinic</a></p>';
    return html;
}

function crearContenido(marker){
    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">'+ marker.title +'</h1>'+
        '<div id="bodyContent">'+
        '<p></p> ' +
        '<p>'  + marker.description +
        ' </p>' +
        '</div>'+
        '</div>';

    return contentString;
}

function cargarClinicasv2(){

    var this_data_list = [];

    //var url = "http://linkdata.org/api/1/rdf1s268i/nagoyahospital_rdf.json?callback=?";
    var url = "http://linkdata.org/api/1/rdf1s3965i/hospital_list_rdf.json?callback=?";

    $.getJSON(url, function(data) {
        var subject_list = Object.keys(data);
        var property_list = Object.keys(data[subject_list[0]]);
        var latNum = 0;
        var lngNum = 0;

        for (var p = 1; p < property_list.length; p++) { //1は連番だから無い

            var x = shortenProperty(property_list[p]);

            if (x == "lat" || x == "Lat" || x == "latitude" || x == "Latitude" || x == "緯度" ||
                    x.toLocaleLowerCase().includes("lat") ) {
                latNum = p;
            }

            if (x == "lng" || x == "Lng" || x == "long" || x == "longitude" || x == "Longitude" || x == "経度") {
                lngNum = p;
            }
        }

        if (latNum == 0 || lngNum == 0) {
            //alert("Unable to load hospital location data");
        } else {
            //alert("Data loaded successfully");
            //this_data_list.push(iconid);//アイコンのid
            this_data_list.push(subject_list.length); //行数
            this_data_list.push(property_list.length); //列数
            this_data_list.push(latNum); //緯度の前からの位置(データ属性を除く)
            this_data_list.push(lngNum); //経度の前からの位置(データ属性を除く)

            //Guardar los datos en el arreglo
            for (var i = 0; i < subject_list.length; i++) {
                var this_objects = data[subject_list[i]];
                var this_subject_list = Object.keys(data[subject_list[i]]);
                var this_object_list = [];

                for (var j = 0; j < this_subject_list.length; j++) {
                    this_object_list.push(this_objects[this_subject_list[j]][0].value);
                }

                this_data_list.push(this_object_list);
            };

            var clinicas =[];

            //Generamos la lista de clinicas para el mapa
            for (var j = 4; j < this_data_list.length; j++){

                //Creamos el marcador con la data obtenida
                var clinica = {
                    position: new google.maps.LatLng(Number(this_data_list[j][2]), Number(this_data_list[j][3])),
                    type: 'kitakami',
                    title: this_data_list[j][0],
                    description: this_data_list[j][1]
                }

                //Agregamos al arreglo de Marcadores
                clinicas.push(clinica);
            }

            //Ahora si, a cargarlas en el mapa
            for (var k = 0, feature; feature = clinicas[k]; k++) {
                addMarkerInfoWindow(feature,map);
            }

        }
    });
}

function shortenProperty(thisProperty) {
    return (thisProperty.split("#")[thisProperty.split("#").length - 1])
}

//Funcion para hacer aparecer y desaparecer los marcadores
function Markers(type){
    var newValue = document.getElementById(type).checked;
    activeInfoWindow.close();

    for (var i=0;i<allMarkersData.length;i++) {
        if (allMarkersData[i].type==type)  {
            if (newValue==0) {
                allMarkersData[i].setVisible(false);
            }
            else {
                allMarkersData[i].setVisible(true);

            }
        }
    }

}