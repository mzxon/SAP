sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, FlattenedDataset, FeedItem) {
    "use strict";

    return Controller.extend("sync4.c1.fioriedu14.controller.ColumnView", {
      onInit: function () {
        var oModel = this.getView().getModel();
        var oChart = this.getView().byId("idColumnChart");
        // Viz Chart의 데이터 형태는 FlattenedDataset 형태이어야함
        var oDataSet = new FlattenedDataset({
          //기준이 되는 필드 정의 (group by)
          dimensions: {
            name: "Airline Name",
            value: "{Carrname}",
          },

          //그래프 그리는데 필요한 값 value
          measures: [
            {
              name: "Price",
              value: "{Price}",
            },
            {
              name: "Payment",
              value: "{Paymentsum}",
            },
          ],

          //데이터 경로 OData EntitySet Binding
          data: {
            path: "/FlightSet",
          },
        });

        oChart.removeAllFeeds(); //차트를 깨끗이 Clear
        oChart.setDataset(oDataSet); //위에서 만든 FlattenedDataset(viz chart data)을 Binding
        oChart.setModel(oModel); //현재 View의 Model을 세팅

        //차트의 속성정보 설정(Property Setting)
        oChart.setVizProperties({
          plotArea: {
            dataLabel: {
              visible: true,
            },

            window: {
              start: "firstDataPoint",
              end: "lastDataPoint",
            },
          },
          legend: {
            title: {
              visible: false,
            },
          },
          title: {
            //visible : false,
            text: "항공사별 평균금액",
          },
        });

        oChart.addFeed(
          new FeedItem({
            uid: "categoryAxis",
            type: "Dimension",
            values: ["Airline Name"],
          })
        );

        oChart.addFeed(
          new FeedItem({
            uid: "valueAxis",
            type: "Measure",
            values: ["Price"],
          })
        );

        oChart.addFeed(
          new FeedItem({
            uid: "valueAxis",
            type: "Measure",
            values: ["Payment"],
          })
        );
      },
    });
  }
);
