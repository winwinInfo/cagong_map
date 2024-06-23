var map;
var markers = [];
var cafes = [];

var schoolCoordinates = {
   "성균관대": new kakao.maps.LatLng(37.5872, 126.9919),
   "경희대": new kakao.maps.LatLng(37.5955, 127.0526),
   "한국외대": new kakao.maps.LatLng(37.5972, 127.0590)
};

function expandSidebar() {
   document.getElementById('sidebar').classList.add('expanded');
}

function toggleSidebar() {
   document.getElementById('sidebar').classList.toggle('expanded');
}

function showCafeDetails(cafe) {
   document.getElementById('cafe-info').classList.remove('hidden');
   document.getElementById('cafe-name').textContent = cafe.Name;
   document.getElementById('cafe-message').textContent = cafe.Message;
   document.getElementById('cafe-address').textContent = cafe.Address;
   document.getElementById('cafe-opening-hours').textContent = cafe['영업 시간'];
   document.getElementById('cafe-hours').textContent = cafe.Hours;
   document.getElementById('cafe-price').textContent = cafe.Price;
   var videoElement = document.getElementById('cafe-video');
   var videoSource = document.getElementById('cafe-video-source');
   videoSource.src = cafe['Video URL'];
   videoElement.load();

   var seatingInfo = document.getElementById('seating-info');
   seatingInfo.innerHTML = '';
   for (var i = 1; i <= 5; i++) {
       if (cafe[`Seating Type ${i}`]) {
           var row = document.createElement('tr');
           var typeCell = document.createElement('td');
           var totalCell = document.createElement('td');
           var powerCell = document.createElement('td');

           typeCell.textContent = cafe[`Seating Type ${i}`];
           totalCell.textContent = cafe[`Seating Count ${i}`];
           powerCell.textContent = cafe[`Power Count ${i}`];

           row.appendChild(typeCell);
           row.appendChild(totalCell);
           row.appendChild(powerCell);

           seatingInfo.appendChild(row);
       }
   }

   map.setCenter(new kakao.maps.LatLng(cafe['Position (Latitude)'], cafe['Position (Longitude)']));

   document.getElementById('cafe-info').scrollIntoView({ behavior: 'smooth' });
}

function moveToSchool() {
   var selectedSchool = document.getElementById('school-select').value;
   if (selectedSchool && schoolCoordinates[selectedSchool]) {
       map.setCenter(schoolCoordinates[selectedSchool]);
   }
}

function addSchoolMarkers() {
   var select = document.getElementById('school-select');
   for (var i = 1; i < select.options.length; i++) {
       var option = select.options[i];
       var schoolName = option.value;
       var message = option.getAttribute('data-message');
       var link = option.getAttribute('data-link');

       if (schoolCoordinates[schoolName]) {
           var content = document.createElement('div');
           content.style.display = 'flex';
           content.style.flexDirection = 'column';
           content.style.justifyContent = 'center';
           content.style.alignItems = 'center';
           content.style.padding = '5px';
           content.style.background = 'white';
           content.style.border = '1px solid black';
           content.style.borderRadius = '5px';
           content.style.cursor = 'pointer';
           content.style.fontFamily = 'Noto Sans KR, sans-serif';
           content.style.fontSize = '14px';
           content.innerHTML = '<span style="font-family: Noto Sans KR; font-weight: 900;">' + schoolName + '</span>' + message;

           var marker = new kakao.maps.CustomOverlay({
               map: map,
               position: schoolCoordinates[schoolName],
               content: content,
               yAnchor: 1
           });

           content.addEventListener('click', (function(link) {
               return function() {
                   window.location.href = link;
               };
           })(link));
       }
   }
}

function fetchCafesFromJson(url = 'cafe_info.json') {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            cafes = data;

            cafes.forEach(function(cafe) {
                var content = document.createElement('div');
                content.style.display = 'flex';
                content.style.flexDirection = 'column';
                content.style.justifyContent = 'center';
                content.style.alignItems = 'center';
                content.style.padding = '5px';
                content.style.background = 'white';
                content.style.border = '1px solid black';
                content.style.borderRadius = '5px';
                content.style.cursor = 'pointer';
                content.style.fontFamily = 'Noto Sans KR, sans-serif';
                content.style.fontSize = '14px';
                content.innerHTML = '<span style="font-family: Noto Sans KR; font-weight: 900;">' + cafe.Name + '</span>' + cafe.Hours;

                var marker = new kakao.maps.CustomOverlay({
                    map: map,
                    position: new kakao.maps.LatLng(cafe['Position (Latitude)'], cafe['Position (Longitude)']),
                    content: content,
                    yAnchor: 1
                });

                markers.push(marker);

                content.addEventListener('click', function() {
                    expandSidebar();
                    showCafeDetails(cafe);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching cafe data from JSON:', error);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    var container = document.getElementById('map');
    var options = {
        center: new kakao.maps.LatLng(37.58823, 126.9936),
        level: 3
    };

    map = new kakao.maps.Map(container, options);

    fetchCafesFromJson();

   var xlsxInput = document.createElement('input');
   xlsxInput.type = 'file';
   xlsxInput.accept = '.xlsx';
   xlsxInput.style.display = 'none';
   document.body.appendChild(xlsxInput);

   xlsxInput.addEventListener('change', function(e) {
       var file = e.target.files[0];
       fetchCafesFromXlsx(file);
   });

   xlsxInput.click();

   function searchCafes() {
       var query = document.getElementById('search').value.toLowerCase();
       var filteredCafes = cafes.filter(function(cafe) {
           return cafe.Name.toLowerCase().includes(query);
       });

       var resultsList = document.getElementById('results-list');
       resultsList.innerHTML = '';
       if (filteredCafes.length > 0) {
           document.getElementById('search-results').style.display = 'block';
           filteredCafes.forEach(function(cafe) {
               var listItem = document.createElement('li');
               listItem.textContent = cafe.Name;
               listItem.addEventListener('click', function() {
                   document.getElementById('search-results').style.display = 'none';
                   expandSidebar();
                   showCafeDetails(cafe);
                   var marker = markers[cafes.indexOf(cafe)];
                   kakao.maps.event.trigger(marker.a, 'click');
               });
               resultsList.appendChild(listItem);
           });
       } else {
           document.getElementById('search-results').style.display = 'none';
       }
   }

   document.getElementById('search-button').addEventListener('click', searchCafes);
   document.getElementById('search').addEventListener('keydown', function(e) {
       if (e.key === 'Enter') {
           searchCafes();
       }
   });

   // 학교 마커 추가
   addSchoolMarkers();
});