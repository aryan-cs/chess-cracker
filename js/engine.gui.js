console.log("GUI script loaded...");

$("#set_to_fen").click(function () {

    var key = $("#fenID").val();
    parse_fen(key);
    print_board();
    new_game(key);

});

function new_game (fen_string) {

    clear_board();
    parse_fen(fen_string);
    print_board();
    update_board();

}

function clear_board () { $(".square_div").remove(); }

function update_board () {

    var top = 0; left = 0;

    for (var f = 0; f < 8; f++) {

        for (var r = 0; r < 8; r++) {

            var square_div = document.createElement("div");
            var file_rank = document.createElement("p");

            square_div.className = "square_div rank_" + String.fromCharCode(r + 97) + " file_" + (f + 1);
            square_div.id = String.fromCharCode(r + 97) + "" + (f + 1);
            square_div.style.top = top + "px";
            square_div.style.left = left + "px";

            file_rank.innerHTML = String.fromCharCode(r + 97) + (f + 1);
            file_rank.className = "square_info";

            if ((f + r) % 2 !== 1) { file_rank.style.color = dark_grey; }

            set_pieces(square_div, (64 - ((f + 1) * 8) + r));

            document.getElementById("squares_holder").appendChild(square_div);
            document.getElementById(square_div.id).appendChild(file_rank);

            left += square.width;

        }

        top += square.height;
        left = 0;

    }

}
