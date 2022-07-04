console.log("Move generation script loaded...");

var mvv_lva_values = [0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600];
var mvv_lva_scores = new Array(14 * 14);

function init_mvv_lva () {
	var attacker, victim;
	
	for (attacker = pieces.wP; attacker <= pieces.bK; ++attacker) {

		for (victim = pieces.wP; victim <= pieces.bK; ++victim) {

			mvv_lva_scores[victim * 14 + attacker] = mvv_lva_values[victim] + 6 - (mvv_lva_values[attacker] / 100);

		}

	}

}

function move_exists (move) {
	
	generate_moves();
    
	var index, move_found = no_move;

	for (index = gameboard.move_list_start[gameboard.play]; index < gameboard.move_list_start[gameboard.play + 1]; ++index) {
	
		move_found = gameboard.move_list[index];

		if (make_move(move_found) == bool.false) { continue; }

		take_move();

		if (move == move_found) { return bool.true; }

	}

	return bool.false;

}

function move (from, to, captured, promoted, flag) { return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag); }

function add_capture_move (move) {

	gameboard.move_list[gameboard.move_list_start[gameboard.play + 1]] = move;
	gameboard.move_scores[gameboard.move_list_start[gameboard.play + 1]++] =  
	mvv_lva_scores[captured(move) * 14 + gameboard.pieces[from_square(move)]] + 1000000;

}

function add_normal_move (move) {

	gameboard.move_list[gameboard.move_list_start[gameboard.play + 1]] = move;
	gameboard.move_scores[gameboard.move_list_start[gameboard.play + 1]] =  0;
	
	if (move == gameboard.search_killers[gameboard.play]) {
		gameboard.move_scores[gameboard.move_list_start[gameboard.play + 1]] = 900000;
	}
	
	else if (move == gameboard.search_killers[gameboard.play + max_depth]) {
		gameboard.move_scores[gameboard.move_list_start[gameboard.play + 1]] = 800000;
	}
	
	else {
		gameboard.move_scores[gameboard.move_list_start[gameboard.play + 1]] = 
		gameboard.search_history[gameboard.pieces[from_square(move)] * board_square_number + to_square(move)];
	}
	
	gameboard.move_list_start[gameboard.play + 1]++;

}

function add_en_passant_move (move) {

	gameboard.move_list[gameboard.move_list_start[gameboard.play + 1]] = move;
	gameboard.move_scores[gameboard.move_list_start[gameboard.play + 1]++] = 105 + 1000000;

}

function add_white_pawn_capture_move (from, to, capture) {
	
	if (ranks_board[from] == ranks.rank_7) {

		add_capture_move(move(from, to, capture, pieces.wQ, 0));
		add_capture_move(move(from, to, capture, pieces.wR, 0));
		add_capture_move(move(from, to, capture, pieces.wB, 0));
		add_capture_move(move(from, to, capture, pieces.wN, 0));

	}
	
	else { add_capture_move(move(from, to, capture, pieces.empty, 0)); }

}

function add_black_pawn_capture_move (from, to, capture) {

	if (ranks_board[from] == ranks.rank_2) {

		add_capture_move(move(from, to, capture, pieces.bQ, 0));
		add_capture_move(move(from, to, capture, pieces.bR, 0));
		add_capture_move(move(from, to, capture, pieces.bB, 0));
		add_capture_move(move(from, to, capture, pieces.bN, 0));	

	}
	
	else { add_capture_move(move(from, to, capture, pieces.empty, 0)); }

}

function add_white_pawn_normal_move (from, to) {

	if (ranks_board[from] == ranks.rank_7) {

		add_normal_move(move(from,to,pieces.empty,pieces.wQ,0));
		add_normal_move(move(from,to,pieces.empty,pieces.wR,0));
		add_normal_move(move(from,to,pieces.empty,pieces.wB,0));
		add_normal_move(move(from,to,pieces.empty,pieces.wN,0));

	}
	
	else { add_normal_move(move(from,to,pieces.empty,pieces.empty,0)); }

}

function add_black_pawn_normal_move (from, to) {

	if (ranks_board[from] == ranks.rank_2) {
		add_normal_move(move(from,to,pieces.empty,pieces.bQ,0));
		add_normal_move(move(from,to,pieces.empty,pieces.bR,0));
		add_normal_move(move(from,to,pieces.empty,pieces.bB,0));
		add_normal_move(move(from,to,pieces.empty,pieces.bN,0));
	}
	
	else { add_normal_move(move(from,to,pieces.empty,pieces.empty,0)); }

}

