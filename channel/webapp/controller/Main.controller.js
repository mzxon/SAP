sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Element",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/library",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    Element,
    JSONModel,
    Device,
    Filter,
    FilterOperator,
    mobileLibrary,
    MessageToast
  ) {
    "use strict";

    let oEmpno;
    let oChlno;
    let oModcd;
    let oTable;

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.DialogType
    var DialogType = mobileLibrary.DialogType;

    return Controller.extend("chn.channel.controller.Main", {
      onInit: function () {
        //mainView(routes name)의 라우터에 연결
        this._getRouter()
          .getRoute("mainView")
          .attachPatternMatched(this._onRouteMatched.bind(this), this);

        //뷰에 데이터 세팅해줌
        var oModel = new JSONModel(
          sap.ui.require.toUrl("chn/channel/model/data.json")
        );
        this.getView().setModel(oModel, "Data");

        //미디어에 따라 화면 너비
        Device.media.attachHandler(this._handleMediaChange, this);
        this._handleMediaChange();

        oTable = this.byId("Ch_item");
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
          }.bind(this),
          error: function (response) {
            MessageToast.show("Error");
          },
        });
      },

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
        this.initializeMap();
      },

      //지도 초기화
      initializeMap: function () {
        var mapOptions = {
          center: { lat: 37.5452752, lng: 127.0408373 },
          zoom: 16,
        };

        var mapElement = document.getElementById(
          this.getView().byId("map").getId()
        );
        var map = new google.maps.Map(mapElement, mapOptions);
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
