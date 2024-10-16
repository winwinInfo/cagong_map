// 전역 변수로 선언
let map;
let userLocationMarker;
var markers = [];
var cafes = [];

var schoolCoordinates = {
   "성균관대": new kakao.maps.LatLng(37.5872, 126.9919),
   "경희대": new kakao.maps.LatLng(37.5955, 127.0526),
   "한국외대": new kakao.maps.LatLng(37.5972, 127.0590),
   "연세대": new kakao.maps.LatLng(37.56641, 126.9387),
   "이화여대": new kakao.maps.LatLng(37.561758, 126.946708),
   "서강대": new kakao.maps.LatLng(37.550917, 126.941011),
   "홍대": new kakao.maps.LatLng(37.55074, 126.9255)
};

var SKKUSpot = {
    "경영관": {
        position: new kakao.maps.LatLng(37.588518, 126.992662),
        floors: [
            {
                name:"지하 1층(원형극장 앞)",
                image:"경영관지하1층(원형극장 앞).png",
                seats: [
                    { type: "1인석", total: 33, power: 33},
                    { type: "3인석", total: 2, power: 0}
                ]
            },
            {
                name:"지하 1층(학부열람실 앞)",
                image:"경영관지하1층(학부열람실 앞).png",
                seats: [
                    { type: "3인석", total: 3, power: 0},
                    { type: "4인석", total: 1, power: 1},
                    { type: "5인석", total: 2, power: 2},
                    { type: "6인석", total: 1, power: 1},
                ]
            },
            {
                name:"1층",
                image:"경영관1층.png",
                seats: [
                    { type: "1인석", total: 3, power: 0},
                    { type: "2인석", total: 2, power: 0},
                    { type: "4인석", total: 3, power: 0},
                ]
            },
            {
                name:"1층",
                image:"경영관1층(커리어부스).png",
                seats: [
                    { type: "4인석", total: 10, power: 10},
                ]
            },     
            {
                name:"2층",
                image:"경영관2층.png",
                seats: [
                    { type: "1인석", total: 10, power: 10},
                    { type: "3인석", total: 2, power: 0},
                    { type: "4인석", total: 10, power: 10},
                ]
            },            
        ]
    },
    "국제관": {
        position: new kakao.maps.LatLng(37.586898, 126.995215),
        floors:[
            {
                name: "로비층",
                image: "국제관로비층.png",
                seats: [
                    { type: "1인석", total: 6, power: 6},
                    { type: "4인석", total: 3, power: 0},
                ]                
            },            
            {
                name: "1층(학생성공라운지)",
                image: "국제관1층(학생성공라운지).png",
                seats: [
                    { type: "1인석", total: 10, power: 4},
                    { type: "4인석", total: 2, power: 2},
                    { type: "5인석", total: 1, power: 1},
                    { type: "9인석", total: 1, power: 0},
                ]                
            },
            {
                name: "1층(라운지)",
                image: "국제관1층(라운지).png",
                seats: [
                    { type: "2인석", total: 4, power: 0},
                    { type: "4인석", total: 11, power: 4},
                    { type: "5인석", total: 1, power: 0},
                    { type: "8인석", total: 2, power: 2},
                ]                
            },
            {
                name: "지하 2층",
                image: "국제관지하 2층.png",
                seats: [
                    { type: "1인석", total: 14, power: 10},
                    { type: "2인석", total: 1, power: 0},
                    { type: "4인석", total: 5, power: 1},
                    { type: "6인석", total: 6, power: 0},
                ]                
            },            
            {
                name: "지하 3층",
                image: "국제관지하 3층.png",
                seats: [
                    { type: "1인석", total: 7, power: 7},
                    { type: "2인석", total: 6, power: 0},
                    { type: "6인석", total: 3, power: 12},
                    { type: "10인석", total: 1, power: 8},
                ]                
            },            
        ]
    },
    "인문관": {
        position: new kakao.maps.LatLng(37.588832, 126.991827),
        floors: [
            {
                name: "2층(1)",
                image: "인문관2층(1).png",
                seats: [
                    { type: "1인석", total: 33, power: 25}
                ]
            },
            {
                name: "2층(2)",
                image: "인문관2층(2).png",
                seats: [
                    { type: "1인석", total: 33, power: 25}
                ]
            },
            {
                name: "3층",
                image: "인문관3층.png",
                seats: [
                    { type: "1인석", total: 13, power: 12}
                ]
            },   
            {
                name: "6층",
                image: "인문관6층.png",
                seats: [
                    { type: "1인석", total: 6, power: 4}
                ]
            },                        
            {
                name: "7층",
                image: "인문관7층.png",
                seats: [
                    { type: "1인석", total: 10, power: 10}
                ]
            },                        
        ]
    },
    "학생회관": {
        position: new kakao.maps.LatLng(37.587519, 126.993294),
        floors: [
            {
                name: "학생회관 라운지",
                image: "학생회관.png",
                seats: [
                    { type: "좌석", total: 88, power: 88}
                ]
            }
        ]
    },
    "교수회관": new kakao.maps.LatLng(37.588550, 126.993222),
}

