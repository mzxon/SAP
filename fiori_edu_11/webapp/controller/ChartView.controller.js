sap.ui.define(
  [
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (MessageToast, Controller, JSONModel) {
    "use strict";

    return Controller.extend("sync4.c1.fioriedu11.controller.ChartView", {
      onInit: function () {
        let oData = {
          gs_data: {
            value1: 20,
            value2: 20,
            value3: 60,
          },

          gs_data2: {
            value1: 80,
            value2: 15,
            value3: 5,
          },
        };

        let oData2 = {
          gs_output: {
            value1: 50,
            value2: 50,
          },

          gs_output2: {
            value1: 30,
            value2: 15,
            value3: 55,
          },

          gs_output3: {
            value1: 30.2,
            value2: 15.1,
            value3: 55.9,
            value4: 23.1,
            value5: 57.42,
            value6: 90.1,
          },
        };

        let oModel = new JSONModel(oData);
        let oModel2 = new JSONModel(oData2);

        this.getView().setModel(oModel);
        this.getView().setModel(oModel2, "m2");
      },

      onSelectionChanged: function (oEvent) {
        var oSegment = oEvent.getParameter("segment");
        //segment를 던져주면서 ? InteractiveDonutChartSegement API를 쓰게 됨
        //=> segment api의 method(getselected 등)을 쓸수있음
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
