//테이블에 접근할 전역변수 선언
let oTable1;
let oTable2;

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Fliter, FilterOperator) {
    "use strict";

    return Controller.extend("chn.channel.controller.Main", {
      onInit: function () {
        //아이디로 테이블에 접근해서 테이블 변수 생성
        oTable1 = this.byId("header");
      },
    });
  }
);
