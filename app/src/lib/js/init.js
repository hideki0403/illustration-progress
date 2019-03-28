const ipcRenderer = require('electron').ipcRenderer

$(document).ready(function () {
    $('.tabs').tabs()
})

$(document).ready(function () {
    $('select').formSelect();
})

$(document).ready(function () {
    $('.fixed-action-btn').floatingActionButton();
})

function button_enable() {
    $('#i-save-btn').removeClass('grey lighten-1')
    $('#i-save-btn').addClass('pulse red waves-effect waves-light')
}

$('#i-software').change(function () {
    edit($('option:selected').val())
    button_enable()
})

function edit(r) {
    $('#i-version').children().remove()
    $('#i-profile').children().remove()
    
    if (r === '1') {
        $('#i-version').prop('disabled', false)
        $('#i-version').append($('<option>').attr({ value: '1' }).text('PRO'))
        $('#i-version').append($('<option>').attr({ value: '2' }).text('EX'))
        $('#i-version').append($('<option>').attr({ value: '3' }).text('DEBUT'))
    } else {
        $("#i-version").prop('disabled', true)
        $('#i-version').append($('<option value="0" disabled selected>候補がありません</option>'))
    }

    if (r === '1' || r === '3') {
        $('#i-profile').prop('disabled', false)
        $('#i-profile').append($('<option>').attr({ value: '1' }).text('デフォルト'))
        $('#i-profile').append($('<option>').attr({ value: '2' }).text('カスタム'))
    } else {
        $('#i-profile').prop('disabled', true)
        $('#i-profile').append($('<option value="1" disabled selected>デフォルト</option>'))
    }
}

$('#i-version').change(function() {
    button_enable()
})

$('#i-profile').change(function () {
    button_enable()
})

function save_settings() {
    $('#i-save-btn').removeClass('pulse red waves-effect waves-light')
    $('#i-save-btn').addClass('grey lighten-1')

    var settings = {
        software: $('#i-software').val(),
        version: $('#i-version').val(),
        icon: $('#i-profile').val()
    }

    ipcRenderer.send('settingsData', settings)
}

function update_status() {
    var datas = {
        state: $('#m-state').val(),
        name: $('#m-details').val()
    }

    ipcRenderer.send('updateStatus', datas)
}

ipcRenderer.on('settings', (event, arg) => {
    edit(arg.software)
    $('#i-software').val(arg.software),
    $('#i-version').val(arg.version),
    $('#i-profile').val(arg.icon)
})