//성대 카공스팟 표시하기 
function showSKKUSpotDetails(name, spot) {
    // 카페 정보 숨기기
    document.getElementById('cafe-info').classList.add('hidden');
    
    // 건물 정보 표시
    var buildingInfo = document.getElementById('building-info');
    buildingInfo.classList.remove('hidden');
    
    // building-info 내용 초기화
    buildingInfo.innerHTML = '';

    // 건물 정보 내용 생성
    var content = document.createElement('div');
    content.className = 'building-content';
    content.innerHTML = `<h2 class="building-title">${name}</h2>`;

    if (spot.floors && Array.isArray(spot.floors)) {
        spot.floors.forEach(floor => {
            content.innerHTML += `
                <div class="floor-info">
                    <h3 class="floor-title">${floor.name}</h3>
                    <img src="${floor.image}" alt="${name} ${floor.name}" class="floor-image">
                    <table class="seating-info">
                        <thead>
                            <tr>
                                <th>좌석 유형</th>
                                <th>총 좌석</th>
                                <th>콘센트 이용 가능</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${floor.seats.map(seat => `
                                <tr>
                                    <td>${seat.type}</td>
                                    <td>${seat.total}자리</td>
                                    <td>${seat.power}자리</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        });
    } else {
        content.innerHTML += '<p class="no-info">해당 건물의 상세 정보가 없습니다.</p>';
    }

    // 생성한 내용을 building-info에 추가
    buildingInfo.appendChild(content);

    // 사이드바 표시
    document.getElementById('sidebar').classList.add('expanded');
}


function createSKKUOverlay(name, spot) {
    var content = document.createElement('div');
    content.className = 'skku-spot-label';
    content.innerHTML = name;
    content.style.cssText = 'background: white; padding: 5px; border-radius: 5px; border: 1px solid #ccc; cursor: pointer;';

    var overlay = new kakao.maps.CustomOverlay({
        map: map,
        position: spot.position,
        content: content,
        yAnchor: 1.1
    });

    content.addEventListener('click', function() {
        showSKKUSpotDetails(name, spot);
    });

    return overlay;
}

function initializeSKKUSpots() {
    for (var name in SKKUSpot) {
        if (SKKUSpot[name].position) {  // position 속성이 있는 경우에만 처리
            var overlay = createSKKUOverlay(name, SKKUSpot[name]);
            // 필요하다면 생성된 오버레이를 저장할 배열을 만들어 추가할 수 있습니다.
            // 예: skkuOverlays.push(overlay);
        }
    }
}

