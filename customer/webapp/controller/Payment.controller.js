sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/unified/DateRange",
      "sap/ui/core/format/DateFormat",
      "sap/ui/core/library",
      "sap/ui/core/date/UI5Date"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, DateRange, DateFormat, coreLibrary, UI5Date) {
      "use strict";

	  var CalendarType = coreLibrary.CalendarType;

      return Controller.extend("cust.customer.controller.Payment", {

        oFormatYyyymmdd: null,

        onInit: function () {
          this._getRouter()
            .getRoute("paymentView")
            .attachPatternMatched(this._onRouteMatched.bind(this), this);

          this.oFormatYyyymmdd = DateFormat.getInstance({pattern: "yyyy-MM-dd", calendarType: CalendarType.Gregorian});
        },

         //라우터 연결정보 가져오기
        _getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        //전달받은 파라미터 값 가져오기
        _onRouteMatched: function (oEvent) {
            var oCustno = oEvent.getParameter("arguments").Custno;
            var oSerno = oEvent.getParameter("arguments").Serno;

            console.log(oCustno);
            console.log(oSerno);
        },
        
        //날짜선택
        handleCalendarSelect: function(oEvent) {
			var oCalendar = oEvent.getSource();

            alert(oCalendar);
		},

        //다음버튼
		nextStep: function() {
			
		}
    })
    }
  );