class JQueryRendererConnection {
    constructor() {
    }

    static setConnectionMessageNoneAvailable() {
        $('#connection_status').html("NO PORTS AVAILABLE")
    }

    static setConnectionMessageAvailable() {
        $('#connection_status').html("NOT CONNECTED")
    }

    static setUiToNotConnected(){
        let currentConnectionStatus = $('#connection_status');
        currentConnectionStatus.attr("blocked",false)
        currentConnectionStatus.removeClass("alert-success")
        currentConnectionStatus.addClass("alert-danger")
        $("#disconnect").hide("fast")
        $("#connect").show("fast")
        $("#zoommatoio").hide('fast')
        $("#siummatoio").hide('fast')
        $("#param_button").hide('fast')
        $('#button_parameters').hide('fast')
    }

    static setUiToConnected(){
        let currentConnectionStatus = $('#connection_status');
        currentConnectionStatus.addClass("alert-success")
        currentConnectionStatus.removeClass("alert-danger")
        currentConnectionStatus.html("CONNESSO")

        $("#connect").hide("fast")
        $("#disconnect").show("fast")
        $("#param_button").show('fast')
        $('#button_parameters').show('fast')
        $('#infobox_impostazioni_generali').show('fast')
        $('#adsb_container').show('fast')

    }

    static closeConnectionDataModal(){
        $(".close").trigger("click")
    }

    static openConnectionDataModal() {
        let modal = document.getElementById("connection_modal");
        let btn = document.getElementById("myBtn");
        let span = document.getElementsByClassName("close")[0];

        btn.onclick = () => {
            modal.style.display = "block";
        }

        span.onclick = () => {
            modal.style.display = "none";
        }

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }

    static displaySerialPorts(ports){
        let comPort = $('#com_port');
        //let comPortOut = $('#com_port_out');
        comPort.empty()
        //comPortOut.empty()
        if (ports !== "")
        {
            for (let port of ports)
            {
                comPort.append("<option value='"+ port.path +"' >"+ port.path +"</option>")
                //comPortOut.append("<option value='"+ port.path +"' >"+ port.path +"</option>")
            }
        }
    }
}
exports.ConnectionJQueryRenderer = JQueryRendererConnection;