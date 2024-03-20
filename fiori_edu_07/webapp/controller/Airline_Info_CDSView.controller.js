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

    return Controller.extend(
      "sync4.c1.fioriedu07.controller.Airline_Info_CDSView",
      {
        onInit: function () {
          oTable = this.byId("Airline");
        },

        onSearch: function () {
          let oBinding = oTable.getBinding("rows"),
            lv_input = "",
            oFilter = null,
            aFilters = [];

          lv_input = this.byId("Search").getValue();

          //검색어 입력했을 경우 => filter검색 -> property로 조건검사
          if (lv_input != "") {
            oFilter = new Filter({
              path: "Carrid", //Gateway에서 설정한 Property 명
              operator: FilterOperator.Contains, // *& 검색 : 앞뒤 붙어서 감
              value1: lv_input, // select-options-low
              //value2 : select-options-high
            });

            aFilters.push(oFilter); //배열에 입력
          }

          //Get_EntitySet 메소드 호출
          oBinding.filter(aFilters); //AirlineSet?$filter=Carrid eq 'AA'
        },
      }
    );
  }
);
