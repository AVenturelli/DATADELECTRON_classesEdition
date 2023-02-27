const {PortConnection} = require("../portConnection/PortConnection");
const {Connection} = require("../portConnection/Connection");
const {common, MavLinkProtocolV1, send} = require("node-mavlink");
const {Settings} = require("../utility/Settings");

class CustomMessages {
	constructor() {}
	
	static createListeners(){
		$('#sendCustomMessageModal').on('click', () => {
			$('#customMessageModal').show();
		})
		
		$('#closeMessageCustom').on('click', () => {
			$('#customMessageModal').hide();
		})
		
		$('#sendCommand').on('click', () => {
			this.sendCommand();
		})
		
		$('#saveCommand').on('click', () => {
			this.saveCommand();
		})
		
		$('#searchMessage').bind('change', 'input', (data) => {
			let name = $('#searchMessage').val()
			let messgs = Settings.getMavMessages();
			
			messgs.sort(function(a, b){
				return a.name - b.name;
			});
			
			for(let k in messgs){
				if(name === messgs[k].name){
					this.setParams(messgs[k]);
				}
			}
			
			$('#searchMessage').val("")
		});
		
		$('#selectOldMsg').bind('change', 'input', (data) => {
			let name = $('#selectOldMsg').val()
			let messgs = Settings.getSavedMavMessages();
			
			for(let k in messgs){
				if(name === messgs[k].name){
					this.setSavedParams(messgs[k]);
				}
			}
			$('#selectOldMsg').val("")
		});
	}
	
	static setSavedParams(mess) {
		$('#commandCustomName').val(mess.name)
		$('#targetSystem').val(mess.system)
		$('#targetComponent').val(mess.component)
		$('#commandNumber').val(mess.command)
		$('#param1').val(mess.p1)
		$('#param2').val(mess.p2)
		$('#param3').val(mess.p3)
		$('#param4').val(mess.p4)
		$('#param5').val(mess.p5)
		$('#param6').val(mess.p6)
		$('#param7').val(mess.p7)
	}
	
	static setParams(mess){
		$('#mavCommandDiv').show()
		$('#mavCommandName').html(mess.name);
		$('#mavCommandDesc').html(mess.desc);
		$('#mavCommandNumber').html(mess.value)
		$('#mavCommandParam1').html(mess.param1)
		$('#mavCommandParam2').html(mess.param2)
		$('#mavCommandParam3').html(mess.param3)
		$('#mavCommandParam4').html(mess.param4)
		$('#mavCommandParam5').html(mess.param5)
		$('#mavCommandParam6').html(mess.param6)
		$('#mavCommandParam7').html(mess.param7)
	}
	
	static saveCommand(){
		let messageName = $('#commandCustomName').val();
		let commandNumber = parseInt($('#commandNumber').val());
		let targetSystem = parseInt($('#targetSystem').val());
		let targetComponent = parseInt($('#targetComponent').val());
		let p1 = parseInt($('#param1').val());
		let p2 = parseInt($('#param2').val());
		let p3 = parseInt($('#param3').val());
		let p4 = parseInt($('#param4').val());
		let p5 = parseInt($('#param5').val());
		let p6 = parseInt($('#param6').val());
		let p7 = parseInt($('#param7').val());
		
		if(Settings.addMessage(
			messageName,
			targetComponent,
			targetSystem,
			commandNumber,
			p1,p2,p3,p4,p5,p6,p7
		)) {
			$('#saveMessageSuccess').show('fast');
			setTimeout(() =>{
				$('#saveMessageSuccess').hide('fast');
			},3000);
		} else {
			$('#saveMessageFailure').show('fast');
			setTimeout(() =>{
				$('#saveMessageFailure').hide('fast');
			},3000);
		}
		
		this.populateCommandList();
	}
	
	static populateCommandList() {
		
		//Populate all commands
		let messages = Settings.getMavMessages();
		let html = "";
		for(let i in messages){
			html +="<option value='"+messages[i].name+"'></option>";
		}
		$('#searchMessageList').html(html);
		
		//Populate saved command
		messages = Settings.getSavedMavMessages();
		html = "";
		for(let i in messages){
			html +="<option value='"+messages[i].name+"'></option>";
		}
		$('#datalistOptions').html(html);
	}
	
	static sendCommand()
	{
		
		let commandNumber = parseInt($('#commandNumber').val());
		let targetSystem = parseInt($('#targetSystem').val());
		let targetComponent = parseInt($('#targetComponent').val());
		let p1 = parseInt($('#param1').val());
		let p2 = parseInt($('#param2').val());
		let p3 = parseInt($('#param3').val());
		let p4 = parseInt($('#param4').val());
		let p5 = parseInt($('#param5').val());
		let p6 = parseInt($('#param6').val());
		let p7 = parseInt($('#param7').val());
		
		let connection = Connection.getSerialPort();
		
		let message = new common.CommandLong();
		
		message.targetComponent = (targetComponent);
		message.targetSystem = (targetSystem);
		message.command = (commandNumber);
		if(!isNaN(p1))message._param1 = p1;
		if(!isNaN(p2))message._param2 = p2;
		if(!isNaN(p3))message._param3 = p3;
		if(!isNaN(p4))message._param4 = p4;
		if(!isNaN(p5))message._param5 = p5;
		if(!isNaN(p6))message._param6 = p6;
		if(!isNaN(p7))message._param7 = p7;
		
		if(connection !== undefined){
			send(connection, message, new MavLinkProtocolV1()).then(r  => {
				$('#sentMessageSuccess').show('fast');
				setTimeout(() =>{
					$('#sentMessageSuccess').hide('fast');
				},3000);
			});
			
			$('#customMessageModal input').each(function () {
				$(this).val("");
			});
		} else {
			$('#sentMessageFailure').show('fast');
			setTimeout(() =>{
				$('#sentMessageFailure').hide('fast');
			},3000);
		}
		
	}
	
	

}

exports.CustomMessages = CustomMessages