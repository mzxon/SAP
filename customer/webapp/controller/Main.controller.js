sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/ActionSheet",
    "sap/m/Button",
    "sap/m/library",
    "sap/ui/core/syncStyleClass",
    "sap/ndc/BarcodeScanner",
    "sap/m/MessageBox",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    JSONModel,
    MessageToast,
    ActionSheet,
    Button,
    mobileLibrary,
    syncStyleClass,
    BarcodeScanner,
    MessageBox
  ) {
    "use strict";

    let oCustno;
    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    return Controller.extend("cust.customer.controller.Main", {
      onInit: function () {
        this._getRouter()
          .getRoute("mainView")
          .attachPatternMatched(this._onRouteMatched.bind(this), this);

        // this._getChannel();
      },

      //스캔팝업
      onScanPress: function (oEvent) {
        var that = this;
        BarcodeScanner.scan(
          function (mResult) {
            if (!mResult.cancelled) {
              that._getRouter().navTo("paymentView", {
                Custno: oCustno,
                Serno: mResult.text,
              });
            }
          },
          function (Error) {
            alert("Scanning failed:" + Error);
          }
        );
      },

      //라우터 연결정보 가져오기
      _getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },

      _onRouteMatched: function (oEvent) {
        let oModel = this.getOwnerComponent().getModel();
        let oJsonModel = new sap.ui.model.json.JSONModel();
        // var oRen = this.byId("ren");
        // var oIng = this.byId("ing");

        // console.log(oRen.getVisible());

        //empno 받아오기
        oCustno = oEvent.getParameter("arguments").Custno;

        //조회해서 JsonModel에 넣어서 View에서 사용하기
        oModel.read("/RentalSet('" + oCustno + "')", {
          success: function (response) {
            oJsonModel.setData(response);
            this.getView().setModel(oJsonModel, "Ren_list");

            this._getChannel();

            console.log(response);

            // if (response.Renst == "L") {
            //   oRen.setVisible(false);
            //   oIng.setVisible(true);
            // } else {
            //   oRen.setVisible(true);
            //   oIng.setVisible(false);
            // }
          }.bind(this),
          error: function (response) {
            // oRen.setVisible(true);
            // oIng.setVisible(false);
          },
        });
      },

      //대리점 정보
      _getChannel: function () {
        let oModel = this.getOwnerComponent().getModel();
        let oJsonModel = new sap.ui.model.json.JSONModel();

        var data = [];

        //조회해서 JsonModel에 넣어서 View에서 사용하기
        oModel.read("/ChannelSet", {
          success: function (response) {
            oJsonModel.setData(response);
            data = response.results || [];
            this.initializeMap(data);
          }.bind(this),
          error: function (response) {
            MessageToast.show("Error");
          },
        });
      },

      // 지도 초기화
      initializeMap: function (data) {
        var that = this;
        var geocoder = new google.maps.Geocoder();

        // 경도 위도 저장 배열
        var mapData = [];

        // 현재 위치 핀
        function getCurrentPosition() {
          return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            } else {
              reject("Geolocation is not supported by this browser.");
            }
          });
        }

        // 현재 위치 정보 설정
        function showPosition(position) {
          mapData.push({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            icon: "image/itsme.png",
            name: "",
            cnt: 0,
          });
        }

        // 대리점 위치 가져오기
        async function processAddresses(data) {
          for (let i = 0; i < data.length; i++) {
            var address = data[i].Chladdr;
            try {
              const results = await geocodeAddress(address);
              mapData.push({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
                icon: "image/bike.png",
                name: data[i].Chlname,
                cnt: data[i].Quant,
              });
            } catch (error) {
              alert(
                "Geocode was not successful for the following reason: " + error
              );
            }
          }
        }

        // 주소 지오코딩
        async function geocodeAddress(address) {
          return new Promise((resolve, reject) => {
            geocoder.geocode({ address: address }, (results, status) => {
              if (status === "OK") {
                resolve(results);
              } else {
                console.error(
                  "Geocode failed for address:",
                  address,
                  "with status:",
                  status
                );
                reject(status);
              }
            });
          });
        }

        // 현재 위치와 대리점 위치 처리
        getCurrentPosition()
          .then((position) => {
            showPosition(position);
            return processAddresses(data);
          })
          .then(() => {
            this._creatMap(mapData);
          })
          .catch((error) => {
            console.error(error);
          });
      },

      _creatMap: function (mapData) {
        const styledMapType = new google.maps.StyledMapType([
          {
            featureType: "poi",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
          },
        ]);

        var mapOptions = {
          center: { lat: mapData[0].lat, lng: mapData[0].lng },
          zoom: 12,
        };

        var mapElement = document.getElementById(
          this.getView().byId("map").getId()
        );

        var map = new google.maps.Map(mapElement, mapOptions);

        map.mapTypes.set("styled_map", styledMapType);
        map.setMapTypeId("styled_map");

        for (let i = 0; i < mapData.length; i++) {
          var markerIcon = new google.maps.MarkerImage(
            mapData[i].icon,
            null,
            null,
            null,
            new google.maps.Size(33, 33)
          );

          // 새로운 마커 생성
          var marker = new google.maps.Marker({
            position: { lat: mapData[i].lat, lng: mapData[i].lng },
            map: map, // 마커를 지도에 추가
            title: mapData[i].name, // 마커에 표시할 툴팁
            icon: markerIcon,
          });

          if (i > 0) {
            var stockLabel = new google.maps.Marker({
              position: { lat: mapData[i].lat + 0.008, lng: mapData[i].lng },
              label: {
                text: mapData[i].cnt.toString(), // 대리점 재고 수량
                fontSize: "12px", // 텍스트 크기
                fontWeight: "bold", // 텍스트 굵기
                color: "black", // 텍스트 색상
                backgroundColor: "white", // 배경색
                borderRadius: "5px", // 테두리 반경
                padding: "5px", // 내부 여백
                textAlign: "center", // 텍스트 정렬
              },
              map: map, // 지도에 추가
              zIndex: 3000, // marker보다 위에 표시
            });
          }
        }
      },

      _logout: function () {
        sap.ui.core.UIComponent.getRouterFor(this).navTo("loginView");
        MessageToast.show("로그아웃 되었습니다.");
      },

      onKaoPress: function () {
        window.location.href = "http://pf.kakao.com/_VZZxkG/chat";
      },
    });
  }
);
