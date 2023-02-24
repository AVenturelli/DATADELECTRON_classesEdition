const {Chart,Utils} = require("chart.js/auto");
const {PacketInterpreter} = require("./PacketInterpreter");

// noinspection JSCheckFunctionSignatures
class FrequencyGraph {
	
	static chart;
	static paramName = "total";
	static currentParam = "total";
	static paramList = undefined;
	static interval;
	
	
	constructor() {}
	
	static setUp(){
		let color = this.getRandomColor();
		this.chart = new Chart(
			document.getElementById('frequencyGraph'),
			{
				type: 'line',
				data: {
					labels: "",
					datasets: [
						{
							label: 'Total messages per Second',
							data: 0,
							borderColor: color,
							backgroundColor:  color
						}
					]
				}
			}
		);
		
		//Popolo il select:
		this.paramList = PacketInterpreter.getMessagesList();
		this.paramList.sort();
		
		let html = "<option value='total' selected>Totale dei pacchetti ricevuti</option>";
		let additionalText = "";
		
		for(let item in this.paramList){
			if(this.paramList[item] === "Attitude"){additionalText = "-> Roll, Pitch and Yaw"}
			if(this.paramList[item] === "GlobalPositionInt"){additionalText = "-> Lat, Lng and Alt"}
			html+="<option value='"+this.paramList[item]+"'>"+this.paramList[item]+" "+additionalText+"</option>"
			additionalText = "";
		}
		
		$('#paramFrequencySelector').html(html)
		
		//Preparo l'onchange
		$('#paramFrequencySelector').on('change', () =>{
			this.paramName = $('#paramFrequencySelector').val()
		})
		
		//Setto un listener
		$('#closeFrequencyModal').on('click', () =>{
			clearInterval(this.interval)
			$('#frequencyModal').hide();
			if(this.chart !== undefined){
				this.chart.destroy();
				this.chart = undefined;
			}
			this.paramName = "total";
			this.currentParam = "total";
			this.interval = undefined;
		})
	}
	
	static startFrequencyReading(){
		
		$('#frequencyModal').show()
		
		if(this.chart === undefined) {
			this.setUp();
		}
		
		//Quanti dati arrivano al secondo?
		this.interval = setInterval(() => {
			//Azzero
			let total = 0;
			let data = PacketInterpreter.getMessagesArray().messages;   
			
			if(this.paramName !== this.currentParam){
				this.chart.data.datasets.forEach((dataset) => {
					dataset.data = [];
					dataset.label = this.paramName
					dataset.borderColor = this.getRandomColor();
					dataset.backgroundColor = dataset.borderColor;
				});
				
				this.chart.data.labels = []
				this.currentParam = this.paramName
				this.chart.clear();
			}
			
			for(let i in data) {
				let name = data[i].name
				let counter = data[i].count;
				total += data[i].count;
				if(name === this.paramName) {
					total = counter;
					break;
				}
			}
			
			this.updateGraph(total );
			
			this.chart.update();
			
			PacketInterpreter.setCountToZero();
			
		},1000)
	}
	
	static getRandomColor(){
		return "#"+Math.floor(Math.random()*16777215).toString(16);
	}
	
	static updateGraph(total){
		
		//total = Math.random()*50000;
		let data;
		
		//Totale
		this.chart.data.datasets.forEach((dataset) => {
			data = dataset.data;
		});
		
		data.push(total);
		this.chart.data.labels.push("");
		
		this.chart.update();
		
		if(data.length > 20){
			data.shift();
			this.chart.data.labels.shift();
		}
		
		this.chart.update();
	}
}

exports.FrequencyGraph = FrequencyGraph