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

    return Controller.extend(
      "sync4.c1.fioriedum02.controller.Flight_InfoView",
      {
        onInit: function () {
          oTable1 = this.byId("ScarrList");
          oTable2 = this.byId("FlightList");
        },

        onSelect: function () {
          //select 행 관련
          let lv_tabix = oTable1.getSelectedIndices();
          let oContext = [];
          let oData = null,
            carrid = "";

          let oBinding = oTable2.getBinding("rows"),
            oFliter = null,
            aFliters = [];

          for (let index = 0; index < lv_tabix.length; index++) {
            oContext = oTable1.getContextByIndex(lv_tabix[index]);
            oData = oContext.getObject();
            carrid = oData.Carrid;

            oFliter = new Fliter({
              path: "Carrid",
              operator: FilterOperator.EQ,
              value1: carrid,
            });

            aFliters.push(oFliter);
          }

          oBinding.filter(aFliters);
        },

        onDisplay: function () {
          let oBinding = oTable2.getBinding("rows"),
            oFliter = null,
            aFilters = [];

          oFliter = new Fliter({
            path: "Carrid",
            operator: FilterOperator.EQ,
            value1: "XX",
          });

          aFilters.push(oFliter);

          oBinding.filter(aFilters);
        },

        onDisplayData: function () {
          //선택한 행의 인덱스 가져옴 (배열형태)
          let lv_tabix = oTable2.getSelectedIndices();

          //선택한 행의 인덱스로 해당 인덱스 행의 모든 정보를 가져옴
          let oContext = oTable2.getContextByIndex(lv_tabix[0]);

          //가져온 모든 정보를 object형태로 저장함
          let oData = oContext.getObject();

          //view 요소에 ID로 접근해서 oData의 필드 데이터값을 넣어줌
          this.byId("put_carr").setValue(oData.Steel);
          this.byId("put_con").setValue(oData.Werks);
          this.byId("put_dat").setValue(oData.IndustryKind);
          this.byId("put_cfr").setValue(oData.Area);
          this.byId("put_").setValue(oData.ProductQty);
          this.byId("put_un").setValue(oData.ProductUnit);
          this.byId("put_pr").setValue(oData.UnitPrice);
          this.byId("put_pun").setValue(oData.PriceUnit);
        },

        onClear: function () {
          this.byId("put_car").setValue("");
          this.byId("put_conn").setValue("");
          this.byId("put_dat").setValue("");
          this.byId("put_cft").setValue("");
          this.byId("put_cft").setValue("");
          this.byId("put_dep").setValue("");
          this.byId("put_arr").setValue("");
          this.byId("put_pr").setValue("");
          this.byId("put_cu").setValue("");
        },

        onEdit: function () {
          let lv_tabix = oTable2.getSelectedIndices(),
            oContext = oTable2.getContextByIndex(lv_tabix[0]),
            oData = oContext.getObject();

          let oModel = this.getView().getModel();

          let lv_carrid = oData.Carrid;
          let lv_connid = oData.Connid;
          let lv_fldate = oData.Fldate;

          let oCrtData = {
            Carrid: this.byId("put_car").getValue(),
            Connid: this.byId("put_conn").getValue(),
            Fldate: this.byId("put_dat").getValue(),
            Countryfr: this.byId("put_cfr").getValue(),
            Countryto: this.byId("put_cft").getValue(),
            Deptime: this.byId("put_un").getValue(),
            Arrtime: this.byId("put_arr").getValue(),
            Price: this.byId("put_pr").getValue(),
            Currency: this.byId("put_cu").getValue(),
          };

          oModel.update(
            "/FlightSet(Carrid='" +
              lv_carrid +
              "',Connid='" +
              lv_connid +
              "',Fldate='" +
              lv_fldate +
              "')",
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
            Carrid: this.byId("put_car").getValue(),
            Connid: this.byId("put_conn").getValue(),
            Fldate: this.byId("put_dat").getValue(),
            Countryfr: this.byId("put_cfr").getValue(),
            Countryto: this.byId("put_cft").getValue(),
            Deptime: this.byId("put_un").getValue(),
            Arrtime: this.byId("put_arr").getValue(),
            Price:
              this.byId("put_pr").getValue() === ""
                ? "0"
                : this.byId("put_pr").getValue(),
            Currency: this.byId("put_cu").getValue(),
          };

          oModel.update(
            "/FlightSet",
            oCrtData,
            null,
            oModel.refresh(),
            alert("Create Success")
          );

          this.onClear();
        },

        onDelete: function () {
          let lv_tabix = oTable2.getSelectedIndices(),
            oContext = oTable2.getContextByIndex(lv_tabix[0]),
            oData = oContext.getObject();

          let oModel = this.getView().getModel();

          let lv_carrid = oData.Carrid;
          let lv_connid = oData.Connid;
          let lv_fldate = oData.Fldate;

          oModel.remove(
            "/FlightSet(Carrid='" +
              lv_carrid +
              "',Connid='" +
              lv_connid +
              +"',Fldate='" +
              lv_fldate +
              "')",
            null,
            null,
            oModel.refresh(),
            alert("Delete Success")
          );
        },
      }
    );
  }
);
