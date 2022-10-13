/*
    SweetAlert2 js alerts.

    Reference(s):
    -- https://sweetalert2.github.io/
*/

function ShowAlert(message, type, time) {
    Swal.fire({
        icon: type,
        title: message,
        timer: time,
        width: '20%',
        toast: true,
        confirmButtonText: 'Ok',
        position: 'bottom-start',
        stopKeydownPropagation: false,
        customClass: {
            confirmButton: 'sw-confirmButton',
            title: 'sw-title'
        },
        buttonsStyling: false
    });
}