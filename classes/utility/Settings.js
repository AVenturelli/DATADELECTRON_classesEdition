// noinspection EqualityComparisonWithCoercionJS
const {promises: fs} = require("fs");
const path = require("path");

class Settings {

    static #settingsData = undefined
    static #messageData = undefined;
    static #mavMessages = undefined;
    static #allData = undefined;
    static fs = require('fs').promises;

    constructor(props) {
    }

    static async fetchData() {
        let text = await this.fs.readFile(path.resolve(__dirname, "../../settings.json"));
        let data = JSON.parse(text.toString());
        this.#settingsData = data.allSettings
        this.#messageData = data.savedMavlinkMessages
        this.#allData = data;
        $('#streamLink').val(this.getData('cameraAddress'));
        
        text = await this.fs.readFile(path.resolve(__dirname, "../../mavlinkMessages.json"));
        data = JSON.parse(text.toString());
        this.#mavMessages = data.mavMessages
        
    }
    static getMavMessages(){
        return this.#mavMessages;
    }

    static getData(paramName) {
        let result = this.getSingleData(paramName);
        return result[0].value
    }

    static getSingleData(paramName) {

        if (this.#settingsData !== undefined) {
            return this.#settingsData.filter(
                (data) => {
                    return data.name === paramName
                }
            );
        } else {
            console.log("Errore: la variabile dati è vuota!")
        }
    }
    
    static async addMessage(name, component, system, command, p1, p2, p3, p4, p5, p6, p7) {
    
        let newMsg = {
            name: name,
            component: component,
            system: system,
            command: command,
            p1: p1,
            p2: p2,
            p3: p3,
            p4: p4,
            p5: p5,
            p6: p6,
            p7: p7
        }
        for (let i in this.#messageData) {
            if (this.#messageData[i].name === newMsg.name) {
                //Stesso nome, non salvo!
                return false;
            }
        }
        this.#messageData.push(newMsg)
        let data = {
            "allSettings": this.#settingsData,
            "savedMavlinkMessages": this.#messageData
        }
        await this.fs.writeFile(path.resolve(__dirname, "../../settings.json"), JSON.stringify(data, null, '\t'), 'utf8');
    
        await this.fetchData();
        
        return true;
    
    
    }
    
    static getSavedMavMessages() {
        return this.#messageData;
    }
}

exports.Settings = Settings;