// 사이드바 초기화 함수
function clearSidebar() {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar) {
        console.error('Sidebar element not found');
        return;
    }

    // 사이드바 내용 초기화
    sidebar.innerHTML = '<div id="sidebar-content"></div>';

    // 사이드바 확장 상태 초기화 (필요한 경우)
    sidebar.classList.remove('expanded');
}


function expandSidebar() {
   document.getElementById('sidebar').classList.add('expanded');
}

function replaceNewlines(text) {
    return text? text.replace(/\\n/g, '<br>') : '';
}

function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    var activeFilters = document.getElementById('active-filters');
    var cafeInfo = document.getElementById('cafe-info');

    if (cafeInfo.classList.contains('hidden')) {
        sidebar.classList.toggle('expanded');
        if (sidebar.classList.contains('expanded')) {
            activeFilters.style.top = sidebar.offsetHeight + 'px';
        } else {
            activeFilters.style.top = '174px';
        }
    } else {
        cafeInfo.classList.add('hidden');
        sidebar.classList.remove('expanded');
        activeFilters.style.top = '174px';
    }
}
// 화면 크기 변경 시 필터 위치 조정
window.addEventListener('resize', function() {
    var sidebar = document.getElementById('sidebar');
    var activeFilters = document.getElementById('active-filters');
    if (window.innerWidth <= 768) {
        activeFilters.style.top = sidebar.offsetHeight + 'px';
    } else {
        activeFilters.style.top = sidebar.classList.contains('expanded') ? sidebar.offsetHeight + 'px' : '174px';
    }
});


//////////////// 길찾기 버튼 //////////////////
function startFinding() 
{
    console.log('clicked!');
    var cafeInfo = document.getElementById('cafe-info');
    if (cafeInfo.classList.contains('hidden')) {
        alert('먼저 카페를 선택해주세요.');
        return;
    }

    var cafeId = cafeInfo.getAttribute('data-cafe-id');
    if (!cafeId) {
        alert('카페 정보를 찾을 수 없습니다.');
        return;  
    }

    // 카카오맵 길찾기 URL 생성
    var kakaoMapUrl = `https://map.kakao.com/link/to/${cafeId}`;

    // 새 탭에서 카카오맵 길찾기 페이지 열기
    window.open(kakaoMapUrl, '_blank');
}

////////////////////////전역scope////////////////////

