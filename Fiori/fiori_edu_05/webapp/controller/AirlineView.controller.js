var oTable, oTable2;

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

    return Controller.extend("sync4.c1.fioriedu05.controller.AirlineView", {
      onInit: function () {
        oTable = this.byId("airlineTable");
        oTable2 = this.byId("airlineTable2");
      },

      onSearch: function () {
        //oBinding -> Gateway Client 역할
        //Update, Delete, Get_EntitySet을 수행키 위해서는 Entityset 이름이 필요하다
        // Grid에 체결된 Entityset 정보를 가지고 오기위해서 아래의 선언문 작성필요

        //Grid에 체결된 EntitySet 정보를 가져오기
        var oBinding = oTable.getBinding("rows"),
          lv_Carrid = "",
          oFilter = null,
          aFilters = [];
        //EntitySet 정보가 있는 속성 이름 (rows에 EntitySet이름이 들어있음)
        //Http uri가 Entityset + method로 구성되있는것처럼
        //gateway method를 사용하기 위해서 entityset을 맞춰줌

        //oModel 즉, Data 필요 -> 이미 onInit에서 정보를 가져옴
        //사용자가 입력한 검색어를 가져와야함 (Input에서 입력한 값)
        lv_Carrid = this.byId("Carrid").getValue();

        //검색어 입력했을 경우 => filter검색 -> property로 조건검사
        if (lv_Carrid != "") {
          oFilter = new Filter({
            path: "Carrid", //Gateway에서 설정한 Property 명
            operator: FilterOperator.Contains, // *& 검색 : 앞뒤 붙어서 감
            value1: lv_Carrid, // select-options-low
            //value2 : select-options-high
          });

          aFilters.push(oFilter); //배열에 입력
        }

        //Get_EntitySet 메소드 호출
        oBinding.filter(aFilters); //AirlineSet?$filter=Carrid eq 'AA'
      },
    });
  }
);
