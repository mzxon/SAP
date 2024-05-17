//테이블에 접근할 전역변수 선언
let oTable1;
let oArgs;
let Empid;
let Emppw;

sap.ui.define(
  [
    "sap/ui/core/routing/Router",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/UIComponent",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (UIComponent, Router, Controller, Fliter, FilterOperator) {
    "use strict";

    return Controller.extend("chn.channel.controller.Main", {
      onInit: function () {
        var oRouter = this.getRouter();

        oRouter.getRoute("mainView").attachMatched(_onRouteMatched(), this);
      },

      onPress: function () {
        alert(Empid);
      },

      _onRouteMatched: function (oEvent) {
        var oModel = this.getView().getModel();

        Empid = oEvent.getParameter("arguments").EmpId;
        Emppw = oEvent.getParameter("arguments").EmpPw;

        alert(Empid);

        oModel.metadataLoaded().then(function () {
          var sPath = oModel.createKey("/MainView", {
            Custid: Empid,
            Custpw: Emppw,
          });

          // sPath should be something like "/Invoices(CustomerName='Troll',OrderID=12345)"
          that.getView().bindElement({ path: sPath });
        });
      },
    });
  }
);
