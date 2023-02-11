const {Chart,Utils} = require("chart.js/auto");

class FrequencyGraph {
	
	static chart;
	static chartAttGps;
	constructor() {}
	
	static setUp(){
		
		this.chart = new Chart(
			document.getElementById('frequencyGraph'),
			{
				type: 'line',
				data: {
					labels: "",
					datasets: [
						{
							label: 'Total messages per Second',
							data: 0
						}
					]
				}
			}
		);
		
		this.chart = new Chart(
			document.getElementById('frequencyGraph'),
			{
				type: 'line',
				data: {
					labels: "",
					datasets: [
						{
							label: 'Attitude',
							data: 0,
							borderColor: '#f67019'
						},
						{
							label: 'GlobalPositionInt',
							data: 0,
							borderColor: '#537bc4'
						}
					]
				}
			}
		);
	}
	
	
	static updateTotal(time,total){
		
		total = Math.random()*50000;
		let dim = 0;
		let data = undefined;
		this.chart.data.datasets.forEach((dataset) => {
			data = dataset.data;
		});
		
		data.push(total);
		this.chart.data.labels.push("");
		
		this.chart.update();
		
		if(data.length > 15){
			data.shift();
			this.chart.data.labels.shift();
		}
		
		this.chart.update();
	}
	
	static updateAttitude(counter) {
	
	}
	
	static updateGps(counter) {
	
	}
}

exports.FrequencyGraph = FrequencyGraph