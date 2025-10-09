

// datatable
$(document).ready(function() {
    $('.datatable').DataTable({
        responsive: false
    });
    $(".dataTables_length select").addClass('form-select form-select-sm');
});


// flatpicker

flatpickr('.datepicker-range', {
    mode: "range",
    altInput: true,
    wrap: true
});