// noinspection EqualityComparisonWithCoercionJS
class Settings {

    static settingsData = undefined

    static readTextFile(file, callback) {
        let rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = async function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }

//usage:
     static fetchData() {
        this.readTextFile("./settings.json", (text) => {
            let data = JSON.parse(text);
            this.settingsData = data.allSettings
            console.log(this.settingsData)
        });
    }

    static getData(paramName){
        let result = this.getSingleData(paramName);
        return result[0].value
    }

    static getSingleData(paramName) {
        return this.settingsData.filter(
            (data) => {
                return data.name == paramName
            }
        );
    }
}

exports.Settings = Settings;
