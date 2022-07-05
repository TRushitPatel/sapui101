sap.ui.define([
	"sap/ui/core/mvc/Controller"
	],
	function(Controller){
		return Controller.extend("sapui101sapui101.controller.Profile",{
			onInit:function(){
				var jsonModel = this.getOwnerComponent().getModel("tree");
				this.getView().setModel(jsonModel);
			}		
		}) ;
	});