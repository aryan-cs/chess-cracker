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
    gameboard.pieces[to] = piece;

    for (index = 0; index < gameboard.piece_number[piece]; ++index) {

        if (gameboard.piece_list[piece_index(piece, index)] == from) {

            gameboard.piece_list[piece_index(piece, index)] = to;
            break;

        }

    }

}

function make_move (move) {
	
	var from = from_square(move);
    var to = to_square(move);
    var side = gameboard.side;	

	gameboard.history[gameboard.history_play].posKey = gameboard.posKey;

	if ((move & move_flag_en_passant) != 0) {

		if (side == colors.white) { clear_piece (to - 10); }
        else { clear_piece (to + 10); }

	}
    
    else if ((move & move_flag_castling) != 0) {

		switch (to) {

			case squares.c1: move_piece(squares.a1, squares.d1); break;
            case squares.c8: move_piece(squares.a8, squares.d8); break;
            case squares.g1: move_piece(squares.h1, squares.f1); break;
            case squares.g8: move_piece(squares.h8, squares.f8); break;
            default: break;

		}
	}
	
	if (gameboard.en_passant != squares.no_squareuare) { hash_en_passant(); }

	hash_castle();
	
	gameboard.history[gameboard.history_play].move = move;
    gameboard.history[gameboard.history_play].move_rule = gameboard.move_rule;
    gameboard.history[gameboard.history_play].en_passant = gameboard.en_passant;
    gameboard.history[gameboard.history_play].castle_perm = gameboard.castle_perm;
    
    gameboard.castle_perm &= castle_perm[from];
    gameboard.castle_perm &= castle_perm[to];
    gameboard.en_passant = squares.no_square;
    
    hash_castle();
    
    var cap = captured  (move);
    gameboard.move_rule++;
    
    if(cap != pieces.empty) {

        clear_piece (to);
        gameboard.move_rule = 0;

    }
    
    gameboard.history_play++;
	gameboard.play++;
	
	if (piece_pawn[gameboard.pieces[from]] == bool.true) {

        gameboard.move_rule = 0;
        if ((move & move_flag_pawn_start) != 0) {

            if (side == colors.white) { gameboard.en_passant = from + 10; }
            else { gameboard.en_passant = from - 10; }
            hash_en_passant();

        }
    }
    
    move_piece(from, to);
    
    var promo_piece = promoted_piece(move);

    if (promo_piece != pieces.empty)   {   

        clear_piece(to);
        add_piece(to, promo_piece);

    }
    
    gameboard.side ^= 1;
    hash_side();
    
    if (square_attacked(gameboard.piece_list[piece_index(kings[side], 0)], gameboard.side))  {

        take_move();
    	return bool.false;

    }
    
    return bool.true;

}

function take_move () {

    gameboard.history_play--;
    gameboard.play--;
    
    var move = gameboard.history[gameboard.history_play].move;
	var from = from_square(move);
    var to = to_square(move);
    
    if (gameboard.en_passant != squares.no_square) { hash_en_passant(); }
    hash_castle();
    
    gameboard.castle_perm = gameboard.history[gameboard.history_play].castle_perm;
    gameboard.move_rule = gameboard.history[gameboard.history_play].move_rule;
    gameboard.en_passant = gameboard.history[gameboard.history_play].en_passant;
    
    if (gameboard.en_passant != squares.no_square) hash_en_passant();
    hash_castle();
    
    gameboard.side ^= 1;
    hash_side();
    
    if ((move & move_flag_en_passant) != 0) {

		if (gameboard.side == colors.white) { add_piece (to - 10, pieces.bP); }
        else { add_piece (to + 10, pieces.wP); }

	}
    
    else if ((move & move_flag_castling) != 0) {

		switch (to) {

			case squares.c1: move_piece(squares.d1, squares.a1); break;
            case squares.c8: move_piece(squares.d8, squares.a8); break;
            case squares.g1: move_piece(squares.f1, squares.h1); break;
            case squares.g8: move_piece(squares.f8, squares.h8); break;
            default: break;

		}
	}
    
    move_piece(to, from);
    
    var cap = captured (move);
    if (cap != pieces.empty) { add_piece(to, cap); }
    
    if (promoted_piece(move) != pieces.empty) {

        clear_piece(from);
        add_piece(from, (piece_color[promoted_piece(move)] == colors.white ? pieces.wP : pieces.bP));

    }
    
}