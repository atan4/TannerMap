var map=L.map('mapid').setView([39, 10], 2);

CustomMarker = L.Marker.extend({
   options: { 
       id: null,
       presenter: null,
       year: null,
       major: null,
       org: null,
       title: null,
       description: null
   }
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZWxsYWNoYW8iLCJhIjoiY2l0ZWZmNTFpMDVhZzJubzljOG0ycGpidCJ9.sa_wMdArcKfBrdv3wGLM2g', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'ellachao.1f9gjea9',
    accessToken: 'pk.eyJ1IjoiZWxsYWNoYW8iLCJhIjoiY2l0ZWZmNTFpMDVhZzJubzljOG0ycGpidCJ9.sa_wMdArcKfBrdv3wGLM2g'
}).addTo(map);

var clusters=L.markerClusterGroup();

function showBox(e){
    $('#details').html(
//        'Tanner ID: '+this['options']['id']+'<br>'+
        this['options']['presenter']+'<br>'+
        'Class Year: '+this['options']['year']+'<br>'+
	'Major(s): '+this['options']['major']+'<br>'+
//	'The name of the organization where the primary presenter interned or were affiliated with: '+this['options']['org']
    'Presentation Title: ' + this['options']['title']
    );
}

$.getJSON('tanner.json', function(data){
    $.each(data,function(i,obj){
        if (!obj.hasOwnProperty('Additional Presenters')){
            var window=obj['Primary presenter']+ ', ' 
            + obj['Class Year'] + ', ' + obj['Majors'] + 
              
                '<br>Title: ' + obj['Title of Presentation'] + '<br>Description: ' + obj['Final Abstract'].substr(0,150) + '...';
            var marker=new CustomMarker([obj['location']['lat'],obj['location']['lng']],{
                id: obj['Tanner ID'], 
                presenter: obj['Primary presenter'],
                year: obj['Class Year'],
		major: obj['Majors'],
		org: obj['The name of the organization where the primary presenter interned or were affiliated with'],
        title: obj['Title of Presentation']
            }).bindPopup(window).on('mouseover', showBox);
            clusters.addLayer(marker);
        }
        else{
            for (i in obj['Additional Presenters']){
                var window='Presenter Info: '+obj['Additional Presenters'][i]['Presenter Info']+'<br>Organization: '+
                    obj['Additional Presenters'][i]['Organization'];
                var marker=L.marker(
                    [obj['Additional Presenters'][i]['location']['lat'],obj['Additional Presenters'][i]['location']['lng']]
                ).bindPopup(window);
                clusters.addLayer(marker);
            }
        }
           
    })
})

map.addLayer(clusters);

