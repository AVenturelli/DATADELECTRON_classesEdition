const MavlinkParams = require("../dataReader/MavlinkParams").MavlinkParams;

class JQueryParameterRenderer{
    static createParamsButtonListener(){
        let modalAllParams = $('#modalAllParams')
        let modalModifyParams = $('#modalModifyParams')
        let btnParam = $("#button_parameters");
        let spanParam = $(".closeParam");
        let spanModifyParam = $(".closeModifyParam");

        btnParam.on('click',function(){
            modalAllParams.css("display",'block')
        })

        spanModifyParam.on('click',function() {
            $(".modalModifyParams").css("display","none");
        })

        spanParam.on('click',function() {
            modalAllParams.css('display',"none");
        })

        window.onclick = function(event) {
            if (event.target === modalAllParams) {
                modalAllParams.css("display","none");
            }
        }

        window.onclick = function(event) {
            if (event.target === modalModifyParams) {
                modalModifyParams.css("display","none");
            }
        }

        $('#getAllParams').click(function() {

            MavlinkParams.requestAllParams()
            $("#param_rows div").html("")
            $(this).hide()
            $('#progressBarBox').html('<progress id="paramProgressBar" value="0" max="100" style="width: 100%"></progress>')
        })

        $("#searchBar").on("keyup", function() {
            let value = this.value.toLowerCase().trim();
            $("#param_rows div").show().filter(function () {
                if ($(this).attr('id') !== undefined) {
                    return $(this).attr('id').toLowerCase().trim().indexOf(value) === -1;
                }
            }).hide();
        });

        /*function populateParam(paramID)
        {
            $(".modalModifyParams").css("display","block");
            try {
                $('#paramDescription').html(paramID.getLongDesc())
            } catch (error) {
                console.error(paramID)
            }
        }*/
    }

    static showParams()
    {
        if(MavlinkParams.getAllParams() !== undefined) {
            let paramList = MavlinkParams.getAllParams().sort();
            $('#param_rows').html("")
            for (let param in paramList) {
                console.log(param);

                /*let shortDesc = MavlinkParams.getSingleParams([paramIdList[id]]);

                if(shortDesc === undefined) {
                    shortDesc = ""
                }
                else {
                    shortDesc = shortDesc['short_desc']
                }

                $('#param_rows').append("<div class='col-sm-4 sortable' id='"+ paramList[paramIdList[id]].paramId +"'>" +
                    "<div class='row'>" +
                    "<div class='col-sm-12'>" +
                    "<div class='innerParam'> " +
                    "Nome: <strong>" + paramList[paramIdList[id]].paramId + "</strong>, valore: <strong>" + paramList[paramIdList[id]].paramValue + "</strong>" +
                    "<svg onClick='populateParam("+ paramIdList[id] +")' style='float:right;margin-top:5px' xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil-square' viewBox='0 0 16 16'> " +
                    "<path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z'/>    " +
                    "<path fill-rule='evenodd' d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z'/>" +
                    "</svg>" +
                    "<div>" + shortDesc + "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>");

                 */
            }

            //$('#paramNum').html($('.sortable').length)
            //$('#progressBarBox').html("")
            //$('#getAllParams').show()
        }
    }
}

exports.JQueryParameterRenderer = JQueryParameterRenderer;
