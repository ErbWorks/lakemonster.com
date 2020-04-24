
     $(document).ready(function() {
 console.log("tring video");
 
  var newposter = 'https://lakemonster.sfo2.digitaloceanspaces.com/3/2_18.jpg';

  var videourl = 'https://video.lakemon.com/videos/1_1.m3u8'; // set the url to your video file here
  var videocontainer = '#video-card'; // set the ID of the container that you want to insert the video in
    var parameter = new Date().getMilliseconds();  //  generate variable based on current date/time
    
    var video = '<video width="1102" height="720" id="intro-video" autoplay loop src="' + videourl + '?t=' + parameter + '"></video>'; // setup the video element

    $(videocontainer).append(video)
  ; // insert the video element into its container
    
    videl = $(document).find('#intro-video')[0]; // find the newly inserterd video
            
    videl.load(); // load the video (it will autoplay because we've set it as a parameter of the video)
});
      // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      var map, infoWindow;
      var lat = 41.11;
      var lng = -111.11;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.397, lng: -111.644},
          zoom: 6,
          scrollwheel:true,
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
                        lat = position.coords.latitude;
            lng = position.coords.longitude;
            console.log("Found Pos: " + lat + " , " + lng);
           
            map.setCenter(pos);
            load_list_items();
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
            load_list_items();
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
          load_list_items();
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
      
      //***************
      //Details Map
      //***************
      
      var details_map, details_infoWindow;
  
      function initDetailsMap(lat, lng, zoom) {
          console.log('zoom = ' + zoom);
        if(zoom < 1) {zoom=11;};
        
        details_map = new google.maps.Map(document.getElementById('details-map'), {
          center: {lat: parseFloat(lat), lng: parseFloat(lng)},
          zoom: parseInt(zoom)
        });
        details_infoWindow = new google.maps.InfoWindow;
        
         //var pos = { lat: lat, lng: lng };
            
        //details_map.setCenter(pos);
           
      }
    </script>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDWcUypmqDDpjzmdB0lpRNW6PGRivBpZkg&callback=initMap">
    </script>
<script>

//*****************************
//*****************************

// Create a request variable and assign a new XMLHttpRequest object to it.

var map_request = new XMLHttpRequest()

function get_site(siteid){

    var site_request = new XMLHttpRequest();
  var url = 'https://vps.lakemon.com/api2.5/get.php?action=bySiteid&siteid=' + siteid;
  console.log(url);
  site_request.open('GET', url, true);
  
  site_request.onload = function () {
    const image_cdn = "https://vps.lakemon.com/cdn/lakeimg/";
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
        var lake = data[0];
    
    if (site_request.status >= 200 && site_request.status < 400) {
        console.log(lake.details.name);
      
       initDetailsMap(lake.details.lat, lake.details.lon, lake.details.mapZoom);;
       
         $('#details-col')
            .find('#details-lake-name').text(lake.details.name)
            .addBack()
            .find('#details-water').text(lake.details.waterTemp + " F")
            .addBack()
            .find('#details-air').text(lake.details.airTemp + " F")
            .addBack()
            .find('#details-wind').text(parseInt(lake.details.windSpeed))
            .addBack()
            .find('#details-windGust').text(parseInt(lake.details.avgWindGust))
           .addBack()
            .find('#details-low').text(parseInt(lake.details.lowTemp))
              .addBack()
            .find('#details-high').text(parseInt(lake.details.highTemp));
      
      //Hide Video Card template
      //$('#card').css("display", "none");
      //Clear Video Cards
      $( "#video-container" ).empty();
      //get all cameras
      lake.cameras.forEach(cam => {
        console.log("adding Camera " + cam.id + " = " + cam.url);
       
       var video = $('<video />', {
          id: 'video1',
          class: "video-card1",
          poster: "",
          src: cam.url,
          type: 'video/mp4',
          controls: true,
          playsinline: true,
          autoplay: true,
          muted: true,
          loop:true, 
      });
      //'https://lakemonster.sfo2.cdn.digitaloceanspaces.com/3/2_16_1584412576.mp4'
      video.appendTo($('#video-container'));
 
       // $('#video-card')
       //       .clone()
       //     .attr('id', 'video_'+cam.id ) 
       //     .css('background-image', 'url(' + image_cdn + lake.imgUrl + ')')
       //     .css("display", "block")
       //     .appendTo("#video-container")
       //     .find('#video-card-video').attr('src', cam.url).get(0).load().play();
            
         });//end video-card 
          //$('#video-card-video').attr('src', 'https://lakemonster.sfo2.digitaloceanspaces.com/3/2_16.mp4');
    } // End request status
    }
  site_request.send();
}


