const {Chart,Utils} = require("chart.js/auto");
const {PacketInterpreter} = require("./PacketInterpreter");

class FrequencyGraph {
	
	static chart;
	static paramName = "";
	
	static paramList = undefined;
	
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
	}
	
	static startFrequencyReading(){
		
		$('#frequencyModal').show()
		
		//Quanti dati arrivano al secondo?
		setInterval(() =>{
			//Azzero
			let total = 0;
			let data = PacketInterpreter.getMessagesList().messages;
			
			for(let i in data){
				let name = data[i].name
				let counter = data[i].count;
				total += data[i].count;
				data[i].count = 0;
				
				if(name === 'GlobalPositionInt'){
					FrequencyGraph.updateGps(counter);
				}
				
			}
			
			let date = new Date();
			FrequencyGraph.updateGraph("",total,);
		},1000)
	}
	
	static updateGraph(paramName,total){
		
		total = Math.random()*50000;
		let data = undefined;
		
		//Totale
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
	
	static updateGps(counter) {
	
	}
}

exports.FrequencyGraph = FrequencyGraph