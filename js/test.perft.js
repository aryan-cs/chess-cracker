var perft_leaf_nodes;

function perft (depth) { 	

	if (depth == 0) { perft_leaf_nodes++; return; }
    
    generate_moves();
    
	var index, move;
	
	for (index = gameboard.move_list_start[gameboard.play]; index < gameboard.move_list_start[gameboard.play + 1]; ++index) {
	
		move = gameboard.move_list[index];	

		if (make_move(move) == bool.false) { continue; }		
		perft(depth - 1);
		take_move();

	}
    
    return;

}

function perft_test (depth) {    

	print_board();
	console.log("Starting Test To Depth:" + depth);	
	perft_leaf_nodes = 0;

	var index, move, move_num = 0;
	for (index = gameboard.move_list_start[gameboard.play]; index < gameboard.move_list_start[gameboard.play + 1]; ++index) {
	
		move = gameboard.move_list[index];

		if (make_move(move) == bool.false) { continue; }	
		move_num++;	
        var cumultative_nodes = perft_leaf_nodes;
		perft(depth - 1);
		take_move();
		var old_nodes = perft_leaf_nodes - cumultative_nodes;
        console.log("move:" + move_num + " " + print_move(move) + " " + old_nodes);
	}
    
	console.log("Test Complete : " + perft_leaf_nodes + " leaf nodes visited");      

    return;

}