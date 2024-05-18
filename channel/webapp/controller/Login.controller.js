sap.ui.define(
  [
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    MessageToast,
    Fragment,
    Controller,
    JSONModel,
    Fliter,
    FilterOperator
  ) {
    "use strict";

    //Custno
    let Custno;

    return Controller.extend("chn.channel.controller.Login", {
      onInit: function () {},

      //로그인 버튼
      Login: function () {
        let lv_id = this.byId("custid").getValue(),
            lv_pw = this.byId("custpw").getValue(),
            oModel = this.getView().getModel();

        if (lv_id == "") {
          alert("아이디를 입력하세요.");
        } else {
          if (lv_pw == "") {
            alert("비밀번호를 입력하세요.");
          }

          //entityset
          oModel.read("/MemberSet('" + lv_id + "')", {
            success: function (oData) {
              if (lv_pw == oData.Custpw) {
                alert("로그인에 성공했습니다.");

                this.onSet(oData);

              } else {
                alert("비밀번호가 맞지 않습니다.");
              }
            }.bind(this),
            error: function (oData) {
              MessageToast.show("Error");
            },
          });
        }
      },

      //로그인 성공 시 Custno 가져오기
      onSet: function (oDataSet) {
        Custno = oDataSet.Custno;

        this._getRouter().navTo("mainView", {
          Empno: Custno
        });
      },

      //라우터 정보가져오기
      _getRouter:function () {
        return sap.ui.core.UIComponent.getRouterFor(this);        
      },

      //fragment 가져오기
      _getFormFragment: function (sFragmentName) {
        var pFormFragment = this._formFragments[sFragmentName],
          oView = this.getView();

        if (!pFormFragment) {
          pFormFragment = Fragment.load({
            id: oView.getId(),
            name: "chn.channel.controller.Channel_Management." + sFragmentName,
          });
          this._formFragments[sFragmentName] = pFormFragment;
        }

        return pFormFragment;
      },

      //fragment 보여주기
      _showFormFragment: function (sFragmentName) {
        var oPage = this.byId("Login");

        oPage.removeAllContent();
        this._getFormFragment(sFragmentName).then(function (oVBox) {
          oPage.insertContent(oVBox);
        });
      },
    });
  }
);
