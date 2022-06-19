console.log("PV Table script loaded...");

function get_pv_line (depth) {

    var move = probe_pv_table();
    var count = 0;

    while (move != no_move && count < depth) {

        if (move_exists(move) == bool.true) {

            make_move(move);
            gameboard.pv_array[count++] = move;

        }

        else { break; }

        move = probe_pv_table();

    }

    while (gameboard.play > 0) { take_move(); }

    return count;

}

function probe_pv_table () {

    var index = gameboard.position_key % pv_entries;

    if (gameboard.pv_table[index].position_key == gameboard.position_key) { return gameboard.pv_table[index].move; }

    return no_move;

}

function store_pv_move (move) {

    var index = gameboard.position_key % pv_entries;
    gameboard.pv_table[index].move = move;
    gameboard.pv_table[index].position_key = gameboard.position_key;

}