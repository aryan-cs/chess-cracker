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

function square_has_piece (id) { return document.getElementById(id).childNodes.length > 1; }

function deselect_square (div) { document.getElementsByClassName("square_div")[div].style.outline = "none"; }

function select_square (id) {

    if (square_has_piece(id) > 1) {

        if (!document.getElementById(id).firstChild.classList.contains("darken")) {
        
            document.getElementById(id).style.outline = "4px solid " + accent;
            selected_square = document.getElementById(id);
            selected_piece = selected_square.getElementsByTagName("img")[0];

            console.log(selected_piece);
    
        }

    }

    else { document.getElementById(id).style.outline = "4px solid " + accent; }

}

function remove (piece) { return piece.removeChild(piece.getElementsByTagName("img")[0]); }

function add (piece, to) { return to.appendChild(piece); }

function swap (piece, to) { return to.appendChild(remove(piece)); }

function to_file_rank (id) { return document.getElementById((String.fromCharCode(parseInt(id.toString().charAt(1)) + 96)) + (id.toString().charAt(0) - 1)); }

function square_clicked (id) {

    for (var div = 0; div < document.getElementsByClassName("square_div").length; div++) { deselect_square(div); }

    select_square(id);

    if (user_move.from == squares.no_square) { user_move.from = fr2sq(id.charCodeAt(0) - 97, id.charAt(1) - 1); }
    else { user_move.to = fr2sq(id.charCodeAt(0) - 97, id.charAt(1) - 1); make_user_move(); }
    
}

function make_user_move () {

    if (user_move.from !== squares.no_square && user_move.to !== squares.no_square && (selected_piece !== undefined || selected_piece !== null)) {

        var parsed = parse_move(user_move.from, user_move.to);

        if (parsed != no_move) {

            make_move(parsed);
            print_board();
            move_gui_piece(parsed);
            disable_pieces();

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

    if (move & move_flag_castling) {

        switch (to) {

            case squares.g1: swap(to_file_rank(squares.h1), to_file_rank(squares.f1)); swap(to_file_rank(squares.e1), to_file_rank(squares.g1)); break;
            case squares.c1: swap(to_file_rank(squares.a1), to_file_rank(squares.d1)); swap(to_file_rank(squares.e1), to_file_rank(squares.c1)); break;
            case squares.g8: swap(to_file_rank(squares.h8), to_file_rank(squares.f8)); swap(to_file_rank(squares.e8), to_file_rank(squares.g8)); break;
            case squares.c8: swap(to_file_rank(squares.a8), to_file_rank(squares.d8)); swap(to_file_rank(squares.e8), to_file_rank(squares.c8)); break;

        }

    }

    else if (promoted_piece(move)) { swap(to, promoted_piece(move)); }

    else { swap(to_file_rank(from), to_file_rank(to)); }

}

function disable_pieces () {

    if (gameboard.side == 0) { $(".square_div .black_piece").addClass("darken"); $(".square_div .white_piece").removeClass("darken"); }

    else if (gameboard.side == 1) { $(".square_div .white_piece").addClass("darken"); $(".square_div .black_piece").removeClass("darken"); }

}

$(document).on("click", ".square_div", function (event) { square_clicked(event.currentTarget.id); });
