sap.ui.define(
  ["sap/m/MessageToast", "sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (MessageToast, Controller) {
    "use strict";

    return Controller.extend("sync4.c1.fioriedu11.controller.ChartView", {
      onInit: function () {},

      onSelectionChanged: function (oEvent) {
        var oSegment = oEvent.getParameter("segment");
        MessageToast.show(
          "The selection changed: " +
            oSegment.getLabel() +
            " " +
            (oSegment.getSelected() ? "selected" : "not selected")
        );
      },
    });
  }
);
