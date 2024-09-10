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

    return Controller.extend("sync4.c1.fioriedu10.controller.SteelView", {
      onInit: function () {
        oTable = this.byId("steelList");
      },

      onSearch: function () {
        let oBinding = oTable.getBinding("rows"),
          lv_ser_st = "",
          lv_ser_we = "",
          oFliter = null,
          aFilters = [];

        lv_ser_st = this.byId("ser_st").getValue();
        lv_ser_we = this.byId("ser_we").getValue();

        if (lv_ser_st != "") {
          oFliter = new Filter({
            path: "Steel",
            operator: FilterOperator.Contains,
            value1: lv_ser_st,
          });

          aFilters.push(oFliter);
        }

        oFliter = null;

        if (lv_ser_we != "") {
          oFliter = new Filter({
            path: "Werks",
            operator: FilterOperator.Contains,
            value1: lv_ser_we,
          });

          aFilters.push(oFliter);
        }

        oBinding.filter(aFilters);

        //sap gui에서 대문자변환해주기
      },

      onDisplay: function () {
        //선택한 행의 인덱스 가져옴 (배열형태)
        let lv_tabix = oTable.getSelectedIndices();

        //선택한 행의 인덱스로 해당 인덱스 행의 모든 정보를 가져옴
        let oContext = oTable.getContextByIndex(lv_tabix[0]);

        //가져온 모든 정보를 object형태로 저장함
        let oData = oContext.getObject();

        //view 요소에 ID로 접근해서 oData의 필드 데이터값을 넣어줌
        this.byId("put_st").setValue(oData.Steel);
        this.byId("put_we").setValue(oData.Werks);
        this.byId("put_ki").setValue(oData.IndustryKind);
        this.byId("put_ar").setValue(oData.Area);
        this.byId("put_qt").setValue(oData.ProductQty);
        this.byId("put_un").setValue(oData.ProductUnit);
        this.byId("put_pr").setValue(oData.UnitPrice);
        this.byId("put_pun").setValue(oData.PriceUnit);
      },

      onClear: function () {
        this.byId("put_st").setValue("");
        this.byId("put_we").setValue("");
        this.byId("put_ki").setValue("");
        this.byId("put_ar").setValue("");
        this.byId("put_qt").setValue("");
        this.byId("put_un").setValue("");
        this.byId("put_pr").setValue("");
        this.byId("put_pun").setValue("");
      },

      onEdit: function () {
        let lv_tabix = oTable.getSelectedIndices(),
          oContext = oTable.getContextByIndex(lv_tabix[0]),
          oData = oContext.getObject();

        let oModel = this.getView().getModel();

        let lv_steel = oData.Steel,
          lv_werks = oData.Werks;

        alert(lv_steel);

        let oCrtData = {
          Steel: lv_steel,
          Werks: lv_werks,
          IndustryKind: this.byId("put_ki").getValue(),
          Area: this.byId("put_ar").getValue(),
          ProductQty: this.byId("put_qt").getValue(),
          ProductUnit: this.byId("put_un").getValue(),
          UnitPrice: this.byId("put_pr").getValue(),
          PriceUnit: this.byId("put_pun").getValue(),
        };

        oModel.update(
          "/MetalSet(Steel='" + lv_steel + "',Werks='" + lv_werks + "')",
          oCrtData,
          null,
          oModel.refresh(),
          alert("Update Success")
        );

        this.onClear();
      },

      onCreate: function () {
        let oModel = this.getView().getModel();

        let oCrtData = {
          Steel: this.byId("put_st").getValue(),
          Werks: this.byId("put_we").getValue(),
          IndustryKind: this.byId("put_ki").getValue(),
          Area: this.byId("put_ar").getValue(),
          ProductQty:
            this.byId("put_qt").getValue() === ""
              ? "0"
              : this.byId("put_qt").getValue(),
          ProductUnit: this.byId("put_un").getValue(),
          UnitPrice:
            this.byId("put_pr").getValue() === ""
              ? "0"
              : this.byId("put_pr").getValue(),
          PriceUnit: this.byId("put_pun").getValue(),
        };

        oModel.update(
          "/MetalSet",
          oCrtData,
          null,
          oModel.refresh(),
          alert("Create Success")
        );

        this.onClear();
      },

      onDelete: function () {
        let lv_tabix = oTable.getSelectedIndices(),
          oContext = oTable.getContextByIndex(lv_tabix[0]),
          oData = oContext.getObject();

        let oModel = this.getView().getModel();

        let lv_steel = oData.Steel;
        let lv_werks = oData.Werks;

        oModel.remove(
          "/MetalSet(Steel='" + lv_steel + "',Werks='" + lv_werks + "')",
          null,
          null,
          oModel.refresh(),
          alert("Delete Success")
        );
      },
    });
  }
);
