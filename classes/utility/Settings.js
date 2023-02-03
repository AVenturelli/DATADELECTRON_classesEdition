// noinspection EqualityComparisonWithCoercionJS
const {promises: fs} = require("fs");

class Settings {

    static #settingsData = undefined
    static fs = require('fs').promises;

    constructor(props) {
    }


    static readTextFile(file, callback) {
        let rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status === 200) {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }

//usage:
    static async fetchData() {
        let text = await this.fs.readFile("settings.json");
        let data = JSON.parse(text.toString());
        this.#settingsData = data.allSettings
    }

    static getData(paramName){
        let result = this.getSingleData(paramName);
        return result[0].value
    }

    static getSingleData(paramName) {

        if(this.#settingsData !== undefined) {
            return this.#settingsData.filter(
                (data) => {
                    return data.name === paramName
                }
            );
        }
        else {
            console.log("Errore: la variabile dati è vuota!")
        }
    }
}

exports.Settings = Settings;
