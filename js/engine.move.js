console.log("Move making script loaded...");

function clear_piece (square) {

    var piece = gameboard.pieces[square];
    var color = piece_color[piece];
    var index;
    var target_piece_number = -1;

    hash_piece(piece, square);

    gameboard.pieces[square] = pieces.empty;
    gameboard.material[color] -= piece_value[piece];

    for (index = 0; index < gameboard.piece_number[piece]; ++index) {

        if (gameboard.piece_list[piece_index(piece, index)] == square) {

            target_piece_number = index;
            break;

        }

    }

    gameboard.piece_number[piece]--;
    gameboard.piece_list[piece_index(piece, target_piece_number)] = gameboard.piece_list[piece_index(piece, gameboard.piece_number[piece])];

}

function add_piece (square, piece) {

    var color = piece_color[piece];

    hash_piece(pieces, square);

    gameboard.pieces[square] = piece;
    gameboard.material[color] += piece_value[piece];
    gameboard.piece_list[piece_index(piece, gameboard.piece_number[piece])] = square;
    gameboard.piece_number[piece]++;

}

function move_piece (from, to) {

    var index = 0;
    var piece = gameboard.pieces[from];

    hash_piece(piece, from);
    gameboard.pieces[from] = pieces.empty;

    hash_piece(piece, to);
    gameboard.pieces[to] = piece;s

    for (index = 0; index < gameboard.piece_number[piece]; ++index) {

        if (gameboard.piece_list[piece_index(piece, index)] == from) {

            gameboard.piece_list[piece_index(piece, index)] = to;
            break;

        }

    }

}

function make_move (move) {



}