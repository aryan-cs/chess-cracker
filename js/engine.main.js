$(function () {

    init();
    console.log("Main initialization called...");
    parse_fen(starting_fen);
    print_board()
    check_board()

});

function init_files_and_ranks_board() {

    var index = 0;
    var file = files.file_a;
    var rank = ranks.rank_1;
    var square = squares.a1;

    // Loop through board and set every square to 'off board'
    for (index = 0; index < board_square_number; ++index) {

        files_board[index] = squares.off_board;
        ranks_board[index] = squares.off_board;

    }

    // Loop through all ranks, and each file in rank, get square, and set it
    for (rank = ranks.rank_1; rank <= ranks.rank_8; ++rank) {

        for (file = files.file_a; file <= files.file_h; ++file) {

            square = fr2sq(file, rank);
            files_board[square] = file;
            ranks_board[square] = rank;

        }

    }

}

function init_hash() {

    var index = 0;

    for (index = 0; index < 14 * 120; ++index) {
        piece_keys[index] = generate_key();
    }

    side_key = generate_key();

    for (index = 0; index < 16; ++index) {
        castle_keys[index] = generate_key();
    }

}

function init_square_conversion() {

    var index = 0;
    var file = files.file_a;
    var rank = ranks.rank_1;
    var square = squares.a1;
    var square_64 = 0;

    for (index = 0; index < board_square_number; ++index) {
        square_120_to_square_64[index] = 65;
    }

    for (index = 0; index < 64; ++index) {
        square_64_to_square_120[index] = 120;
    }

    for (rank = ranks.rank_1; rank <= ranks.rank_8; ++rank) {

        for (file = files.file_a; file <= files.file_h; ++file) {

            square = fr2sq(file, rank);
            square_64_to_square_120[square_64] = square;
            square_120_to_square_64[square] = square_64;
            square_64++;

        }

    }

}

function init_board_vars () {

    var index = 0;
    for (index = 0; index < max_game_moves; ++index) {

        gameboard.history.push({

            move: no_move,
            castle_perm: 0,
            en_passant: 0,
            move_rule: 0,
            position_key: 0

        });

    }

    for (index = 0; index < pv_entries; ++index) {

        gameboard.pv_table.push({

            move: no_move,
            position_key: 0,

        });

    }

}

function init() {

    console.log("Initializing...");
    init_files_and_ranks_board();
    init_hash();
    init_square_conversion();
    init_board_vars();
    init_mvv_lva();
    init_board();
    disable_pieces();

}