function showCafeDetails(cafe) {
    
    // 건물 정보 숨기기
    document.getElementById('building-info').classList.add('hidden');
    
    // 카페 정보 표시
    var cafeInfo = document.getElementById('cafe-info');
    cafeInfo.classList.remove('hidden');

    

    console.log("showCafeDetails called for:", cafe.Name);

    document.getElementById('cafe-info').classList.remove('hidden');
    document.getElementById('cafe-name').textContent = cafe.Name;
    document.getElementById('cafe-message').innerHTML = replaceNewlines(cafe.Message);
    document.getElementById('cafe-address').textContent = cafe.Address;
    document.getElementById('cafe-opening-hours').innerHTML = replaceNewlines(cafe['영업 시간']);

    var hoursDisplay = getHoursDisplay(cafe.Hours_weekday);
    if(cafe.Hours_weekday != cafe.Hours_weekend)
    {
        hoursDisplay = '평일 ' + getHoursDisplay(cafe.Hours_weekday) 
        + ', ' + '주말 ' + getHoursDisplay(cafe.Hours_weekend);
    }
    document.getElementById('cafe-hours').innerHTML = hoursDisplay;
    document.getElementById('cafe-price').textContent = cafe.Price;

    // ID를 데이터 속성으로 저장
    document.getElementById('cafe-info').setAttribute('data-cafe-id', cafe.ID);

    // 비디오 처리
    var videoContainer = document.getElementById('cafe-video-container');
    if (videoContainer) {
        videoContainer.innerHTML = ''; // 기존 내용 초기화
        if (cafe['Video URL'] && cafe['Video URL'].trim() !== '') {
            if (cafe['Video URL'].includes('youtube.com/shorts/')) {
                var videoId = cafe['Video URL'].split('youtube.com/shorts/')[1];
                var iframeElement = document.createElement('iframe');
                iframeElement.src = `https://www.youtube.com/embed/${videoId}`;
                iframeElement.width = '100%';
                iframeElement.height = '100%';
                iframeElement.frameborder = '0';
                iframeElement.allowfullscreen = true;
                videoContainer.appendChild(iframeElement);
            } else {
                var videoElement = document.createElement('video');
                videoElement.controls = true;
                videoElement.style.width = '100%';
                var sourceElement = document.createElement('source');
                sourceElement.src = cafe['Video URL'];
                sourceElement.type = 'video/mp4';
                videoElement.appendChild(sourceElement);
                videoContainer.appendChild(videoElement);
            }
        } else {
            // 영상이 없는 경우 대체 텍스트 표시
            var textElement = document.createElement('p');
            textElement.textContent = '영상 준비 중입니다.';
            textElement.style.textAlign = 'center';
            textElement.style.padding = '20px';
            textElement.style.backgroundColor = '#f0f0f0';
            textElement.style.color = '#666';
            videoContainer.appendChild(textElement);
        }
    }

    // 쿠폰 처리
    var couponContainer = document.getElementById('coupon-container');
    if (couponContainer) {
        couponContainer.innerHTML = ''; // 컨테이너 내용 초기화
        couponContainer.style.display = 'none'; // 기본적으로 숨김

        console.log("Co-work value:", cafe['Co-work']);

        if (cafe['Co-work'] === 1 || cafe['Co-work'] === '1') {
            console.log("Attempting to display coupon for:", cafe.Name);
            var couponImg = new Image();
            couponImg.src = `${cafe.Name}쿠폰.png?t=${new Date().getTime()}`; // 캐시 방지
            couponImg.alt = `${cafe.Name} 쿠폰`;
            couponImg.style.width = '100%';
            couponImg.style.marginTop = '10px';
            
            couponImg.onload = function() {
                console.log("Coupon image loaded successfully for:", cafe.Name);
                couponContainer.appendChild(couponImg);
                couponContainer.style.display = 'block';
            };

            couponImg.onerror = function() {
                console.log("Error loading coupon image for:", cafe.Name);
                couponContainer.innerHTML = `${cafe.Name}의 쿠폰 이미지를 불러올 수 없습니다.`;
                couponContainer.style.display = 'block';
            };
        } else {
            console.log("No coupon for:", cafe.Name);
        }
    }

    // 좌석 정보 처리
    var seatingInfo = document.getElementById('seating-info');
    if (seatingInfo) {
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
    }

/////   
    // var sidebar = document.getElementById('sidebar');
    // if (sidebar) {
    //     sidebar.classList.add('expanded');
    // } 

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

function getHoursDisplay(hours) { //스프레드시트 값(json 파일의 값)을 표시할 문자로 바꾸는 함수
    if (hours === -1) return '무제한';
    if (hours === 0) return '권장X';
    return hours + '시간';
}

function fetchCafesFromJson(url = 'cafe_info.json') {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            cafes = data;

            cafes.forEach(function(cafe) {
                var content = document.createElement('div');
                content.className = 'cafe-marker-label';

                var weekdayHours = getHoursDisplay(cafe.Hours_weekday);
                var weekendHours = getHoursDisplay(cafe.Hours_weekend);
                
                if(weekdayHours === weekendHours){
                    content.innerHTML = '<span class="cafe-name">' + cafe.Name + '</span><br>'
                     + weekdayHours        
                }

                else{
                    content.innerHTML = '<span class="cafe-name">' + cafe.Name + '</span><br>' + 
                    '평일 ' + weekdayHours + '<br>' +
                    '주말 ' + weekendHours;
                }
                
                if (cafe['Co-work'] === 1 || cafe['Co-work'] === '1') {
                    content.classList.add('co-work');
                }

                var customOverlay = new kakao.maps.CustomOverlay({
                    map: map,
                    position: new kakao.maps.LatLng(cafe['Position (Latitude)'], cafe['Position (Longitude)']),
                    content: content,
                    yAnchor: 1.1
                });

                markers.push(customOverlay);

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


//필터
function toggleFilterPopup() {
    var popup = document.getElementById('filter-popup');
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
}

// 현재 활성화된 필터를 저장하는 객체
let activeFilters = {};

    // 필터를 적용하는 함수
    function applyFilter() {
    // 사용자가 선택한 필터 값들을 가져옵니다
    var selectedHours = document.getElementById('hours-filter').value;
    var maxPrice = parseInt(document.getElementById('price-max').value) || Infinity;
    var minPowerSeats = parseInt(document.getElementById('power-seats').value) || 0;

    // 활성화된 필터를 객체에 저장합니다
    // 'all'이나 기본값인 경우 null로 설정하여 필터가 적용되지 않았음을 나타냅니다
    activeFilters = {
        hours: selectedHours !== 'all' ? selectedHours : null,
        price: maxPrice !== Infinity ? maxPrice : null,
        powerSeats: minPowerSeats !== 0 ? minPowerSeats : null
    };

    // 현재 요일을 확인합니다 (0: 일요일, 1-5: 평일, 6: 토요일)
    var now = new Date();
    var currentDay = now.getDay();
    var isWeekend = currentDay === 0 || currentDay === 6;

    // 필터 조건에 맞는 카페만 선별합니다
    filteredCafes = cafes.filter(function(cafe) {
        var cafeHours = isWeekend ? getHoursDisplay(cafe.Hours_weekend) : getHoursDisplay(cafe.Hours_weekday); //요일에 따라 값 달라짐
        var hoursMatch = selectedHours === 'all' || checkHours(cafeHours, selectedHours);
        var cafePrice = parseInt(cafe.Price.replace(/[^0-9]/g, ''));
        var priceMatch = cafePrice <= maxPrice;
        var powerSeatsMatch = calculateTotalPowerSeats(cafe) >= minPowerSeats;
        
        return hoursMatch && priceMatch && powerSeatsMatch;
    });

    // 필터링된 결과에 따라 지도의 마커를 업데이트합니다
    updateMarkers();
    // 활성화된 필터를 화면에 표시합니다
    updateActiveFilters();
    // 필터 팝업을 닫습니다
    toggleFilterPopup(); //-> 이거 호출 때문에 필터 해제할 때마다 필터 창 뜸?
}

// 활성화된 필터를 화면에 표시하는 함수
function updateActiveFilters() {
    const filterContainer = document.getElementById('active-filters');
    // 기존에 표시된 필터를 모두 제거합니다
    filterContainer.innerHTML = '';
    let hasFilters = false;

    // 각 활성화된 필터에 대해 태그를 생성하고 추가합니다
    Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) {
            hasFilters = true;
            const tag = document.createElement('div');
            tag.className = 'filter-tag';
            tag.innerHTML = `
                ${getFilterLabel(key, value)}
                <button onclick="removeFilter('${key}')">&times;</button>
            `;
            filterContainer.appendChild(tag);
        }
    });

    if(hasFilters){
        filterContainer.classList.add('has-filters');
    }
    else {
        filterContainer.classList.remove('has-filter');
    }
}

// 필터 라벨을 생성하는 함수
function getFilterLabel(key, value) {
    switch(key) {
        case 'hours':
            return `이용시간: ${value} 이상`;
        case 'price':
            return `가격: ${value}원 이하`;
        case 'powerSeats':
            return `콘센트: ${value}개 이상`;
        default:
            return '';
    }
}

// 특정 필터를 제거하는 함수
function removeFilter(key) {
    // 해당 필터를 비활성화 상태로 설정합니다
    activeFilters[key] = null;
    
    // 해당 필터의 입력 필드를 초기화합니다
    switch(key) {
        case 'hours':
            document.getElementById('hours-filter').value = 'all';
            break;
        case 'price':
            document.getElementById('price-max').value = '';
            break;
        case 'powerSeats':
            document.getElementById('power-seats').value = '';
            break;
    }
    
    // 사용자가 선택한 필터 값들을 가져옵니다
    var selectedHours = document.getElementById('hours-filter').value;
    var maxPrice = parseInt(document.getElementById('price-max').value) || Infinity;
    var minPowerSeats = parseInt(document.getElementById('power-seats').value) || 0;

    // 활성화된 필터를 객체에 저장합니다
    // 'all'이나 기본값인 경우 null로 설정하여 필터가 적용되지 않았음을 나타냅니다
    activeFilters = {
        hours: selectedHours !== 'all' ? selectedHours : null,
        price: maxPrice !== Infinity ? maxPrice : null,
        powerSeats: minPowerSeats !== 0 ? minPowerSeats : null
    };

    // 현재 요일을 확인합니다 (0: 일요일, 1-5: 평일, 6: 토요일)
    var now = new Date();
    var currentDay = now.getDay();
    var isWeekend = currentDay === 0 || currentDay === 6;

    // 필터 조건에 맞는 카페만 선별합니다
    filteredCafes = cafes.filter(function(cafe) {
        var cafeHours = isWeekend ? getHoursDisplay(cafe.Hours_weekend) : getHoursDisplay(cafe.Hours_weekday); //요일에 따라 값 달라짐
        var hoursMatch = selectedHours === 'all' || checkHours(cafeHours, selectedHours);
        var cafePrice = parseInt(cafe.Price.replace(/[^0-9]/g, ''));
        var priceMatch = cafePrice <= maxPrice;
        var powerSeatsMatch = calculateTotalPowerSeats(cafe) >= minPowerSeats;
        
        return hoursMatch && priceMatch && powerSeatsMatch;
    });

    // 필터링된 결과에 따라 지도의 마커를 업데이트합니다
    updateMarkers();
    // 활성화된 필터를 화면에 표시합니다
    updateActiveFilters();
}

// 페이지 로드 시 필터 적용 버튼에 이벤트 리스너를 추가합니다
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('apply-filter').addEventListener('click', applyFilter);
});


