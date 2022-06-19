console.log("Algorithm search script loaded...")

var search_controller = {};

search_controller.nodes;
search_controller.fail_high;
search_controller.fail_high_first;
search_controller.depth;
search_controller.time;
search_controller.start;
search_controller.stop;
search_controller.best;
search_controller.thinking;

function clear_pv_table () {

    for (index = 0; index < pv_entries; index++) {

        gameboard.pv_table[index].move = no_move;
        gameboard.pv_table[index].position_key = 0;

    }

}

function check_up () { if (($.now() - search_controller.start ) > search_controller.time) { search_controller.stop == bool.true; } }

function is_repitition () {

	var index = 0;
	
	for (index = gameboard.history_play - gameboard.move_rule; index < gameboard.history_play - 1; ++index) {

		if (gameboard.position_key == gameboard.history[index].position_key) { return bool.true; }

	}
	
	return bool.false;

}

function alpha_beta (alpha, beta, depth) {

	if (depth <= 0) { return evaluate_position(); }
	
	if ((search_controller.nodes & 2047) == 0) { CheckUp(); }
	
	search_controller.nodes++;
	
	if ((is_repitition() || gameboard.move_rule >= 100) && gameboard.play != 0) { return 0; }
	
	if (gameboard.play > max_depth -1) { return evaluate_position(); }
	
    var in_check = square_attacked(gameboard.piece_list[piece_index(kings[gameboard.side], 0)], gameboard.side ^ 1);

    if (in_check == bool.true) { depth++; }

	var score = -infinity;
	
	generate_moves();
	
	print_move_list();
	
	var move_number = 0;
	var legal_moves = 0;
	var old_alpha = alpha;
	var best_move = no_move;
	var move = no_move;
	
	/* Get PvMove */
	/* Order PvMove */	
	
	for (move_number = gameboard.move_list_start[gameboard.play]; move_number < gameboard.move_list_start[gameboard.play + 1]; ++move_number) {
	
		/* Pick Next Best Move */
		
		move = gameboard.move_list[move_number];	

		if (make_move(move) == bool.false) { continue; }		
		legal_moves++;
		score = -alpha_beta( -beta, -alpha, depth - 1);
		
		take_move();
		
		if (search_controller.stop == bool.true) { return 0; }
		
		if (score > alpha) {

			if (score >= beta) {

				if (legal_moves == 1) { search_controller.fail_high_first++; }
				search_controller.fail_high++;				
				/* Update Killer Moves */
				
				return beta;

			}

			alpha = score;
			best_move = move;
			/* Update History Table */

		}

	}

    if (legal_moves == 0) {

        if (in_check == bool.true) { return -mate + gameboard.play; }
        else { return 0; }

    }
	
	/* Mate Check */
	
	if (alpha != old_alpha) { store_pv_move(best_move); }
	
	return alpha;

}

function clear_for_search () {

    var index = 0, index2 = 0;

    for (index = 0; index < 14; ++index) {

        gameboard.search_history[index] = 0;

    }

    for (index = 0; index < 3 * max_depth; ++index) {

        gameboard.search_killers[index] = 0;

    }

    clear_pv_table();
    gameboard.play = 0;
    search_controller.nodes = 0;
    search_controller.fail_high = 0;
    search_controller.fail_high_first = 0;
    search_controller.start = $.now();
    search_controller.stop = bool.false;

}

function search_position () {

	var best_move = no_move;
	var best_score = -infinity;
	var current_depth = 0;

    clear_for_search();
	
	for (current_depth = 1; current_depth <= /*search_controller.depth*/ 1; ++current_depth) {
		
		/* AB */
		
		if (search_controller.stop == bool.true) {

			break;

		}
		
	}
	
	search_controller.best = best_move;
	search_controller.thinking = bool.false;

}


