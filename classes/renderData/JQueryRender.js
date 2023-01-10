const JQueryRenderAltitudeData = require("./JQueryRenderAltitudeData").JQueryRenderAltitudeData;
const JQueryRenderSpeedData = require("./JQueryRenderSpeedData").JQueryRenderSpeedData;
const JQueryRenderAccelerationData = require("./JQueryRenderAccelerationData").JQueryRenderAccelerationData;

class JQueryRender{
    static updateSingleData(){
        JQueryRenderAccelerationData.render()
        JQueryRenderAltitudeData.render()
        JQueryRenderSpeedData.render()
    }
}

exports.JQueryRender = JQueryRender;
