sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/Router",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast, UIComponent, Router, Fliter, FilterOperator) {
    "use strict";

    let oEmpno;
    let otable;

    return Controller.extend("chn.channel.controller.Main", {
      onInit: function () {
        //mainView(routes name)의 라우터에 연결
        this._getRouter().getRoute("mainView").attachPatternMatched(this._onRouteMatched.bind(this), this);
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

    });
  }
);
