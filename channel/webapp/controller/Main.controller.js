//테이블에 접근할 전역변수 선언
let oTable1;
let oTable2;

sap.ui.define(
  [
		'sap/ui/core/routing/Router',
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/UIComponent"
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (UIComponent, Router, Controller, Fliter, FilterOperator) {
    "use strict";

    return Controller.extend("chn.channel.controller.Main", {
      onInit: function () {
        //아이디로 테이블에 접근해서 테이블 변수 생성
        oTable1 = this.byId("header");

        alert({EmpId});
        this.getRouterInfo().getRoute("mainView").attachPatternMatched(this._onRouteMatched, this);


        // var oRouter = sap.ui.core.UIComponet.getRouterFor(this);
        // oRouter.getRoute("mainView").attachPatternMatched(this._onRouteMatched, this);

      },

      _onRouteMatched: function (oEvent){
        var oData = oEvent;
        // var empid = oEvent.getParameter("arguments").EmpId;
        // var emppw = oEvent.getParameter("arguments").EmspPw;

        // this.getView().bindElement({
        //   path: "/" + oEvent.getParameter("arguments").mainPath,
        //   model: "oModel"
        // })
      }
    });
  }
);
