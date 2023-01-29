const CanvasArtificialOrizon = require("./CanvasArtificialOrizon").CanvasArtificialOrizon;
const CanvasPitch = require("./CanvasPitch").CanvasPitch;
const CanvasAltitudeRender = require("./CanvasAltitudeRender").CanvasAltitudeRender;
const CanvasSpeedRender = require("./CanvasSpeedRender").CanvasSpeedRender;
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
        CanvasSpeedRender.render()
        CanvasAltitudeRender.render()
        CanvasArtificialOrizon.render();
        CanvasPitch.render()
    }
}

exports.JQueryRender = JQueryRender;
