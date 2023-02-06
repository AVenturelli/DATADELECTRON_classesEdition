class ReloadButton {
    constructor(props) {

    }

    static setUp(){
        $('#realoadPage').on('click', () =>{
            this.reload();
        })
    }

    static reload(){
        location.reload();
    }
}
exports.ReloadButton = ReloadButton