function checkHours(cafeHours, selectedHours) {
    // '무제한' 카페는 항상 true 반환
    if (cafeHours.includes('무제한')) {
        return true;
    }
    
    // 사용자가 '무제한'을 선택한 경우
    if (selectedHours === '무제한') {
        return cafeHours.includes('무제한');
    }
    
    var hours = parseInt(selectedHours);
    var cafeHoursNum = parseInt(cafeHours) || 0;
    
    // 카페 시간이 숫자가 아닌 경우 (예: "24시간")
    if (isNaN(cafeHoursNum)) {
        return true; // 24시간 영업으로 간주하고 표시
    }
    
    return cafeHoursNum >= hours;
}

function parsePrice(priceString) {
    return parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
}

function calculateTotalPowerSeats(cafe) {
    var total = 0;
    for (var i = 1; i <= 5; i++) {
        if (cafe[`Power Count ${i}`]) {
            total += parseInt(cafe[`Power Count ${i}`]);
        }
    }
    return total;
}

function updateMarkers() {
    markers.forEach(function(marker) {
        marker.setMap(null);
    });

    filteredCafes.forEach(function(cafe) {
        var index = cafes.indexOf(cafe);
        if (index !== -1) {
            markers[index].setMap(map);
        }
    });
}



document.addEventListener("DOMContentLoaded", function() {
    var container = document.getElementById('map');
    var defaultPosition = new kakao.maps.LatLng(37.58823, 126.9936);
    var options = {
        center: defaultPosition,
        level: 3
    };

    document.getElementById('apply-filter').addEventListener('click', applyFilter);
    map = new kakao.maps.Map(container, options);
    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
    if (navigator.geolocation) {
        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도

            var locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

            // 지도 중심을 변경합니다
            map.setCenter(locPosition);

            // 마커를 생성합니다
            updateUserLocation(position);

        }, function(error) {
            // GeoLocation 허용하지 않았거나 지원하지 않는 경우 Default 위치를 중심으로 합니다
            console.log('Geolocation error: ' + error.message);
            map.setCenter(defaultPosition);
        }, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
    } else {
        // HTML5의 GeoLocation을 사용할 수 없을 때 Default 위치를 중심으로 합니다
        map.setCenter(defaultPosition);
    }


    fetchCafesFromJson();

    initializeSKKUSpots();


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

   //길찾기 버튼에 함수 달기
    var finderButton = document.getElementById('finder');
    if(finderButton)
    {
        finderButton.addEventListener('click', startFinding);
    }

    // 위치 추적 초기화
    initializeLocationTracking();

    // '현위치' 버튼에 이벤트 리스너 추가
    var locateButton = document.getElementById('locate-button');
    if (locateButton) {
        locateButton.addEventListener('click', moveToCurrentLocation);
    } else {
        console.log("'현위치' 버튼을 찾을 수 없습니다.");
    }

});

