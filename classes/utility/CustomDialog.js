class CustomDialog {
    #idHook
    #title
    #text
    #option
    hook

    constructor(buttonIdHook, title, text, option, hook) {
        this.#idHook = buttonIdHook;
        this.#title = title;
        this.#option = option;
        this.hook = hook;
        this.#text = text;
    }

    printCode() {
        document.getElementById('modals').innerHTML +=
            '<div class="modal" style="z-index:9999"" id="' + this.#idHook + '"  tabindex="-1" role="dialog">\n' +
            '  <div class="modal-dialog" role="document">\n' +
            '    <div class="modal-content" style="width: 100% !important;">\n' +
            '      <div class="modal-header">\n' +
            '        <h5 class="modal-title">' + this.#title + '</h5>\n' +
            '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
            '          <span aria-hidden="true">&times;</span>\n' +
            '        </button>\n' +
            '      </div>\n' +
            '      <div class="modal-body">\n' +
            '        <p>' + this.#text + '</p>\n' +
            '      </div>\n' +
            '      <div class="modal-footer">\n' +
            '        <button type="button" id="option_' + this.#idHook + '"  class="btn btn-primary">' + this.#option + '</button>\n' +
            '        <button type="button" id="option_' + this.#idHook + '_close" class="btn btn-secondary">Close</button>\n' +
            '      </div>\n' +
            '    </div>\n' +
            '  </div>\n' +
            '</div>\n'
        ;

        let close = $('#option_' + this.#idHook + '_close');
        close.on('click', () => {
            $('#' + this.#idHook).remove()
            $('.modal-backdrop').hide()
        });

        $('#option_' + this.#idHook).on('click', this.hook);
    }

    showAlert() {
        $('#' + this.#idHook).modal('show')
    }
}

exports.CustomDialog = CustomDialog;
