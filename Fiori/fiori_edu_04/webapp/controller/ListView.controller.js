sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel) {
    "use strict";

    let oModel;

    return Controller.extend("sync4.c1.fioriedu04.controller.ListView", {
      onInit: function () {
        let oData = {
          scarrSet: [
            {
              Carrid: "AA",
              Carrname: "American Airlines",
              Currcode: "USD",
              Country: "US",
              Url: "http://www.aa.com",
            },
            {
              Carrid: "AB",
              Carrname: "Air Belin",
              Currcode: "EUR",
              Country: "BE",
              Url: "http://www.airbelin.com",
            },
            {
              Carrid: "AC",
              Carrname: "Air Canada",
              Currcode: "USD",
              Country: "CA",
              Url: "http://www.aircanada.com",
            },
            {
              Carrid: "DL",
              Carrname: "Delta Airlines",
              Currcode: "CAD",
              Country: "DE",
              Url: "http://www.airdelta.com",
            },
            {
              Carrid: "KA",
              Carrname: "Koera Air",
              Currcode: "KRW",
              Country: "KO",
              Url: "http://www.koreanair.com",
            },
          ],
        };

        oModel = new JSONModel(oData);

        //현재 뷰에 모델(데이터) 적용 (데이터 사용가능)
        this.getView().setModel(oModel);
      },
    });
  }
);
