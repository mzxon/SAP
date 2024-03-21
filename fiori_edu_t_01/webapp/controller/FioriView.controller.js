sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("sync.c1.fioriedut01.controller.FioriView", {
      onInit: function () {
        var oData = {
          enabled: true,
        };

        // var oData = {
        //   //EntitySet이름적음
        //   scarrSet: [{}, {}],
        // };

        var oModel = new JSONModel(oData);

        this.getView().setModel(oModel);
      },

      onPress: function () {
        let txt = this.getView().byId("iptCarrier").getValue().toUpperCase();

        this.getView().byId("txtClear").setText(txt); //text태그니까 value가 아니라 setText로 넣어줘야함
      },
    });
  }
);
