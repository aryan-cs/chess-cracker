console.log("Move generation script loaded...");

function move(from, to, captured, promoted, flag) {

    return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);

}

function add_capture_move (move) {

    gameboard.move_list[gameboard.move_list_start[gameboard.play + 1]] = move;
    gameboard.move_scores[gameboard.move_list_start[gameboard.play + 1]++] = 0;

}

function add_normal_move (move) {

    gameboard.move_list[gameboard.move_list_start[gameboard.play + 1]] = move;
    gameboard.move_scores[gameboard.move_list_start[gameboard.play + 1]++] = 0;

}

function add_en_passant_move (move) {

    gameboard.move_list[gameboard.move_list_start[gameboard.play + 1]] = move;
    gameboard.move_scores[gameboard.move_list_start[gameboard.play + 1]++] = 0;

}

function add_white_pawn_capture_move (from, to, captured) {

    if (ranks_board[from] == ranks.rank_7) {

        add_capture_move(move(from, to, captured, pieces.wQ, 0));
        add_capture_move(move(from, to, captured, pieces.wR, 0));
        add_capture_move(move(from, to, captured, pieces.wB, 0));
        add_capture_move(move(from, to, captured, pieces.wN, 0));

    }

    else { add_capture_move(move(from, to, captured, pieces.empty, 0)); }

}

function add_black_pawn_capture_move (from, to, captured) {

    if (ranks_board[from] == ranks.rank_2) {

        add_capture_move(move(from, to, captured, pieces.bQ, 0));
        add_capture_move(move(from, to, captured, pieces.bR, 0));
        add_capture_move(move(from, to, captured, pieces.bB, 0));
        add_capture_move(move(from, to, captured, pieces.bN, 0));

    }

    else { add_capture_move(move(from, to, captured, pieces.empty, 0)); }

}

function add_white_pawn_normal_move (from, to) {

    if (ranks_board[from] == ranks.rank_7) {

        add_normal_move(move(from, to, pieces.empty, pieces.wQ, 0));
        add_normal_move(move(from, to, pieces.empty, pieces.wR, 0));
        add_normal_move(move(from, to, pieces.empty, pieces.wB, 0));
        add_normal_move(move(from, to, pieces.empty, pieces.wN, 0));

    } else { add_normal_move(move(from, to, pieces.empty, pieces.empty, 0)); }

}

function add_black_pawn_normal_move (from, to) {

    if (ranks_board[from] == ranks.rank_2) {

        add_normal_move(move(from, to, pieces.empty, pieces.bQ, 0));
        add_normal_move(move(from, to, pieces.empty, pieces.bR, 0));
        add_normal_move(move(from, to, pieces.empty, pieces.bB, 0));
        add_normal_move(move(from, to, pieces.empty, pieces.bN, 0));

    } else { add_normal_move(move(from, to, pieces.empty, pieces.empty, 0)); }

}

