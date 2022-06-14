console.log("Input/Output script loaded...");

function print_square(square) {

    return (file_characters[files_board[square]] + rank_characters[ranks_board[square]]);

}

function print_move (move) {

    var ff = files_board[from_square(move)]; // file from
    var rf = ranks_board[from_square(move)]; // rank from
    var ft = files_board[to_square(move)]; // file to
    var rt = ranks_board[to_square(move)]; // rank to

    // console.log("ff", ff, "rf", rf, "ft", ft, "rt", rt);

    move_string = file_characters[ff] + rank_characters[rf] + file_characters[ft] + rank_characters[rt];

    var promoted = promoted_piece(move);

    if (promoted != pieces.empty) {

        var piece_character = "q";

        if (piece_knight[promoted] == bool.true) {

            piece_character = "n";

        } else if (piece_rook_queen[promoted] == bool.true && piece_bishop_queen[promoted] == bool.false) {

            piece_character = "r";

        } else if (piece_rook_queen[promoted] == bool.false && piece_bishop_queen[promoted] == bool.true) {
                
            piece_character = "b";

        }

        move_string += piece_character;

    }

    if (ff > 99 || rf > 99 || ft > 99 || rt > 99) { return "undefined"; }

    else { return move_string; }


}

function print_move_list () {

    var index, move;

    // kinda hacky, idk why this is needed
    // problem with gameboard.move_list having random numbers

    normal = [];

    for (index = gameboard.move_list_start[gameboard.play]; index < gameboard.move_list_start[gameboard.play + 1] && normal.length <= 19; ++index) {

        move = gameboard.move_list[index];

        if (print_move(move) != "undefined") { normal.push(move); }

    }

    gameboard.move_list = new Array(max_depth * max_position_moves);

    for (item = 0; item < normal.length; item++) { gameboard.move_list[item] = normal[item] }

    for (index = gameboard.move_list_start[gameboard.play]; index < gameboard.move_list_start[gameboard.play + 1]; ++index) {

        move = gameboard.move_list[index];

        if (print_move(move) != "undefined") { console.log(print_move(move)); }

    }

}