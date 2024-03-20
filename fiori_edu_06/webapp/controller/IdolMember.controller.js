let oTable, oModel;

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

    return Controller.extend("sync4.c1.fioriedu06.controller.IdolMember", {
      onInit: function () {
        oTable = this.byId("Idol");
        oModel = this.getView().getModel();
      },

      onSearch: function () {
        let oBinding = oTable.getBinding("rows"),
          lv_input = "",
          oFilter = null,
          aFilters = [];

        var a = "",
          b = "";

        lv_input = this.byId("Search").getValue();

        if (lv_input != "") {
          a = lv_input.substring(0, 1);
          b = lv_input.substring(1, 2);

          //   alert(a);
          //   alert(b);

          if (a == b) {
            oFilter = new Filter({
              path: "Group_Id",
              operator: FilterOperator.Contains,
              value1: lv_input,
            });

            aFilters.push(oFilter);
          } else {
            oFilter = new Filter({
              path: "Member_Id",
              operator: FilterOperator.Contains,
              value1: lv_input,
            });

            aFilters.push(oFilter);
          }
        }

        oBinding.filter(aFilters);
      },
    });
  }
);
