var map;
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
    document.getElementById('cafe-name').textContent = cafe.name;
    document.getElementById('cafe-message').textContent = cafe.message;
    document.getElementById('cafe-address').textContent = cafe.address;
    document.getElementById('cafe-hours').textContent = cafe.hours;
    document.getElementById('cafe-price').textContent = cafe.price;
    var videoElement = document.getElementById('cafe-video');
    var videoSource = document.getElementById('cafe-video-source');
    videoSource.src = cafe.video;
    videoElement.load();

    var seatingInfo = document.getElementById('seating-info');
    seatingInfo.innerHTML = '';
    cafe.seating.forEach(function(seat) {
        var row = document.createElement('tr');
        var typeCell = document.createElement('td');
        var totalCell = document.createElement('td');
        var powerCell = document.createElement('td');

        typeCell.textContent = seat.type;
        totalCell.textContent = seat.total;
        powerCell.textContent = seat.withPower;

        row.appendChild(typeCell);
        row.appendChild(totalCell);
        row.appendChild(powerCell);

        seatingInfo.appendChild(row);
    });

    map.setCenter(cafe.position);

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

document.addEventListener("DOMContentLoaded", function() {
    var container = document.getElementById('map');
    var options = {
        center: new kakao.maps.LatLng(37.58823, 126.9936),
        level: 3
    };

    map = new kakao.maps.Map(container, options);

    var markers = [];

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
        content.innerHTML = '<span style="font-family: Noto Sans KR; font-weight: 900;">' + cafe.name + '</span>' + cafe.hours;

        var marker = new kakao.maps.CustomOverlay({
            map: map,
            position: cafe.position,
            content: content,
            yAnchor: 1
        });

        markers.push(marker);

        content.addEventListener('click', function() {
            expandSidebar();
            showCafeDetails(cafe);
        });
    });

    function searchCafes() {
        var query = document.getElementById('search').value.toLowerCase();
        var filteredCafes = cafes.filter(function(cafe) {
            return cafe.name.toLowerCase().includes(query);
        });

        var resultsList = document.getElementById('results-list');
        resultsList.innerHTML = '';
        if (filteredCafes.length > 0) {
            document.getElementById('search-results').style.display = 'block';
            filteredCafes.forEach(function(cafe) {
                var listItem = document.createElement('li');
                listItem.textContent = cafe.name;
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