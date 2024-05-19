sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/Router",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast, UIComponent, Router, Fliter, FilterOperator, JSONModel, Device) {
    "use strict";

    let oEmpno;
    let otable;

    return Controller.extend("chn.channel.controller.Main", {
      onInit: function () {
        //mainView(routes name)의 라우터에 연결
        this._getRouter().getRoute("mainView").attachPatternMatched(this._onRouteMatched.bind(this), this);
     
        //뷰에 데이터 세팅해줌
			  var oModel = new JSONModel(sap.ui.require.toUrl("sync4/channel/webapp/model/data.json"));
			  this.getView().setModel(oModel);

			  //미디어에 따라 화면 너비
			  Device.media.attachHandler(this._handleMediaChange, this);
			  this._handleMediaChange();
      },
      
      //라우터 연결정보 가져오기
      _getRouter:function () {
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
            debugger;
            oJsonModel.setData(response);
            this.getView().setModel(oJsonModel, "Ch_Model");
          }.bind(this),
          error: function (response) {
            // MessageToast.show("Error");
            debugger;
          },
        })
      },

      //툴바 아이템 선택 함수
		  onItemSelect: function (oEvent) {
		  	//oEvent의 "item"의 파라미터값을 가져옴
		  	var oItem = oEvent.getParameter("item");
		  	//튤바 선택했을때 (id:pageContainer)NavContainer에 oItem의 키로 접근해서 해당하는 아이디의 내용을 넣음 (data.json에 저장된 key)
		  	this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
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
            MessageToast.show("Screen width is corresponding to Large Desktop");
            break;

          //태블릿
          // Tablet - Landscape
          case "Desktop":
            this.byId("productName").setVisible(true);
            this.byId("secondTitle").setVisible(false);
            this.byId("searchField").setVisible(true);
            this.byId("spacer").setVisible(true);
            this.byId("searchButton").setVisible(false);
            MessageToast.show("Screen width is corresponding to Desktop");
            break;

          // Tablet - Portrait
          case "Tablet":
            this.byId("productName").setVisible(true);
            this.byId("secondTitle").setVisible(true);
            this.byId("searchButton").setVisible(true);
            this.byId("searchField").setVisible(false);
            this.byId("spacer").setVisible(false);
            MessageToast.show("Screen width is corresponding to Tablet");
            break;

          //폰
          case "Phone":
            this.byId("searchButton").setVisible(true);
            this.byId("searchField").setVisible(false);
            this.byId("spacer").setVisible(false);
            this.byId("productName").setVisible(false);
            this.byId("secondTitle").setVisible(false);
            MessageToast.show("Screen width is corresponding to Phone");
            break;
          default:
            break;
        }
      },

      onExit: function() {
        Device.media.detachHandler(this._handleMediaChange, this);
      },

    });
  }
);
