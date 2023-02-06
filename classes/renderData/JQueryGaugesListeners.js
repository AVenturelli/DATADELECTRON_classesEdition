class JQueryGaugesListeners {
    constructor() {
    }

    static createListeners(){
        $('#speedGauge').on('change', (elem) => {
            if($('#speedGauge').is(":checked")){
                $('#speedCanvas').show('fast')
            } else {
                $('#speedCanvas').hide('fast')
            }
        })

        $('#altitudeGauge').on('change', (elem) => {
            if($('#altitudeGauge').is(":checked")){
                $('#altitudeCanvas').show('fast')
            } else {
                $('#altitudeCanvas').hide('fast')
            }
        })

        $('#headingGauge').on('change', (elem) => {
            if($('#headingGauge').is(":checked")){
                $('#myCanvas').show('fast')
            } else {
                $('#myCanvas').hide('fast')
            }
        })

        $('#pitchGauge').on('change', (elem) => {
            if($('#pitchGauge').is(":checked")){
                $('#pitchCanvas').show('fast')
            } else {
                $('#pitchCanvas').hide('fast')
            }
        })
        $('#rollGauge').on('change', (elem) => {
            if($('#rollGauge').is(":checked")){
                $('#horizonBarCanvas').show('fast')
                $('#rollCanvas').show('fast')
            } else {
                $('#horizonBarCanvas').hide('fast')
                $('#rollCanvas').hide('fast')
            }
        })
    }
}
exports.JQueryGaugesListeners = JQueryGaugesListeners;
