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
	
	static setBatteryLevel(){
		let battery = FlightData.currentBattery;
		let batteryVoltage = FlightData.currentBatteryVoltage;
		let color = "";

		if(battery < 15) color = "red";
		if(battery > 15) color = "orange";
		if(battery > 30) color = "yellow";
		if(battery > 50) color = "lightgreen";
		if(battery > 80) color = "green";
		
		
		$('#battBar').val(battery/10);
		$('#battBar').css('accent-color',color);
		
		$('#battPercentage').html(Math.round(batteryVoltage*100)/100+"V")
	}
	
	static updateRssi() {
		let percentage = Math.round(FlightData.rssi / 255 * 100);
		let image
		if(percentage < 25) image = "assets/img/wifi25.svg";
		if(percentage > 25) image = "assets/img/wifi50.svg";
		if(percentage > 50) image = "assets/img/wifi75.svg";
		if(percentage > 75) image = "assets/img/wifi100.svg";
		$('#sigAntennaIcon').attr('src',image);
		$('#sigPercentage').html(percentage+"%")
	}
}

exports.PacketInterpreterRender = PacketInterpreterRender