/**
 * Created by Aurelio on 30/12/2016.
 */
$(document).ready(function () {

    //TODO: Primero, obtener el listado de clinicas del Open Data
    //TODO: Segundo, cargar una cierta cantidad de esas clinicas como marcadores en el Mapa, limitado por el zoom y coords
    //TODO: Tercero, cuando se haga click, mostrar la informacion y poner el link a una pagina de edicion de ese punto en el mapa
    //TODO: Cuarto, pagina de edicion y evaluacion de la clinica y institucion de salud
    alert("dentro del ready");
    //cargarClinicasv2();
});

//////////////////////////////
///// Variables globales /////
//////////////////////////////

var posicionInicial = {lat: 35.1547072, lng: 136.9613086};

//////////////////////////////

//Funcion que inicializa el mapa de Google Maps, aqui se podria poner que cargue los elementos del JSON o
//del repositorio de Open Data
function initMap() {
    var uluru = {lat: -25.363, lng: 131.044};

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
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
            type: 'info',
            title: 'Titulo 1',
            description: 'Descripcion 1'

        }, {
            position: new google.maps.LatLng(-33.91539, 151.22820),
            type: 'info',
            title: 'Titulo 2',
            description: 'Descripcion 2'
        }, {
            position: new google.maps.LatLng(-33.91747, 151.22912),
            type: 'info',
            title: 'Titulo 3',
            description: 'Descripcion 3'
        }
    ];

    for (var i = 0, feature; feature = features[i]; i++) {
        //addMarker(feature, map);
        addMarkerInfoWindow(feature,map);
    }

    //Centrar el mapa en el ultimo punto
    map.center(features[features.length-1]);

    //cargarClinicasv2();
}

function addMarker(feature, map) {

    var marker = new google.maps.Marker({
        position: feature.position,
        map: map
    });

}

function addMarkerInfoWindow(feature, mapa){

    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">'+ feature.title +'</h1>'+
        '<div id="bodyContent">'+
        '<p></p> ' +
        '<p>'  + feature.description +
        ' </p>' +
        '</div>'+
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: feature.position,
        map: mapa,
        title: feature.title
    });
    marker.addListener('click', function() {
        infowindow.open(mapa, marker);
    });

}

function cargarClinicas(){

    alert('Cargar clinicas');
    //var url = "http://linkdata.org/api/1/rdf1s4633i/herb_rdf.json";
    var url = "res/json/nagoyahospital_rdf.json";

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

function cargarClinicasv2(){

    var this_data_list = [];
    //var url = "res/json/nagoyahospital_rdf.json";
    var url = "http://linkdata.org/api/1/rdf1s268i/nagoyahospital_rdf.json?callback=?";
    //var url = "http://linkdata.org/api/1/rdf1s3965i/hospital_list_rdf.json?callback=?";
    alert(url);

    $.getJSON(url, function(data) {
        alert('Dentro del getJson');
        var subject_list = Object.keys(data);
        alert('Subject list: ' + subject_list);
        var property_list = Object.keys(data[subject_list[0]]);
        alert(property_list);
        var latNum = 0;
        var lngNum = 0;

        for (var p = 1; p < property_list.length; p++) { //1は連番だから無い

            var x = shortenProperty(property_list[p]);
            alert('Valor de X es ' + x);

            if (x == "lat" || x == "Lat" || x == "latitude" || x == "Latitude" || x == "緯度" ||
                    x.toLocaleLowerCase().includes("lat") ) {
                alert('Consiguio Latitud');
                latNum = p;
            }

            if (x == "lng" || x == "Lng" || x == "long" || x == "longitude" || x == "Longitude" || x == "経度") {
                alert('Consiguio Longitud');
                lngNum = p;
            }
        }

        if (latNum == 0 || lngNum == 0) {
            alert("No coordinates found");
        } else {
            this_data_list.push(iconid);//アイコンのid
            this_data_list.push(subject_list.length); //行数
            this_data_list.push(property_list.length); //列数
            this_data_list.push(latNum); //緯度の前からの位置(データ属性を除く)
            this_data_list.push(lngNum); //経度の前からの位置(データ属性を除く)

            //本データプッシュ
            for (var i = 0; i < subject_list.length; i++) {
                var this_objects = data[subject_list[i]];
                var this_subject_list = Object.keys(data[subject_list[i]]);
                var this_object_list = [];
                for (var j = 0; j < this_subject_list.length; j++) {
                    this_object_list.push(this_objects[this_subject_list[j]][0].value);
                }
                this_data_list.push(this_object_list);
            };
            //LSaddTo_loaddataname(dataname);
            //setLS(dataname, this_data_list);
            //toastopen(dataname + "を登録しました",2000);
            //ListHtml();
        }
    });
}

function shortenProperty(thisProperty) {
    return (thisProperty.split("#")[thisProperty.split("#").length - 1])
}