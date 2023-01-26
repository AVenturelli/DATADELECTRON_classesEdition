const CanvasCompassRender = require("./CanvasCompassRender").CanvasCompassRender;
const JQueryRenderAltitudeData = require("./JQueryRenderAltitudeData").JQueryRenderAltitudeData;
const JQueryRenderSpeedData = require("./JQueryRenderSpeedData").JQueryRenderSpeedData;
const JQueryRenderAccelerationData = require("./JQueryRenderAccelerationData").JQueryRenderAccelerationData;

class JQueryRender {
    constructor() {
    }
    static updateSingleData(){
        JQueryRenderAccelerationData.render()
        JQueryRenderAltitudeData.render()
        JQueryRenderSpeedData.render()
        CanvasCompassRender.render()
    }
}

exports.JQueryRender = JQueryRender;
