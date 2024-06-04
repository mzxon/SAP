sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/unified/DateRange",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    DateRange,
    DateFormat,
    coreLibrary,
    Filter,
    FilterOperator,
    MessageToast
  ) {
    "use strict";

    var oCustno;
    var oSerno;
    var CalendarType = coreLibrary.CalendarType;
    var payType = null;
    var cust_info = [];
    var info = [];
    var ren_price;
    let oJsonModel = new sap.ui.model.json.JSONModel();
    var oEndDate;

    return Controller.extend("cust.customer.controller.Payment", {
      oFormatYyyymmdd: null,

      onInit: function () {
        this._getRouter()
          .getRoute("paymentView")
          .attachPatternMatched(this._onRouteMatched.bind(this), this);

        this.oFormatYyyymmdd = DateFormat.getInstance({
          pattern: "yyyy-MM-dd",
          calendarType: CalendarType.Gregorian,
        });
      },

      //라우터 연결정보 가져오기
      _getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },

      //전달받은 파라미터 값 가져오기
      _onRouteMatched: function (oEvent) {
        let oModel = this.getOwnerComponent().getModel();
        oCustno = oEvent.getParameter("arguments").Custno;
        oSerno = oEvent.getParameter("arguments").Serno;

        var oFilter = null,
          aFilters = [];

        oFilter = new Filter({
          path: "Custno",
          operator: FilterOperator.EQ,
          value1: oCustno,
        });

        aFilters.push(oFilter);

        oModel.read("/MemberSet", {
          filters: aFilters, // 필터 배열 적용

          success: function (response) {
            cust_info = [
              {
                name: response.results[0].Custname,
                email: response.results[0].Custemail,
                addr: response.results[0].Custaddr,
                phone: response.results[0].Custphone,
              },
            ];
          },
          error: function (response) {
            MessageToast.show("Error");
          },
        });

        //조회해서 JsonModel에 넣어서 View에서 사용하기
        oModel.read("/OrderSet('" + oSerno + "')", {
          success: function (response) {
            // 포맷팅된 가격 설정
            response.Price = this.formatPrice(
              parseInt(response.Price.replace(/\./g, "")) / 10
            );
            ren_price = response.Price;

            oJsonModel.setData(response);
            this.getView().setModel(oJsonModel, "Order");

            info = [
              {
                modcd: response.Modcd,
                modtxt: response.Modtxt,
                price: response.Price,
              },
            ];

            // 기존 모델 데이터 가져오기
            var oModelData = oJsonModel.getData();

            // info 데이터 추가
            oModelData.total_price = info[0].price;

            // 업데이트된 데이터를 모델에 다시 설정
            oJsonModel.setData(oModelData);
          }.bind(this),
          error: function (response) {
            MessageToast.show("Error");
          },
        });
      },

      formatPrice: function (price) {
        if (!price && price !== 0) {
          return "";
        }
        return new Intl.NumberFormat("ko-KR", {
          currency: "KRW",
        }).format(price);
      },

      //날짜선택
      handleCalendarSelect: function (oEvent) {
        var oCalendar = oEvent.getSource();
        var oSelDate = oCalendar.getSelectedDates(),
          oDate = oSelDate[0].getStartDate();

        var today = new Date(); //오늘 날짜 가져오기

        if (oDate < today) {
          alert("오늘 날짜보다 앞선 날짜를 선택해주세요");
          return; // 오늘 날짜보다 앞선 날짜를 선택한 경우 함수를 종료
        }

        var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
          pattern: "yyyy-MM-dd",
        });
        oEndDate = oDateFormat.format(oDate);
        console.log(oEndDate);

        var differenceInDays = Math.floor(
          (oDate - today) / (1000 * 60 * 60 * 24) + 2
        );
        info[0].day = differenceInDays;

        var totalPrice = differenceInDays * ren_price.replace(/\,/g, "");

        info[0].price = totalPrice.toLocaleString();
        // total_price 업데이트
        oJsonModel.setProperty("/total_price", info[0].price);
      },

      nextStep: function () {
        // date FlexBox를 숨기고 pay FlexBox를 표시
        var oDateFlexBox = this.byId("date");
        var oPayFlexBox = this.byId("pay");

        oDateFlexBox.setVisible(false);
        oPayFlexBox.setVisible(true);
      },

      previousStep: function () {
        // pay FlexBox를 숨기고 date FlexBox를 표시
        var oDateFlexBox = this.byId("date");
        var oPayFlexBox = this.byId("pay");

        if (oDateFlexBox.getVisible() === true) {
          sap.ui.core.UIComponent.getRouterFor(this).navTo("mainView", {
            Custno: oCustno,
          });
        } else {
          oDateFlexBox.setVisible(true);
          oPayFlexBox.setVisible(false);
        }
      },

      handleSelectAll: function (oEvent) {
        // selectAllCheckBox가 체크되면 나머지 체크박스도 체크/언체크
        var bSelected = oEvent.getParameter("selected");
        this.byId("checkBox1").setSelected(bSelected);
        this.byId("checkBox2").setSelected(bSelected);
      },

      //라디오버튼
      onSelect: function (oEvent) {
        payType = null;
        var selectedRadioButton = oEvent.getSource();
        var id = selectedRadioButton.getId();

        payType = id;
      },

      //결제
      requestPay: function () {
        var that = this;
        var IMP = window.IMP;
        IMP.init("imp21380672");

        var today = new Date();
        var hours = today.getHours(); // 시
        var minutes = today.getMinutes(); // 분
        var seconds = today.getSeconds(); // 초
        var milliseconds = today.getMilliseconds();
        var makeMerchantUid = hours + minutes + seconds + milliseconds;

        var pg;
        switch (payType) {
          case "__xmlview0--kakao":
            pg = "kakaopay";
            break;
          case "__xmlview0--payco":
            pg = "payco";
            break;
          case "__xmlview0--toss":
            pg = "tosspay";
            break;
          case "__xmlview0--card":
            pg = "html5_inicis";
            break;

          default:
            alert("결제 수단을 선택해주세요");
            return;
        }
        var num = parseFloat(info[0].price.replace(/\,/g, ""));
        var formattedNum = num.toFixed(2);

        console.log(formattedNum);

        IMP.request_pay(
          {
            pg: pg,
            pay_method: "card",
            merchant_uid: "IMP" + makeMerchantUid,
            name: info[0].modtxt, //제품명
            amount: info[0].price, //가격
            buyer_email: cust_info[0].email, //구매자 이메일
            buyer_name: cust_info[0].name, //구매자 이름
            buyer_tel: cust_info[0].phone, //구매자 전화번호
            buyer_addr: cust_info[0].addr, //구매자 주소
          },
          function (rsp) {
            // callback
            if (rsp.success) {
              let oCrtData = {
                Custno: oCustno,
                Sereno: oSerno,
                Modcd: info[0].modcd,
                Tot_Price: formattedNum,
                Endat: oEndDate,
              };

              // 주문 생성
              var oModel = that.getView().getModel();
              oModel.create("/RentalSet", oCrtData, {
                success: function () {
                  MessageToast.show("결제되었습니다.");
                  sap.ui.core.UIComponent.getRouterFor(that).navTo("mainView", {
                    Custno: oCustno,
                  });
                },
                error: function () {
                  alert("결제에 실패했습니다.");
                },
              });
              oModel.refresh();
            } else {
              alert("결제에 실패했습니다.");
              console.log(rsp);
            }
          }
        );
      },
    });
  }
);