function generate_moves() {

	gameboard.move_list_start[gameboard.play + 1] = gameboard.move_list_start[gameboard.play];
	
	var type;
	var piece_number;
	var square;
	var p_index;
	var piece;
	var target_square;
	var direction;
	
	if (gameboard.side == colors.white) {

		type = pieces.wP;
		
		for (piece_number = 0; piece_number < gameboard.piece_number[type]; ++piece_number) {

			square = gameboard.piece_list[piece_index(type, piece_number)];	

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

		type = pieces.bP;
		
		for (piece_number = 0; piece_number < gameboard.piece_number[type]; ++piece_number) {

			square = gameboard.piece_list[piece_index(type, piece_number)];

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

			if (gameboard.pieces[squares.D8] == pieces.empty && gameboard.pieces[squares.C8] == pieces.empty && gameboard.pieces[squares.B8] == pieces.empty) {
				
				if (square_attacked(squares.D8, colors.white) == bool.false && square_attacked(squares.e8, colors.white) == bool.false) {
					
					add_normal_move(move(squares.e8, squares.C8, pieces.empty, pieces.empty, move_flag_castling));

				}

			}

		}	

	}	
	
	p_index = loop_nonslide_index[gameboard.side];
	piece = loop_nonslide_pieces[p_index++];
	
	while (piece != 0) {

		for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {

			square = gameboard.piece_list[piece_index(piece, piece_number)];
			
			for (index = 0; index < direction_number[piece]; index++) {

				direction = piece_direction[piece][index];
				target_square = square + direction;
				
				if (square_off_board(target_square) == bool.true) { continue; }
				
				if (gameboard.pieces[target_square] != pieces.empty) {

					if (piece_color[gameboard.pieces[target_square]] != gameboard.side) {

						add_capture_move(move(square, target_square, gameboard.pieces[target_square], pieces.empty, 0));

					}

				}
				
				else { add_normal_move(move(square, target_square, pieces.empty, pieces.empty, 0)); }
			
			}

		}

		piece = loop_nonslide_pieces[p_index++];

	}
	
	p_index = loop_slide_index[gameboard.side];
	piece = loop_slide_pieces[p_index++];
	
	while (piece != 0) {		

		for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {

			square = gameboard.piece_list[piece_index(piece, piece_number)];
			
			for (index = 0; index < direction_number[piece]; index++) {

				direction = piece_direction[piece][index];
				target_square = square + direction;
				
				while (square_off_board(target_square) == bool.false) {	
				
					if (gameboard.pieces[target_square] != pieces.empty) {

						if (piece_color[gameboard.pieces[target_square]] != gameboard.side) {

							add_capture_move(move(square, target_square, gameboard.pieces[target_square], pieces.empty, 0));

						}

						break;

					}

					add_normal_move(move(square, target_square, pieces.empty, pieces.empty, 0));
					target_square  += direction;

				}

			}

		}	

		piece = loop_slide_pieces[p_index++];

	}

}

function generate_captures () {

	gameboard.move_list_start[gameboard.play + 1] = gameboard.move_list_start[gameboard.play];
	
	var type, piece_number, square, p_index, piece, target_square, direction;
	
	if (gameboard.side == colors.white) {

		type = pieces.wP;
		
		for (piece_number = 0; piece_number < gameboard.piece_number[type]; ++piece_number) {

			square = gameboard.piece_list[piece_index(type, piece_number)];				
			
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

	}
	
	else {

		type = pieces.bP;
		
		for (piece_number = 0; piece_number < gameboard.piece_number[type]; ++piece_number) {

			square = gameboard.piece_list[piece_index(type, piece_number)];			
			
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

	}	
	
	p_index = loop_nonslide_index[gameboard.side];
	piece = loop_nonslide_pieces[p_index++];
	
	while (piece != 0) {

		for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {

			square = gameboard.piece_list[piece_index(piece, piece_number)];
			
			for (index = 0; index < direction_number[piece]; index++) {

				direction = piece_direction[piece][index];
				target_square = square + direction;
				
				if (square_off_board(target_square) == bool.true) { continue; }
				
				if (gameboard.pieces[target_square] != pieces.empty) {

					if (piece_color[gameboard.pieces[target_square]] != gameboard.side) {

						add_capture_move(move(square, target_square, gameboard.pieces[target_square], pieces.empty, 0));

					}

				}

			}	

		}	

		piece = loop_nonslide_pieces[p_index++];

	}
	
	p_index = loop_slide_index[gameboard.side];
	piece = loop_slide_pieces[p_index++];
	
	while (piece != 0) {		

		for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {

			square = gameboard.piece_list[piece_index(piece, piece_number)];
			
			for (index = 0; index < direction_number[piece]; index++) {

				direction = piece_direction[piece][index];
				target_square = square + direction;
				
				while (square_off_board(target_square) == bool.false) {	
				
					if (gameboard.pieces[target_square] != pieces.empty) {

						if (piece_color[gameboard.pieces[target_square]] != gameboard.side) {

							add_capture_move(move(square, target_square, gameboard.pieces[target_square], pieces.empty, 0));

						}

						break;

					}
					target_square  += direction;

				}

			}	

		}	

		piece = loop_slide_pieces[p_index++];

	}
	
}