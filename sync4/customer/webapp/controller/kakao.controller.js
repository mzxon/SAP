// sap.ui.define(
//   ["sap/ui/core/mvc/Controller", "sap/ui/core/HTML"],
//   function (Controller, HTML) {
//     "use strict";

//     return Controller.extend("cust.customer.controller.kakao", {
//       onInit: function () {
//         // Kakao 지도를 표시할 HTML 요소 생성
//         var html = new sap.ui.core.HTML({
//           content: '<div id="map" style="width:100%;height:400px;"></div>',
//           preferDOM: false, // DOM 대신 HTML 컨트롤 내부에 HTML을 삽입
//           afterRendering: function () {
//             this.initMap();
//           }.bind(this), // 지도 초기화 함수를 렌더링 후 실행
//         });

//         // 이전에 추가된 컨트롤을 제거하고 새로운 HTML 컨트롤 추가
//         var mapContainer = this.getView().byId("mapContainer");
//         mapContainer.destroyItems();
//         mapContainer.addItem(html);
//       },

//       initMap: function () {
//         // Kakao 지도 객체 생성
//         var map = new kakao.maps.Map(document.getElementById("map"), {
//           center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 시청을 중심으로 지도 생성
//           level: 5, // 지도 확대 레벨 설정
//         });
//       },
//     });
//   }
// );
