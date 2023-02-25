class PacketInterpreterRender {
	constructor() {}
	
	static setArmed(){
		$('#disarmedPng').hide();
		$('#setArmedDiv').hide();
		$('#setDisarmedDiv').show();
	}
	
	static setDisarmed(){
		$('#disarmedPng').show();
		$('#setArmedDiv').show();
		$('#setDisarmedDiv').hide();
	}
	
	static updateFlightMode(mode){
		let text;
		switch (mode) {
			case 0: text = "Manual"; break;
			case 1: text = "Circle"; break;
			case 2: text = "Stabilze"; break;
			case 3: text = "Training"; break;
			case 5: text = "FBWA"; break;
			case 6: text = "FBWB"; break;
			case 8: text = "AUTOTUNE"; break;
			case 10: text = "AUTO"; break;
			case 11: text = "RTL"; break;
			default: text = "Mode not supported"
		}
		
		$('#currentFlightMode').html(text)
	}
}

exports.PacketInterpreterRender = PacketInterpreterRender