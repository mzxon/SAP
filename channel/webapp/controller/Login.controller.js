sap.ui.define(
  [
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (MessageToast, Controller, Fragment, syncStyleClass) {
    "use strict";

    //Custno
    let Custno;
    var iTimeoutId;

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

                console.log(
                  "Before if (!this._pBusyDialog):",
                  this._pBusyDialog
                );

                if (!this._pBusyDialog) {
                  this._pBusyDialog = Fragment.load({
                    name: "chn.channel.view.Login",
                    controller: this,
                  }).then(
                    function (oBusyDialog) {
                      this.getView().addDependent(oBusyDialog);
                      syncStyleClass(
                        "sapUiSizeCompact",
                        this.getView(),
                        oBusyDialog
                      );
                      return oBusyDialog;
                    }.bind(this)
                  );
                }

                this._pBusyDialog.then(
                  function (oBusyDialog) {
                    oBusyDialog.open();
                    this.simulateServerRequest();
                  }.bind(this)
                );

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
          Empno: Custno,
        });
      },

      //라우터 정보가져오기
      _getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },
      simulateServerRequest: function () {
        // simulate a longer running operation
        iTimeoutId = setTimeout(
          function () {
            this._pBusyDialog.then(function (oBusyDialog) {
              oBusyDialog.close();
            });
          }.bind(this),
          3000
        );
      },

      onDialogClosed: function (oEvent) {
        clearTimeout(iTimeoutId);

        if (oEvent.getParameter("cancelPressed")) {
          MessageToast.show("The operation has been cancelled");
        } else {
          MessageToast.show("The operation has been completed");
        }
      },
    });
  }
);
