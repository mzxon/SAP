let oTable;
let oModel;

sap.ui.define(
  [
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Device, Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("sync4.c1.fioriedu09.controller.Idol", {
      onInit: function () {
        // this.getView().setModel(
        //   new JSONModel({
        //     widthS: Device.system.phone ? "2em" : "5em",
        //     widthM: Device.system.phone ? "4em" : "10em",
        //     widthL: Device.system.phone ? "6em" : "15em",
        //   })
        // );
        // var oData = {
        //   photo: "/img/pic1.jpg",
        // };
        // // set explored app's demo model on this sample
        // var oImgModel = new JSONModel(oData);
        // this.getView().setModel(oImgModel, "img");

        oTable = this.byId("idolList");
      },

      onSearch: function () {
        let oBinding = oTable.getBinding("rows"),
          lv_grid = "",
          lv_mmid = "",
          oFilter = null,
          aFilters = [];

        lv_grid = this.byId("groupId").getValue();
        lv_mmid = this.byId("memberId").getValue();

        if (lv_grid != "") {
          oFilter = new Filter({
            path: "Group_Id",
            operator: FilterOperator.Contains,
            value1: lv_grid,
          });

          aFilters.push(oFilter);
        }

        oFilter = null;

        if (lv_mmid != "") {
          oFilter = new Filter({
            path: "Member_Id",
            operator: FilterOperator.Contains,
            value1: lv_mmid,
          });

          aFilters.push(oFilter);
        }

        oBinding.filter(aFilters);
      },

      onDisplay: function () {
        let lv_tabix = oTable.getSelectedIndices(); //현재 선택한 행의 번호를 가져옴 [배열형태]
        let lt_rows = oTable.getRows(); //Grid의 모든 레코드를 가져옴
        let ls_row = lt_rows[lv_tabix].getCells(); //선택한 행의 Text를 가져옴 -> 행의 모든 필드 데이터 가져옴

        //lt_rows, ls_row대신에 이렇게 쓸 수 있음
        let oContext = oTable.getContextByIndex(lv_tabix[0]); //lv_tabix로 해당하는 행의 모든 정보를 가져옴
        let oData = oContext.getObject();
        //setValue(oData.Group_ID);
        //or
        let oModel = oContext.getModel();
        //setValue(oModel.getProperty("Group_Id", oContext));

        //lt_rows : 모든 레코드
        //ls_row  : 선택한 레코드의 모든 필드 값
        //ls_row의 인덱스로 필드 하나하나씩 접근 가능

        //각 Input에 해당 필드의 값을 세팅
        this.byId("Group_Id").setValue(oData.Group_Id); //ID가 Group_Id인 요소에 ls_row[0]의 텍스트를 넣음
        this.byId("Member_Id").setValue(oData.Member_Id);
        this.byId("Member_Name").setValue(oData.MemberName);
        this.byId("Member_Gender").setValue(oData.Member_Gender);
        this.byId("Member_Addr").setValue(oData.Member_Addr);
        this.byId("Member_Phone").setValue(oData.Member_Phone);
      },

      onClear: function () {
        this.byId("Group_Id").setValue("");
        this.byId("Member_Id").setValue("");
        this.byId("Member_Name").setValue("");
        this.byId("Member_Gender").setValue("");
        this.byId("Member_Addr").setValue("");
        this.byId("Member_Phone").setValue("");
      },

      onDelete: function () {
        let lv_tabix = oTable.getSelectedIndices(),
          lt_rows = oTable.getRows(),
          ls_row = lt_rows[lv_tabix].getCells(),
          lv_Group_Id = "",
          lv_Member_Id = "";

        //view의 데이터모델을 가져와서 oModel 생성
        oModel = this.getView().getModel();

        //Delete 하기 위해서 해당 테이블의 PK값을 가져옴
        lv_Group_Id = ls_row[0].getText();
        lv_Member_Id = ls_row[1].getText();

        oModel.remove(
          "/IdolSet(Group_Id='" +
            lv_Group_Id +
            "',Member_Id='" +
            lv_Member_Id +
            "')",
          null,
          null,
          oModel.refresh(),
          alert("Delete Success")
        );
      },

      onCreate: function () {
        oModel = this.getView().getModel();

        let oCrtData = {
          Group_Id: this.byId("Group_Id").getValue(),
          Member_Id: this.byId("Member_Id").getValue(),
          MemberName: this.byId("Member_Name").getValue(),
          Member_Gender: this.byId("Member_Gender").getValue(),
          Member_Addr: this.byId("Member_Addr").getValue(),
          Member_Phone: this.byId("Member_Phone").getValue(),
        };

        oModel.create(
          "/IdolSet",
          oCrtData,
          null,
          oModel.refresh(),
          alert("Create Scuccess")
        );

        this.onClear(); //Clear하는 펑션(여기서 만든) 호출
      },

      onEdit: function () {
        let lv_tabix = oTable.getSelectedIndices(),
          oContext = oTable.getContextByIndex(lv_tabix[0]), //lv_tabix로 해당하는 행의 모든 정보를 가져옴
          oData = oContext.getObject(), //->getContext는 테이블 행의 모든 정보를 가져옴
          lt_rows = oTable.getRows(), //->getRows는 visiable rows로 설정한 화면에서 보이는 (스크롤로 넘어가지 않는) 행들만 가져옴
          ls_row = lt_rows[lv_tabix].getCells(),
          //view의 데이터모델을 가져와서 oModel 생성
          oModel = this.getView().getModel(),
          lv_Group_Id = "",
          lv_Member_Id = "";

        //Update 하기 위해서 해당 테이블의 PK값을 가져옴
        lv_Group_Id = this.getValue(oData.Group_Id);
        lv_Member_Id = ls_row[1].getText();

        let oCrtData = {
          Group_Id: lv_Group_Id, //key필드는 값이 변경되면 안됨
          Member_Id: lv_Member_Id,
          MemberName: this.byId("Member_Name").getValue(),
          Member_Gender: this.byId("Member_Gender").getValue(),
          Member_Addr: this.byId("Member_Addr").getValue(),
          Member_Phone: this.byId("Member_Phone").getValue(),
        };

        oModel.update(
          "/IdolSet(Group_Id='" +
            lv_Group_Id +
            "',Member_Id='" +
            lv_Member_Id +
            "')",
          oCrtData,
          null,
          oModel.refresh(),
          alert("Update Scuccess")
        );

        this.onClear(); //Clear하는 펑션(여기서 만든) 호출
      },
    });
  }
);
