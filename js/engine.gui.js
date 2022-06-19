console.log("GUI script loaded...");

$("#set_to_fen").click(function () {

    var key = $("#fenID").val();
    parse_fen(key);
    print_board();
    perft_test(5);

});
