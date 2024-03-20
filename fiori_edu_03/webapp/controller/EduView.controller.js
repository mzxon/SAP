//전역변수 선언하기
let oModel, //직접 레코드를 하드코딩으로 만들 데이터모델
  oResourceModel; //i18n.properties에서 읽어서 레코드 생성할 모델

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */

  function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("sync4.c1.fioriedu03.controller.EduView", {
      onInit: function () {
        //oModel에 들어갈 data 생성(레코드)
        var oData = {
          gs_mat: {
            Carrid: "Material",
            Connid: "Material Code",
          },
          gs_wrk: {
            Carrid: "Plant",
            Connid: "Plant Code",
          },
        };

        //생성한 oData를 oModel에 Json 형태로 할당
        oModel = new JSONModel(oData);

        var oData2 = {
          ls_mty: {
            Value: "Mat Type",
            Des: "Material Type",
          },
        };
        var oData3 = {
          ls_grp: {
            Value: "Mat Group",
            Des: "Material Group",
          },
        };

        var oModel2 = new JSONModel(oData2);
        var oModel3 = new JSONModel(oData3);

        //View에 Model을(데이터)를 알려줘야함
        //View에서 사용할 수 있음 (SET HANDLER같은)
        this.getView().setModel(oModel);
        this.getView().setModel(oModel2, "m2");
        this.getView().setModel(oModel3, "m3");
        //데이터 설정할 때 뒤에 이름을 줘서 구분할 수 있음
        //view에서 해당 데이터에 접근할 때 데이터이름>/로 접근

        //oResourceModel에 들어갈 i18n.properties 파일을 읽을 준비

        // gt_data: [ //테이블처럼 여러 레코드 담기(배열)
        //   {
        //     Carrid: "AA",
        //     Connid: "0017",
        //   },
        //   {
        //     Carrid: "DL",
        //     Connid: "0064",
        //   },
        // ],
      },

      Msg: function (msg) {
        alert(msg);
      },

      msgToast: function () {
        MessageToast.show("메세지 토스트", {
          at: "left",
        });
      },

      setMvalue: function () {
        //현재 View의 Model에서 특정 필드의 값을 가져옴
        var lv_mtart = oModel.getProperty("/gs_mat/Carrid");

        //View의 Input Filed에 값을 세팅
        this.getView().byId("inText").setValue(lv_mtart);
        //뷰에서 id가 inText인 요소에 lv_mtart의 값을 넣음

        // var lv_group = this.getView()
        //   .getModel("m3")
        //   .getProperty("/ls_grp/Value");

        var lv_group1 = this.getModel("m3").getProperty("/ls_grp/Value");
        l;

        this.getView().byId("group").setValue(lv_group1);
      },
    });
  }
);
