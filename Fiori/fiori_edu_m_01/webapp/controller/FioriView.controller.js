let oTable;

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("sync4.c1.fioriedum01.controller.FioriView", {
      onInit: function () {
        oTable = this.byId("ScarrList");
      },

      //검색
      onSearch: function () {
        let oBinding = oTable.getBinding("rows"),
          oFilter = null,
          aFilters = [],
          carrid = "",
          connid = "";

        carrid = this.byId("input_carr").getValue();
        connid = this.byId("input_conn").getValue();

        //검색어 입력했을 경우 => filter검색 -> property로 조건검사
        if (carrid != "") {
          oFilter = new Filter({
            path: "Carrid", //Gateway에서 설정한 Property 명
            operator: FilterOperator.Contains, // *& 검색 : 앞뒤 붙어서 감
            value1: carrid,
          });

          aFilters.push(oFilter); //배열에 입력
        }

        oFilter = null;

        if (connid != "") {
          oFilter = new Filter({
            path: "Connid", //Gateway에서 설정한 Property 명
            operator: FilterOperator.Contains, // *& 검색 : 앞뒤 붙어서 감
            value1: connid,
          });

          aFilters.push(oFilter); //배열에 입력
        }

        //Get_EntitySet 메소드 호출
        oBinding.filter(aFilters);
      },
    });
  }
);
