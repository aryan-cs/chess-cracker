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

function deselect_square (div) { document.getElementsByClassName("square_div")[div].style.outline = "none"; }

function select_square (id) {

    document.getElementById(id).style.outline = "4px solid " + accent;

    selected_square = document.getElementById(id);

    console.log(selected_square);

}

function remove (piece) { return piece.removeChild(piece.getElementsByTagName("img")[0]); }

function add (piece, to) { return to.appendChild(piece); }

function swap (piece, to) { return to.appendChild(remove(piece)); }

function to_file_rank (id) { return document.getElementById((String.fromCharCode(parseInt(id.toString().charAt(1)) + 96)) + (id.toString().charAt(0) - 1)); }

function square_clicked (id) {

    for (var div = 0; div < document.getElementsByClassName("square_div").length; div++) { deselect_square(div); }

    select_square(id);

    selected_piece = selected_square.getElementsByTagName("img")[0];
    if (user_move.from == squares.no_square) { user_move.from = fr2sq(id.charCodeAt(0) - 97, id.charAt(1) - 1); }
    else { user_move.to = fr2sq(id.charCodeAt(0) - 97, id.charAt(1) - 1); make_user_move(); }
    
}

function make_user_move () {

    if (user_move.from !== squares.no_square && user_move.to !== squares.no_square) {

        var parsed = parse_move(user_move.from, user_move.to);
        console.log("PARSE " + parsed);

        if (parsed != no_move) {

            make_move(parsed);
            print_board();
            move_gui_piece(parsed);

        }

        user_move.from = squares.no_square;
        user_move.to = squares.no_square;

        selected_piece = null;

    }

}

function move_gui_piece (move) {

    var from = from_square(move);
    var to = to_square(move);

    if (move & move_flag_en_passant) {

        var en_passant_remove;

        if (gameboard.side == colors.black) { en_passant_remove = to - 10; }

        else { en_passant_remove = to + 10; }

        remove(to_file_rank(en_passant_remove));

    }

    else if (captured(move)) { remove(to_file_rank(to)); }

    console.log(move_flag_castling)
    console.log(move)
    console.log(move & move_flag_castling)

    if (move & move_flag_castling) {

        console.log("castle!!!!!!!!!!!!!!!!!!!!!!!!")

        switch (to) {

            case squares.g1: remove(squares.h1); add(pieces.wR, squares.f1); break;
            case squares.c1: remove(squares.a1); add(pieces.wR, squares.d1); break;
            case squares.g8: remove(squares.h8); add(pieces.bR, squares.f8); break;
            case squares.c8: remove(squares.a8); add(pieces.bR, squares.d8); break;

        }

    }

    else if (promoted_piece(move)) { swap(to, promoted_piece(move)); }

    else { console.log("yo"); swap(to_file_rank(from), to_file_rank(to)); }

}

$(document).on("click", ".square_div", function (event) { square_clicked(event.currentTarget.id); });