// Open a new connection, using the GET request on the URL endpoint


map_request.open('GET', 'https://vps.lakemon.com/api2.5/get.php?action=get_all_lakes', true)

map_request.onload = function () {
    var map_data = JSON.parse(this.response)

    if (map_request.status >= 200 && map_request.status < 400) {
        map_data.forEach(lake => {
                   
                   wtemp = parseInt(lake.waterTemp);
          if (wtemp == 0){wtemp="~";}
          if (isNaN(wtemp)){wtemp="~";}
          myLatLng = {lat: parseFloat(lake.lat), lng: parseFloat(lake.lon)};
          marker = new google.maps.Marker({
            map: map,
            position: myLatLng,
            animation: google.maps.Animation.DROP,
            label: ''+wtemp,
            title: lake.name
                    });
            //
          
        })
    } else {
        console.log('map_response error');
    }
}

map_request.send();

</script>

<script>
//Infinite Scroll
var list_offset=0;
var list_limit = 20;
$(document).ready(function () {
        $("#Cards-Container").scroll(function () {
            var $this = $(this);
            var height = this.scrollHeight - $this.height(); // Get the height of the div
            var scroll = $this.scrollTop(); // Get the vertical scroll position

            var isScrolledToEnd = (scroll >= height);

            //console.log(".scroll-pos " + scroll);
            //console.log(".scroll-height " + height);

            if (isScrolledToEnd) {
                //var additionalContent = GetMoreContent(); // Get the additional content
                            console.error("IS SCROLL TO END Load More");
              load_list_items();
                //$this.append(additionalContent); // Append the additional content

            }
        });
    });

function load_list_items(){
    console.error('FUNCTIN LOAD MORE');
  
  var url = 'https://vps.lakemon.com/api2.5/get.php?action=get_lakes&lat=' + lat +'&lng=' + lng + "&limit=" + list_limit + "&offset=" + list_offset;;
  console.log(url);
  
  console.log("old offset " + list_offset);
  list_offset = list_limit + list_offset;
  console.log("new offset " + list_offset);
  
  var list_request = new XMLHttpRequest();
    list_request.open('GET', url, true)

    list_request.onload = function () {
    const image_cdn = "https://vps.lakemon.com/cdn/lakeimg/";
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)

    if (list_request.status >= 200 && list_request.status < 400) {
      data.forEach(lake => {
   
               wtemp = parseInt(lake.waterTemp);
        if (wtemp == 0){wtemp="~";}
        if (isNaN(wtemp)){wtemp="~";}
               //console.log(lake.siteid + " - " + lake.waterTemp);
               $('#card').css("display", "none");
        
        $('#card')
              .clone()
            .attr('id', 'card_'+lake.siteid ) 
            .css('background-image', 'url(' + image_cdn + lake.imgUrl + ')')
            .css("display", "block")
            .appendTo("#Cards-Container")
            .find('#card-title').text(lake.name)
            .addBack()
            .find('#card-distance-span').text(lake.distance)
            .addBack()
            .find('#water').text(""+wtemp)
            .addBack()
            .find('#air').text(lake.airTemp)
            .addBack()
            .find('#wind').text(parseInt(lake.windSpeed))
            .addBack()
            .find('#windGust').text(parseInt(lake.avgWindGust))
            .addBack()
            .find('#low-high').text("L: " + parseInt(lake.lowTemp) + 
                                                            "F H: " + parseInt(lake.highTemp) )
            .addBack()
                       .click(function() { 
                        get_site(lake.siteid);
                 
                  });
        
        })
    } else {
        console.log('error')
    }
    }
  list_request.send();
}

load_list_items();

