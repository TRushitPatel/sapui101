sap.ui.define([
	"./BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("sapui101sapui101.controller.App", {
		onInit: function() {
			// this.onMenu();
			var oModel = new sap.ui.model.json.JSONModel();
			var arr = [];
			var jsonObj = {
				type: 'Button'
			};
			arr.push(jsonObj);
			jsonObj = {
				type: 'List'
			};
			arr.push(jsonObj);

			oModel.setData({
				item: {
					type: "contextBinding"
				},
				items: arr

			});

			this.getView().setModel(oModel, "model");
		},
		// onAfterRendering: function() {
		// 	var buttonToHide = this.getView().byId("id_ChatbotHeader").clone();
		// 	buttonToHide.setVisible(false);
		// },
		factoryfn: function(sId, oContext) {
			var oUIControl;
			if (oContext.getProperty("type") === "Button") {
				oUIControl = this.byId("id_buttonListItem").clone(sId);
			}
		},
		onItemSelect: function(oEvent) {
			var oControl = oEvent.getParameters().item;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			debugger;
			oRouter.navTo(oControl.getKey());

		},
		onMenu: function() {
			var oToolPage = this.byId("app");
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		}

	});
});