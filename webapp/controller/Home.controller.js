sap.ui.define(
	[
		"./BaseController"
	],
	function(BaseController) {
		return BaseController.extend("sapui101sapui101.controller.Home", {
			getRouter: function() {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				return oRouter;
			},
			toDetail1: function() {
				this.getRouter().navTo("detail1");
			},
			toDetail2: function() {
				this.getRouter().navTo("detail2");
			}
		});
	});