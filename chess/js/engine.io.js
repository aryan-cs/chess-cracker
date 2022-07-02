console.log("Input/Output script loaded...");

function print_square(square) {

    return (file_characters[files_board[square]] + rank_characters[ranks_board[square]]);

}

function print_move (move) {

    var ff = files_board[from_square(move)]; // file from
    var rf = ranks_board[from_square(move)]; // rank from
    var ft = files_board[to_square(move)]; // file to
    var rt = ranks_board[to_square(move)]; // rank to

    move_string = file_characters[ff] + rank_characters[rf] + file_characters[ft] + rank_characters[rt];

    var promoted = promoted_piece(move);

    if (promoted != pieces.empty) {

        var piece_character = "q";

        if (piece_knight[promoted] == bool.true) { piece_character = "n"; }
        
        else if (piece_rook_queen[promoted] == bool.true && piece_bishop_queen[promoted] == bool.false) { piece_character = "r"; }
        
        else if (piece_rook_queen[promoted] == bool.false && piece_bishop_queen[promoted] == bool.true) { piece_character = "b"; }

        move_string += piece_character;

    }

    else { return move_string; }


}

function print_move_list () {

    var index, move;

    for (index = gameboard.move_list_start[gameboard.play]; index < gameboard.move_list_start[gameboard.play + 1]; ++index) {

        move = gameboard.move_list[index];

        console.log(print_move(move));s

    }

}

function parse_move (from, to) {

    generate_moves();
	
	var move = no_move;
	var promo_piece = pieces.empty;
	var found = bool.false;
	
	for (index = gameboard.move_list_start[gameboard.play]; index < gameboard.move_list_start[gameboard.play + 1]; ++index) {

		move = gameboard.move_list[index];

        console.log(move)

		if (from_square(move) == from && to_square(move) == to) {

			promo_piece = promoted_piece(move);
            console.log(promo_piece)
            console.log("HELLLLOOO")

			if (promo_piece != pieces.empty) {

				if ((promo_piece == pieces.wQ && gameboard.side == colors.white)
                 || (promo_piece == pieces.bQ && gameboard.side == colors.black)) { found = bool.true; break; }

				continue;

			}

			found = bool.true; break;

		}		

	}
	
	if (found != bool.false) {
        
        if (make_move(move) == bool.false) { return no_move; }

		take_move();
		return move;

	}
	
	return no_move;

}