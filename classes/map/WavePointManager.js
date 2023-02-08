const FlightPathWithWavePoints = require("./FlightPathWithWavePoints").FlightPathWithWavePoints;

class WavePointManager {
    constructor() {
    }

    static setupListeners(){
        $(document).on('click', '#checkRoute', () => {
            this.showTabWavepoints();
        });
        $(document).on('click', '#closeWavePoint', () => {
            this.closeTabWavePoints();
        });

        $('#refreshList').on('click', () =>{
            this.populatePointsAfterDelay();
        })

        $(document).on('click', '.wavePointLiItem', function() {

            $('.wavePointLiItem').each(function(i, obj) {
                $(this).css('background-color', 'transparent')
                $(this).css('border-color', 'gray')
            });

            if(!$(this).hasClass('wavePointSelected')){
                if( !$(this).hasClass('unsortable')){
                    $(this).css('background-color', 'lightgreen')
                    $(this).css('border-color', 'green')
                    $(this).addClass('wavePointSelected');
                }
                else
                {
                    $(this).css('border-color', 'lightcoral')
                }
                let wavePointIndex = $(this).data('index');
                FlightPathWithWavePoints.setWavePointGreen(wavePointIndex)
            }
            else{
                $(this).css('background-color', 'transparent')
                $(this).css('border-color', 'gray')
                $(this).removeClass('wavePointSelected');
                let wavePointIndex = $(this).data('index');
                FlightPathWithWavePoints.setWavePointRed()
            }


        });

        $(document).on('click','.buttonUpdateWavePoint ', function (event){
            event.stopPropagation();
            console.log("Wee")
        })


        $("#wavePointList").sortable({
            cancel: '.unsortable',
            stop: function(event, ui) {
                let index = 0;
                $('.wavePointLiItem').each( function(i, obj) {
                    let strippedIndex = $(this).attr('id');
                    strippedIndex = strippedIndex.split("_")[1];

                    // noinspection EqualityComparisonWithCoercionJS
                    if(index != strippedIndex){
                        //Cambio!
                        FlightPathWithWavePoints.changeWavePoint(strippedIndex,index);
                        $('#refreshList').trigger('click')
                        return false;
                    }
                    index++;
                });
            }
        });
    }

    static showTabWavepoints(){

        this.populateWavePoints();

        $('#wavePointModal').show();
        $('#mapContainer').css('z-index',999999999)
    }
    static  closeTabWavePoints(){
        $('#wavePointModal').hide();
        $('#mapContainer').css('z-index',0)
    }
    static populateWavePoints(){
        setTimeout(this.populatePointsAfterDelay,50);
    }

    static populatePointsAfterDelay(){
        let wavePoints = FlightPathWithWavePoints.getWavePoints();
        let html = ""
        for(let i = 0; i < wavePoints.length; i++){
            let latLng = wavePoints[i].getLatLngPosition()
            let alt = wavePoints[i].getWavePointAltitude()
            let number = "N°"+i
            let className=""
            let css = ""
            if(i === 0){number = "HOME"; className="unsortable";css='border-color:lightcoral !Important'}
            html +="<li class='wavePointLiItem "+className+"' style='"+css+"' data-index='"+i+"' id='li_"+i+"'><div class='row'>" +
                "<div class='col-sm-1'><h4 style='margin-top: 13px'>"+number+"</h4></div>" +
                "<div class='col-sm-3'><label for='lat_"+i+"'>Latitude </label><br><input id='lat_"+i+"' value='"+latLng.lat+"'></div> " +
                "<div class='col-sm-3'><label for='lng_"+i+"'>Longitude: </label><br><input id='lng_"+i+"' value='"+latLng.lng+"'></div> " +
                "<div class='col-sm-2'><label for='alt_"+i+"'>Altitude: </label><br><input id='alt_"+i+"' value='"+alt+"'></div> " +
                "<div class='col-sm-2'></div> " +
                "<div class='col-sm-1' style='float: right;margin-top: 10px'><button type='button' id='updateValues_"+i+"' class='buttonUpdateWavePoint btn btn-success'>Update</button> </div> " +
                "</div></li>"
        }
        $('#wavePointList').html(html)
        $("#wavePointList").sortable("refresh");
    }
}

exports.WavePointManager = WavePointManager