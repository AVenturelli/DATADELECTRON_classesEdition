const SendMessage = require("../mavlinkMessages/SendMessage").SendMessage;
const FlightPathWithWayPoints = require("./FlightPathWithWayPoints").FlightPathWithWayPoints;

class WayPointManager {
    constructor() {
    }

    static setupListeners() {

        $(document).on('click', '#checkRoute', () => {
            this.showTabWaypoints();
        });
        $(document).on('click', '#closeWayPoint', () => {
            this.closeTabWayPoints();
        });

        $('#refreshList').on('click', () => {
            this.populatePointsAfterDelay();
        })

        $(document).on('click', '.wayPointLiItem', function () {

            $('.wayPointLiItem').each(function (i, obj) {
                $(this).css('background-color', 'transparent')
                $(this).css('border-color', 'gray')
                if (!$(this).hasClass('wayPointSelected')) {
                    $(this).removeClass('wayPointSelected');
                    let wayPointIndex = $(this).data('index');
                    FlightPathWithWayPoints.setWayPointRed()
                }
            });

            $(this).css('background-color', 'lightgreen')
            $(this).css('border-color', 'green')
            $(this).addClass('wayPointSelected');


            let wayPointIndex = $(this).data('index');
            FlightPathWithWayPoints.setWayPointGreen(wayPointIndex)

        });

        $(document).on('click', '.buttonUpdateWayPoint ', function (event) {
            event.stopPropagation();
            let strippedIndex = $(this).attr('id');
            strippedIndex = strippedIndex.split("_")[1];
            let lat = $('#lat_' + strippedIndex).val();
            let lng = $('#lng_' + strippedIndex).val();
            let altitude = $('#alt_' + strippedIndex).val();

            FlightPathWithWayPoints.updatePoint(strippedIndex, lat, lng, altitude)

        })

        $(document).on('click','.buttonSendHomeValues', function (event){
            event.stopPropagation();
            let strippedIndex = $(this).attr('id');
            strippedIndex = strippedIndex.split("_")[1];
            let lat = $('#lat_' + strippedIndex).val();
            let lng = $('#lng_' + strippedIndex).val();
            //let altitude = $('#alt_' + strippedIndex).val();
            SendMessage.setPlaneHome(lat,lng)

            //FlightPathWithWayPoints.updatePoint(strippedIndex, lat, lng, altitude)
        })


        $("#wayPointList").sortable({
            cancel: "input, textarea, button, select, option, .unsortable",
            stop: function (event, ui) {
                let index = 0;
                $('.wayPointLiItem').each(function (i, obj) {
                    let strippedIndex = $(this).attr('id');
                    strippedIndex = strippedIndex.split("_")[1];

                    // noinspection EqualityComparisonWithCoercionJS
                    if (index != strippedIndex) {
                        //Cambio!
                        FlightPathWithWayPoints.changeWayPoint(strippedIndex, index);
                        $('#refreshList').trigger('click')
                        return false;
                    }
                    index++;
                });
            }
        });
    }

    static showTabWaypoints() {

        this.populateWayPoints();

        $('#wayPointModal').show();
        $('#mapContainer').css('z-index', 999999999)
    }

    static hideTabWaypoints(){
        $('#wayPointModal').hide();
        $('#mapContainer').css('z-index', 0)
    }

    static closeTabWayPoints() {
        $('#wayPointModal').hide();
        $('#mapContainer').css('z-index', 0)
    }

    static populateWayPoints() {
        setTimeout(this.populatePointsAfterDelay, 50);
    }

    static populatePointsAfterDelay() {
        let wayPoints = FlightPathWithWayPoints.getWayPoints();
        let html = ""
        for (let i = 0; i < wayPoints.length; i++) {
            let latLng = wayPoints[i].getLatLngPosition()
            let alt = wayPoints[i].getWayPointAltitude()
            let number = "N°" + i
            let className = ""
            let css = ""
            if (i === 0) {
                number = "HOME";
                className = "unsortable";
                css = 'border-color:lightcoral !Important'
            }
            html += "<li class='wayPointLiItem " + className + "' style='" + css + "' data-index='" + i + "' id='li_" + i + "'><div class='row'>" +
                "<div class='col-sm-1'><h4 style='margin-top: 13px'>" + number + "</h4></div>" +
                "<div class='col-sm-3'><label for='lat_" + i + "'>Latitude: </label><br><input type='text' id='lat_" + i + "' value='" + latLng.lat + "'></div> " +
                "<div class='col-sm-3'><label for='lng_" + i + "'>Longitude: </label><br><input type='text' id='lng_" + i + "' value='" + latLng.lng + "'></div> " +
                "<div class='col-sm-2'><label for='alt_" + i + "'>Altitude: </label><br><input type='text' id='alt_" + i + "' value='" + alt + "'></div> " +
                "<div class='col-sm-2'><button type='button' id='sendValues_" + i + "' class='buttonSendHomeValues btn btn-success'>SEND HOME</button></div> " +
                "<div class='col-sm-1' style='float: right;margin-top: 10px'><button type='button' id='updateValues_" + i + "' class='buttonUpdateWayPoint btn btn-success'>Update</button> </div> " +
                "</div></li>"
        }
        $('#wayPointList').html(html)
        $("#wayPointList").sortable("refresh");
    }
}

exports.WayPointManager = WayPointManager