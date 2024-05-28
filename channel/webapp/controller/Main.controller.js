sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/library",
    "sap/m/MessageToast",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/ndc/BarcodeScanner",
    "sap/m/MessageBox",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    JSONModel,
    Device,
    Filter,
    FilterOperator,
    mobileLibrary,
    MessageToast,
    FlattenedDataset,
    FeedItem,
    BarcodeScanner,
    MessageBox
  ) {
    "use strict";

    let oEmpno;
    let oChlno;
    let oModcd;
    let oTable;
    let cYear;
    let oBinding;

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.DialogType
    var DialogType = mobileLibrary.DialogType;

    return Controller.extend("chn.channel.controller.Main", {
      onInit: function () {
        //툴바관련 데이터 정의
        var oModel_page1 = new JSONModel(
          sap.ui.require.toUrl("chn/channel/model/data.json")
        );
        this.getView().setModel(oModel_page1, "Data"); //entityset이 기본세팅이라 새로 만든 모델은 별명 붙여줘야 안겹침

        oTable = this.byId("Ch_item");

        //데이트피커관련
        var today = new Date(); //오늘 날짜 가져오기
        cYear = today.getFullYear();
        var oEndDatePicker = this.byId("endate");
        oEndDatePicker.setMaxDate(today); // DatePicker의 maxDate 설정

        //디바이스에 따른 화면 너비 조정
        Device.media.attachHandler(this._handleMediaChange, this);
        this._handleMediaChange();

        oBinding = this.getView().byId("ren_table").getBinding("rows");
      },

      onScan: function (oEvent) {
        var that = this;
        BarcodeScanner.scan(
          function (mResult) {
            if (!mResult.cancelled) {
              that.getView().byId("number").setValue(mResult.text);
              MessageBox.show(
                "We got a QR code\n" +
                  "Result: " +
                  mResult.text +
                  "\n" +
                  "Format: " +
                  mResult.format +
                  " \n"
              );
            }
          },
          function (Error) {
            alert("Scanning failed:" + Error);
          }
        );
      },

      //테이블 바인딩(Ch_item)
      _getTable: function () {
        let oTable = this.byId("Ch_item");
        let oBinding = oTable.getBinding("rows"),
          oFilter = null,
          aFilters = [];

        if (!oBinding) {
          console.error("Binding not found on the table");
          return;
        }

        oFilter = new Filter({
          path: "Chlno",
          operator: FilterOperator.EQ,
          value1: oChlno,
        });
        aFilters.push(oFilter);
        oBinding.filter(aFilters);
      },

      //지도 렌더링
      onAfterRendering: function () {
        //라우터관련
        this._getRouter()
          .getRoute("mainView")
          .attachPatternMatched(this._onRouteMatched.bind(this), this);
      },

      //라우터 연결정보 가져오기
      _getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },

      //전달받은 파라미터 값 가져와서 대리점 조회하기
      _onRouteMatched: function (oEvent) {
        let oModel = this.getOwnerComponent().getModel();
        let oJsonModel = new sap.ui.model.json.JSONModel();

        //empno 받아오기
        oEmpno = oEvent.getParameter("arguments").Empno;

        //조회해서 JsonModel에 넣어서 View에서 사용하기
        oModel.read("/Ch_headerSet('" + oEmpno + "')", {
          success: function (response) {
            oJsonModel.setData(response);
            this.getView().setModel(oJsonModel, "Ch_Model");
            oChlno = response.Chlno;
            this._getTable();
            this.initializeMap(response);
          }.bind(this),
          error: function (response) {
            MessageToast.show("Error");
          },
        });
      },

      //지도 초기화
      initializeMap: function (response) {
        var geocoder = new google.maps.Geocoder();
        var address = response.Chladdr;

        geocoder.geocode({ address: address }, (results, status) => {
          if (status === "OK") {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();

            this._creatMap(lat, lng, response);
          } else {
            alert(
              "Geocode was not successful for the following reason: " + status
            );
          }
        });
      },

      _creatMap: function (lat, lng, response) {
        var mapOptions = {
          center: { lat: lat, lng: lng },
          zoom: 16,
        };

        var mapElement = document.getElementById(
          this.getView().byId("map").getId()
        );

        var map = new google.maps.Map(mapElement, mapOptions);

        // 새로운 마커 생성
        var marker = new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: map, // 마커를 지도에 추가
          title: response.Chlname, // 마커에 표시할 툴팁
        });

        // 인포윈도우 생성
        var infowindow = new google.maps.InfoWindow({
          content: response.Chlname,
        });

        infowindow.open(map, marker); // 인포윈도우를 지도와 마커에 연결
      },

      //툴바 아이템 선택 함수
      onItemSelect: function (oEvent) {
        //oEvent의 "item"의 파라미터값을 가져옴
        var oItem = oEvent.getParameter("item");
        //튤바 선택했을때 (id:pageContainer)NavContainer에 oItem의 키로 접근해서 해당하는 아이디의 내용을 넣음 (data.json에 저장된 key)
        this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
      },

      //발주버튼 팝업
      onOrdStd: function () {
        if (!this.oSubmitDialog) {
          this.oSubmitDialog = new sap.m.Dialog({
            type: sap.m.DialogType.Message,
            title: "대리점 재고 발주",
            content: [
              new sap.m.VBox({
                items: [
                  new sap.m.ComboBox("In_modcd", {
                    items: [
                      new sap.ui.core.Item({
                        text: "부릉이 베이직",
                        key: "BEAL24",
                      }),
                      new sap.ui.core.Item({
                        text: "부릉이 울트라 맥스",
                        key: "BETT24",
                      }),
                    ],
                    placeholder: "제품을 선택하세요",
                  }),
                  new sap.m.Input({
                    maxLength: 10,
                    id: "In_qua",
                    liveChange: function (oEvent) {
                      var sText = oEvent.getParameter("value");
                      this.oSubmitDialog
                        .getBeginButton()
                        .setEnabled(sText.length > 0);
                    }.bind(this),
                  }),
                  // new sap.m.TextArea("submissionNote", {
                  //   width: "100%",
                  //   placeholder: "Add note (required)",
                  //   liveChange: function (oEvent) {
                  //     var sText = oEvent.getParameter("value");
                  //     this.oSubmitDialog
                  //       .getBeginButton()
                  //       .setEnabled(sText.length > 0);
                  //   }.bind(this),
                  // }),
                ],
              }),
            ],
            beginButton: new sap.m.Button({
              type: ButtonType.Emphasized,
              text: "발주",
              enabled: false,
              press: function () {
                var sModcd = sap.ui.getCore().byId("In_modcd").getSelectedKey();
                var sQuant = sap.ui.getCore().byId("In_qua").getValue();

                let oCrtData = {
                  Modcd: sModcd,
                  Chlno: oChlno,
                  Quant: sQuant,
                };

                // 모델 업데이트
                var oModel = this.getView().getModel();
                oModel.create(
                  "/Rental_reqSet",
                  oCrtData,
                  {
                    success: function () {
                      sap.m.MessageToast.show("발주되었습니다.");
                    },
                    error: function () {
                      sap.m.MessageToast.show("발주에 실패했습니다.");
                    },
                  },
                  oModel.refresh()
                );
                this.oSubmitDialog.close();
              }.bind(this),
            }),

            endButton: new sap.m.Button({
              text: "취소",
              press: function () {
                this.oSubmitDialog.close();
              }.bind(this),
            }),
          });
          this.getView().addDependent(this.oSubmitDialog);
        }
        this.oSubmitDialog.open();
      },

      //입고확정버튼
      onPutStd: function () {
        if (!this.oApproveDialog) {
          this.oApproveDialog = new sap.m.Dialog({
            type: sap.m.DialogType.Message,
            title: "입고확정",
            content: new sap.m.Text({ text: "입고확정 하시겠습니까?" }),
            beginButton: new sap.m.Button({
              type: ButtonType.Emphasized,
              text: "Submit",
              press: function () {
                let oTable_req = this.byId("req");
                let lv_tabix = oTable_req.getSelectedIndices();
                let oContext = [];
                let oData = null;
                let oModel = this.getView().getModel();

                if (lv_tabix == "") {
                  alert("행을 선택하세요");
                  this.oApproveDialog.close();
                }

                for (let index = 0; index < lv_tabix.length; index++) {
                  oContext = oTable_req.getContextByIndex(lv_tabix[index]);
                  oData = oContext.getObject();

                  let lv_reqno = oData.Reqno;
                  let lv_chlno = oData.Chlno;

                  let oUdaData = {
                    Reqno: oData.Reqno,
                    Modcd: oData.Modcd,
                    Chlno: oData.Chlno,
                    Quant: oData.Quant,
                    Unit: oData.Unit,
                    Status: oData.Status,
                    ReqDate: oData.ReqDate,
                    IssDate: oData.IssDate,
                    ArrDate: oData.ArrDate,
                  };

                  alert(oUdaData);
                  debugger;

                  oModel.update(
                    "/Rental_reqSet(Reqno='" +
                      lv_reqno +
                      "',Chlno='" +
                      lv_chlno +
                      "')",
                    oData,
                    {
                      success: function () {
                        sap.m.MessageToast.show("입고되었습니다.");
                      },
                      error: function () {
                        sap.m.MessageToast.show("입고에 실패했습니다.");
                      },
                    },
                    oModel.refresh()
                  );
                }
                this.oApproveDialog.close();
              }.bind(this),
            }),
            endButton: new sap.m.Button({
              text: "Cancel",
              press: function () {
                this.oApproveDialog.close();
              }.bind(this),
            }),
          });
        }

        this.oApproveDialog.open();
      },

      //검색버튼
      onSearch: function () {
        let oTable_req_list = this.byId("ren_table");
        oBinding = oTable_req_list.getBinding("rows");
        let oFilter = null,
          aFilters = [];

        let oRen_st = null;
        let stdate = this.byId("stdate").getValue().replace(/\./g, "");
        let endate = this.byId("endate").getValue().replace(/\./g, "");

        if (endate == "") {
          endate = "X";
        } else if (endate < stdate) {
          alert("종료날짜가 시작날짜보다 앞설 수 없습니다.");
        }

        var oRadioButtonGroup = this.getView().byId("radioButtonGroup");
        var sSelectedValue = oRadioButtonGroup.getSelectedButton().getText();

        switch (sSelectedValue) {
          case "이용중":
            oRen_st = "L";
            break;

          case "연체중":
            oRen_st = "O";
            break;

          default:
            break;
        }

        //라디오 버튼
        if (oRen_st != "") {
          oFilter = new Filter({
            path: "Renst",
            operator: FilterOperator.Contains,
            value1: oRen_st,
          });

          aFilters.push(oFilter);
        }

        oFilter = null;

        //앞날짜 선택
        if (stdate != "") {
          oFilter = new Filter({
            path: "Stdat",
            operator: FilterOperator.EQ,
            value1: stdate,
          });

          aFilters.push(oFilter);
        }

        oFilter = null;

        //뒷날짜 선택
        if (endate != "") {
          oFilter = new Filter({
            path: "Endat",
            operator: FilterOperator.EQ,
            value1: endate,
          });

          aFilters.push(oFilter);
        }

        //Get_EntitySet 메소드 호출
        oBinding.filter(aFilters);
      },

      onViewChange: function (event) {
        var viewMode = event.getSource().getText();
        console.log(viewMode);
        var table = this.getView().byId("ren_table"); // 테이블 ID
        var chart = this.getView().byId("ren_chart"); // 테이블 ID
        // var vBox = this.getView().byId("ren_vbox"); // VBox ID

        // vBox.removeAllItems(); // 기존 항목 제거

        if (viewMode === "table") {
          table.setVisible(true);
          chart.setVisible(false);
        } else if (viewMode === "chart") {
          // 테이블 숨기기
          table.setVisible(false);
          chart.setVisible(true);

          // 테이블 데이터 가져오기
          var oBinding = table.getBinding("rows"); // 테이블에 바인딩된 모델 가져오기

          // 테이블 데이터를 JSON 형식으로 변환
          var chartData = [];

          // 배열 초기화
          var cYear = new Date().getFullYear().toString();
          for (var i = 1; i <= 12; i++) {
            var month = i < 10 ? "0" + i : "" + i; // 한 자리 월을 두 자리 문자열로 변환
            chartData.push({ 월별: month, 거래금액: 0 });
          }

          if (oBinding) {
            oBinding.getContexts().forEach(function (oContext) {
              var rowData = oContext.getObject();
              var reqdate = rowData.Reqdat;
              if (reqdate.substring(0, 4) === cYear) {
                // 올해년도
                var month = reqdate.substring(5, 7); // 월 추출

                // 해당 월의 데이터를 차트 데이터에 추가
                chartData.forEach(function (data) {
                  if (data.월별 === month) {
                    data.거래금액 += parseInt(rowData.TotPrice, 10);
                  }
                });
              }
            });
          }

          var oModel = new sap.ui.model.json.JSONModel(chartData);

          var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [
              {
                name: "월별",
                value: "{월별}",
              },
            ],
            measures: [
              {
                name: "거래금액",
                value: "{거래금액}",
              },
            ],
            data: {
              path: "/",
            },
          });

          chart.removeAllFeeds();
          chart.setDataset(oDataset);
          chart.setModel(oModel);

          chart.addFeed(
            new FeedItem({
              uid: "categoryAxis",
              type: "Dimension",
              values: ["월별"],
            })
          );

          chart.addFeed(
            new FeedItem({
              uid: "valueAxis",
              type: "Measure",
              values: ["거래금액"],
            })
          );

          // VizFrame을 VBox에 추가
          // vBox.addItem(oVizFrame); // VBox에 VizFrame 추가

          // VizFrame이 VBox에 추가되었는지 확인
          // console.log("VizFrame added to VBox:", vBox.getItems());
        }
      },

      onGo: function (oEvent) {
        var type = oEvent.getSource().getText();
        let oTable = this.byId("Check");
        // alert(oTable);
        let lv_tabix = oTable.getSelectedIndices();

        let oContext = [];
        let oData = null;
        let oModel = this.getView().getModel();

        let cType;

        if (type == "정상") {
          cType = "O";
        } else if (type == "불량") {
          cType = "X";
        }

        if (lv_tabix == "") {
          alert("행을 선택하세요");
        }

        oContext = oTable.getContextByIndex(lv_tabix[0]);
        oData = oContext.getObject();

        let lv_chkno = oData.Chkno;

        let oUdaData = {
          Chkno: oData.Chkno,
          Serno: oData.Serno,
          Chlno: oChlno,
          Chkst: oData.Chkst,
          Chkdat: oData.Chkdat,
          Chkst: cType,
        };

        oModel.update(
          "/Rental_checkSet('" + lv_chkno + "')",
          oData,
          {
            success: function () {
              sap.m.MessageToast.show("정상처리되었습니다.");
            },
            error: function () {
              sap.m.MessageToast.show("검수에 실패했습니다.");
            },
          },
          oModel.refresh()
        );
      },

      //화면 변경시
      _handleMediaChange: function () {
        var rangeName = Device.media.getCurrentRange("StdExt").name;

        switch (rangeName) {
          //데스크탑
          // Shell Desktop
          case "LargeDesktop":
            this.byId("productName").setVisible(true);
            this.byId("secondTitle").setVisible(true);
            this.byId("searchField").setVisible(true);
            this.byId("spacer").setVisible(true);
            this.byId("searchButton").setVisible(false);
            break;

          //태블릿
          // Tablet - Landscape
          case "Desktop":
            this.byId("productName").setVisible(true);
            this.byId("secondTitle").setVisible(false);
            this.byId("searchField").setVisible(true);
            this.byId("spacer").setVisible(true);
            this.byId("searchButton").setVisible(false);
            break;

          // Tablet - Portrait
          case "Tablet":
            this.byId("productName").setVisible(true);
            this.byId("secondTitle").setVisible(true);
            this.byId("searchButton").setVisible(true);
            this.byId("searchField").setVisible(false);
            this.byId("spacer").setVisible(false);
            break;

          //폰
          case "Phone":
            this.byId("searchButton").setVisible(true);
            this.byId("searchField").setVisible(false);
            this.byId("spacer").setVisible(false);
            this.byId("productName").setVisible(false);
            this.byId("secondTitle").setVisible(false);
            break;
          default:
            break;
        }
      },

      onExit: function () {
        Device.media.detachHandler(this._handleMediaChange, this);
      },
    });
  }
);