//////////////////////current location///////////////////////////////

    function initializeLocationTracking() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(updateUserLocation, handleLocationError, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            console.log("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
            //alert("이 브라우저에서는 위치 서비스가 지원되지 않습니다.");
        }
    }

// 전역 변수로 선언
let userLocationOverlay;

function updateUserLocation(position) {
    var lat = position.coords.latitude,
        lon = position.coords.longitude;
    
    var locPosition = new kakao.maps.LatLng(lat, lon);

    // 현위치 마커 이미지 설정
    var markerSize = 20;
    var markerImage = createCircleMarkerImage('#FF0000', markerSize);

    // CustomOverlay 콘텐츠 생성
    var content = document.createElement('div');
    content.className = 'user-location-marker';
    content.style.width = markerSize + 'px';
    content.style.height = markerSize + 'px';
    content.style.backgroundImage = `url(${markerImage})`;
    content.style.backgroundSize = 'cover';

    // 기존 오버레이가 있다면 제거
    if (userLocationOverlay) {
        userLocationOverlay.setMap(null);
    }

    // 새 CustomOverlay 생성
    userLocationOverlay = new kakao.maps.CustomOverlay({
        map: map,
        position: locPosition,
        content: content,
        zIndex: 9999 // 높은 z-index 값 설정
    });

    // 맵 중심 이동 (필요한 경우)
    // map.setCenter(locPosition);
}

function createCircleMarkerImage(color, size) {
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    
    // 외곽선 추가
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    return canvas.toDataURL();
}

function initializeLocationTracking() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(updateUserLocation, handleLocationError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        console.log("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
    }
}

function moveToCurrentLocation() {
    if (userLocationOverlay) {
        map.setCenter(userLocationOverlay.getPosition());
    } else {
        console.log("현재 위치를 확인할 수 없습니다.");
    }
}

function handleLocationError(error) {
    let errorMessage;
    switch(error.code) {
        case error.PERMISSION_DENIED:
            //errorMessage = "사용자가 위치 정보 제공을 거부했습니다.";
            break;
        case error.POSITION_UNAVAILABLE:
            //errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
        case error.TIMEOUT:
            //errorMessage = "위치 정보 요청이 시간 초과되었습니다.";
            break;
        case error.UNKNOWN_ERROR:
            //errorMessage = "알 수 없는 오류가 발생했습니다.";
            break;
    }        
    console.warn(`ERROR(${error.code}): ${errorMessage}`);
}