function generate_moves () {

    gameboard.move_list_start[gameboard.play + 1] = gameboard.move_list_start[gameboard.play];
	
	var piece_type, piece_number, square, p_index, pce, target_square, direction;
	
	if (gameboard.side == colors.white) {

		piece_type = pieces.wP;
		
		for (piece_number = 0; piece_number < gameboard.piece_number[piece_type]; ++piece_number) {

			square = gameboard.piece_list[piece_index(piece_type, piece_number)];

			if (gameboard.pieces[square + 10] == pieces.empty) {

				add_white_pawn_normal_move(square, square + 10);

				if (ranks_board[square] == ranks.rank_2 && gameboard.pieces[square + 20] == pieces.empty) {

					add_normal_move(move(square, square + 20, pieces.empty, pieces.empty, move_flag_pawn_start));

				}

			}
			
			if (square_off_board(square + 9) == bool.false && piece_color[gameboard.pieces[square + 9]] == colors.black) {

				add_white_pawn_capture_move(square, square + 9, gameboard.pieces[square + 9]);

			}
			
			if (square_off_board(square + 11) == bool.false && piece_color[gameboard.pieces[square + 11]] == colors.black) {

				add_white_pawn_capture_move(square, square + 11, gameboard.pieces[square + 11]);

			}			
			
			if (gameboard.en_passant != squares.no_square) {
				
				if (square + 9 == gameboard.en_passant) {

					add_en_passant_move(move(square, square + 9, pieces.empty, pieces.empty, move_flag_en_passant));

				}
				
				if (square + 11 == gameboard.en_passant) {

					add_en_passant_move(move(square, square + 11, pieces.empty, pieces.empty, move_flag_en_passant));
                    
				}
				
			}			
			
		}
		
		if (gameboard.castle_perm & castle.wkca) {			
			
			if (gameboard.pieces[squares.f1] == pieces.empty && gameboard.pieces[squares.g1] == pieces.empty) {
				
				if (square_attacked(squares.f1, colors.black) == bool.false && square_attacked(squares.e1, colors.black) == bool.false) {
					
					add_normal_move(move(squares.e1, squares.g1, pieces.empty, pieces.empty, move_flag_castling));
					
				}
				
			}
			
		}
		
		if (gameboard.castle_perm & castle.wqca) {
			
			if (gameboard.pieces[squares.d1] == pieces.empty && gameboard.pieces[squares.c1] == pieces.empty && gameboard.pieces[squares.b1] == pieces.empty) {
				
				if (square_attacked(squares.d1, colors.black) == bool.false && square_attacked(squares.e1, colors.black) == bool.false) {
					
					add_normal_move(move(squares.e1, squares.c1, pieces.empty, pieces.empty, move_flag_castling));
					
				}
				
			}
			
		}		

	}

	else {

		piece_type = pieces.bP;
		
		for (piece_number = 0; piece_number < gameboard.piece_number[piece_type]; ++piece_number) {

			square = gameboard.piece_list[piece_index(piece_type, piece_number)];

			if (gameboard.pieces[square - 10] == pieces.empty) {

				add_black_pawn_normal_move(square, square - 10);

				if (ranks_board[square] == ranks.rank_7 && gameboard.pieces[square - 20] == pieces.empty) {

					add_normal_move(move(square, square - 20, pieces.empty, pieces.empty, move_flag_pawn_start));

				}

			}
			
			if (square_off_board(square - 9) == bool.false && piece_color[gameboard.pieces[square - 9]] == colors.white) {
				
				add_black_pawn_capture_move(square, square - 9, gameboard.pieces[square - 9]);
				
			}
			
			if (square_off_board(square - 11) == bool.false && piece_color[gameboard.pieces[square - 11]] == colors.white) {
				
				add_black_pawn_capture_move(square, square - 11, gameboard.pieces[square - 11]);
				
			}			
			
			if (gameboard.en_passant != squares.no_square) {
				
				if (square - 9 == gameboard.en_passant) {
					
					add_en_passant_move(move(square, square - 9, pieces.empty, pieces.empty, move_flag_en_passant));
					
				}
				
				if (square - 11 == gameboard.en_passant) {
					
					add_en_passant_move(move(square, square - 11, pieces.empty, pieces.empty, move_flag_en_passant));
					
				}
				
			}
			
		}
		
		if (gameboard.castle_perm & castle.bkca) {
			
			if (gameboard.pieces[squares.f8] == pieces.empty && gameboard.pieces[squares.g8] == pieces.empty) {
				
				if (square_attacked(squares.f8, colors.white) == bool.false && square_attacked(squares.e8, colors.white) == bool.false) {
					
					add_normal_move(move(squares.e8, squares.g8, pieces.empty, pieces.empty, move_flag_castling));
					
				}
				
			}
			
		}
		
		if (gameboard.castle_perm & castle.bqca) {
			
			if (gameboard.pieces[squares.d8] == pieces.empty && gameboard.pieces[squares.c8] == pieces.empty && gameboard.pieces[squares.b8] == pieces.empty) {
				
				if (square_attacked(squares.d8, colors.white) == bool.false && square_attacked(squares.e8, colors.white) == bool.false) {
					
					add_normal_move( move(squares.e8, squares.c8, pieces.empty, pieces.empty, move_flag_castling));
					
				}
				
			}
			
		}
		
	}
	
	p_index = loop_nonslide_index[gameboard.side];
	pce = loop_nonslide_pieces[p_index++];
	
	while (pce != 0) {
		
		for (piece_number = 0; piece_number < gameboard.piece_number[pce]; ++piece_number) {
			
			square = gameboard.piece_list[piece_index(pce, piece_number)];
			
			for (index = 0; index < direction_number[pce]; index++) {
				
				direction = piece_direction[pce][index];
				target_square = square + direction;
				
				if (square_off_board(target_square) == bool.true) { continue; }
				
				if (gameboard.pieces[target_square] != pieces.empty) {
					
					if (piece_color[gameboard.pieces[target_square]] != gameboard.side) {
						
						add_capture_move(move(square, target_square, gameboard.pieces[target_square], pieces.empty, 0));
						
					}
					
				}
				
				else { add_normal_move( move(square, target_square, pieces.empty, pieces.empty, 0)); }
				
			}		
			
		}
		
		pce = loop_nonslide_pieces[p_index++];
		
	}
	
	p_index = loop_slide_index[gameboard.side];
	pce = loop_slide_pieces[p_index++];
	
	while (pce != 0) {

		for (piece_number = 0; piece_number < gameboard.piece_number[pce]; ++piece_number) {

			square = gameboard.piece_list[piece_index(pce, piece_number)];
			
			for (index = 0; index < direction_number[pce]; index++) {

				direction = piece_direction[pce][index];
				target_square = square + direction;
				
				while (square_off_board(target_square) == bool.false ) {

					if (gameboard.pieces[target_square] != pieces.empty) {

						if (piece_color[gameboard.pieces[target_square]] != gameboard.side) {

							add_capture_move(move(square, target_square, gameboard.pieces[target_square], pieces.empty, 0));

						}

						break;

					}

					add_normal_move(move(square, target_square, pieces.empty, pieces.empty, 0));
					target_square += direction;

				}

			}

		}

		pce = loop_slide_pieces[p_index++];

	}

}