console.log("PV Table script loaded...");

function probe_pv () {

    var index = gameboard.position_key % pv_entries;

    if (gameboard.pv_table[index].position_key == gameboard.position_key) { return gameboard.pv_table[index].move; }

    return no_move;

}

function store_pv_move (move) {

    var index = gameboard.position_key % pv_entries;
    gameboard.pv_table[index].move = move;
    gameboard.pv_table[index].position_key = gameboard.position_key;

}