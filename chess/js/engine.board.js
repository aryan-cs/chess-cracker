console.log("Board script loaded...");

// -----------------------------------------------------------------------

// Board drawing to canvas

let canv = document.getElementById("canvas").getContext("2d");
let board = canvas.getBoundingClientRect();
let square = { width: 100, height: 100 };
const dark_grey = getComputedStyle(document.querySelector(':root')).getPropertyValue("--dark-grey");
const light_grey = getComputedStyle(document.querySelector(':root')).getPropertyValue("--light-grey");
const accent = getComputedStyle(document.querySelector(':root')).getPropertyValue("--accent-color");
const dark_accent = getComputedStyle(document.querySelector(':root')).getPropertyValue("--dark-accent-color");

function draw_rect(x, y, width, height) {

    canv.beginPath();
    canv.rect(x, y, width, height);
    canv.fillRect(x, y, width, height);

}

function set_pieces (div, square) {

    var sq_120, file, rank, file_name, rank_name, image_url, piece;

    sq_120 = square_120(square);
    piece = gameboard.pieces[sq_120];
    file = files_board[sq_120];
    rank = ranks_board[sq_120];

    if (piece >= pieces.wP && piece <= pieces.bK) {

        rank_name = "rank" + (rank + 1);
        file_name = "file" + (file + 1);
        file_name = "assets/" + side_characters[piece_color[piece]] + piece_characters[piece].toUpperCase() + ".png";
        
        if (side_characters[piece_color[piece]] == "w") { image_url = "<img src = \"" + file_name + "\" + class = \"white_piece " + rank_name + " " + file_name + "\"> </img>"; }
        else { image_url = "<img src = \"" + file_name + "\" + class = \"piece_div black_piece " + rank_name + " " + file_name + "\"> </img>"; }

        $(div).append(image_url);

    }

}

function init_board () {

    parse_fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

    canv.fillStyle = light_grey;
    canv.fillRect(0, 0, board.width, board.height);

    var top = 0; left = 0;

    for (var f = 0; f < 8; f++) {

        for (var r = 0; r < 8; r++) {

            var square_div = document.createElement("div");
            var file_rank = document.createElement("p");

            square_div.className = "square_div rank_" + String.fromCharCode(r + 97) + " file_" + (7 - f + 1);
            square_div.id = String.fromCharCode(r + 97) + "" + (7 - f + 1);
            square_div.style.top = top + "px";
            square_div.style.left = left + "px";

            file_rank.innerHTML = String.fromCharCode(r + 97) + (7 - f + 1);
            file_rank.className = "square_info";

            if ((f + r) % 2 == 1) { canv.fillStyle = dark_grey; }
            else { canv.fillStyle = light_grey; file_rank.style.color = dark_grey; }

            draw_rect(f * square.width, r * square.height, square.width, square.height);

            set_pieces(square_div, (64 - ((f + 1) * 8) + r));

            document.getElementById("squares_holder").appendChild(square_div);
            document.getElementById(square_div.id).appendChild(file_rank);

            left += square.width;

        }

        top += square.height;
        left = 0;

    }


}

// -----------------------------------------------------------------------

var gameboard = {};

gameboard.pieces = new Array(board_square_number);
gameboard.side = colors.white;
gameboard.move_rule = 0;
gameboard.history_play = 0;
gameboard.history = [];
gameboard.play = 0;
gameboard.en_passant = 0;
gameboard.castle_perm = 0;
gameboard.material = new Array(2);
gameboard.piece_number = new Array(13);
gameboard.piece_list = new Array(14 * 10);
gameboard.position_key = 0;
gameboard.move_list = new Array(max_depth * max_position_moves);
gameboard.move_scores = new Array(max_depth * max_position_moves);
gameboard.move_list_start = new Array(max_depth);
gameboard.pv_table = [];
gameboard.pv_array = new Array(max_depth);
gameboard.search_history = new Array(14 * board_square_number);
gameboard.search_killers = new Array(3 * max_depth);

// -----------------------------------------------------------------------

function check_board() {

    var target_piece_number = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var target_material = [0, 0];
    var square_64, target_piece, t_piece_number, square_120, color, piece_count;

    for (target_piece = pieces.wP; target_piece <= pieces.bK; ++target_piece) {

        for (t_piece_number = 0; t_piece_number < gameboard.piece_number[target_piece]; ++t_piece_number) {

            square_120 = gameboard.piece_list[piece_index(target_piece, t_piece_number)];

            if (gameboard.pieces[square_120] != target_piece) {

                console.log("Error in check_board");
                return bool.false;

            }

        }

    }

    for (square_64 = 0; square_64 < 64; ++square_64) {

        square_120 = square_64_to_square_120[square_64];
        target_piece = gameboard.pieces[square_120];
        target_piece_number[target_piece]++;
        target_material[piece_color[target_piece]] += piece_value[target_piece];

    }

    for (target_piece = pieces.wP; target_piece <= pieces.bK; ++target_piece) {

        if (target_piece_number[target_piece] != gameboard.piece_number[target_piece]) {

            console.log(target_piece_number);
            console.log("Error in target_piece_number");
            return bool.false;

        }

    }

    if (target_material[colors.white] != gameboard.material[colors.white] ||
        target_material[colors.black] != gameboard.material[colors.black]) {

        console.log("Error in target_material");
        return bool.false;

    }

    if (gameboard.side != colors.white && gameboard.side != colors.black) {

        console.log("Error in gameboard.side");
        return bool.false;

    }

    if (generate_position_key() != gameboard.position_key) {

        console.log("Error in gameboard.position_key");
        return bool.false;

    }

    return bool.true;

}

function print_board() {

    var square, file, rank, piece;

    console.log("Board:\n");
    console.log("  ╭------------------------╮");

    for (rank = ranks.rank_8; rank >= ranks.rank_1; rank--) {

        var line = (rank_characters[rank] + " ¦");

        for (file = files.file_a; file <= files.file_h; file++) {

            square = fr2sq(file, rank);
            piece = gameboard.pieces[square];
            line += (" " + piece_characters[piece] + " ")

        }

        console.log(line + "¦");

    }

    var line = "   ";
    for (file = files.file_a; file <= files.file_h; file++) {
        line += (" " + file_characters[file] + " ");
    }

    console.log("  ╰------------------------╯");
    console.log(line);
    console.log("Side: " + side_characters[gameboard.side]);
    console.log("En Passant: " + gameboard.en_passant);
    line = "";

    if (gameboard.castle_perm & castle.wkca) line += "K";
    if (gameboard.castle_perm & castle.wqca) line += "Q";
    if (gameboard.castle_perm & castle.bkca) line += "k";
    if (gameboard.castle_perm & castle.bqca) line += "q";

    console.log("Castle: " + line);
    console.log("Key: " + gameboard.position_key.toString(16));

}

// -----------------------------------------------------------------------


function generate_position_key() {

    var square = 0;
    var final_key = 0;
    var piece = pieces.empty;

    for (square = 0; square < board_square_number; ++square) {

        piece = gameboard.pieces[square];

        if (piece != pieces.empty && piece != squares.off_board) {

            final_key ^= piece_keys[(piece * 120) + square];

        }

    }

    if (gameboard.side == colors.white) { final_key ^= side_key; }

    if (gameboard.en_passant != squares.no_square) { final_key ^= piece_keys[gameboard.en_passant]; }

    final_key ^= castle_keys[gameboard.castle_perm];

    return final_key;

}

function print_piece_lists() {

    var piece, piece_number;

    for (piece = pieces.wP; piece <= pieces.bK; ++piece) {

        for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {

            console.log("Piece: " + piece_characters[piece] + " on " + print_square(gameboard.piece_list[piece_index(piece, piece_number)]));

        }

    }

}

function update_list() {

    var piece, square, index, color;

    for (index = 0; index < 14 * 120; ++index) { gameboard.piece_list[index] = pieces.empty; }

    for (index = 0; index < 2; ++index) { gameboard.material[index] = 0; }

    for (index = 0; index < 13; ++index) { gameboard.piece_number[index] = 0; }

    for (index = 0; index < 64; ++index) {

        square = square_120(index);
        piece = gameboard.pieces[square];

        if (piece != pieces.empty) {

            color = piece_color[piece];
            gameboard.material[color] += piece_value[piece];
            gameboard.piece_list[piece_index(piece, gameboard.piece_number[piece])] = square;
            gameboard.piece_number[piece]++;

        }

    }

    // print_piece_lists();

}

// -----------------------------------------------------------------------

function reset_board() {

    var index = 0;

    for (index = 0; index < board_square_number; ++index) { gameboard.pieces[index] = squares.off_board; }

    for (index = 0; index < 64; ++index) { gameboard.pieces[square_120(index)] = pieces.empty; }

    gameboard.side = colors.both;
    gameboard.en_passant = squares.no_square;
    gameboard.move_rule = 0;
    gameboard.play = 0;
    gameboard.last = 0;
    gameboard.castle_perm = 0;
    gameboard.position_key = 0;
    gameboard.move_list_start[gameboard.play] = 0;

}

// -----------------------------------------------------------------------

function parse_fen (key) {

    reset_board();

    var rank = ranks.rank_8;
    var file = files.file_a;
    var piece = 0;
    var count = 0;
    var x = 0;
    var square_120 = 0;
    var fen_count = 0;

    while ((rank >= ranks.rank_1) && (fen_count < key.length)) {

        count = 1;

        switch (key[fen_count]) {

            case "p":
                piece = pieces.bP; break;
            case "r":
                piece = pieces.bR; break;
            case "n":
                piece = pieces.bN; break;
            case "b":
                piece = pieces.bB; break;
            case "k":
                piece = pieces.bK; break;
            case "q":
                piece = pieces.bQ; break;

            case "P":
                piece = pieces.wP; break;
            case "R":
                piece = pieces.wR; break;
            case "N":
                piece = pieces.wN; break;
            case "B":
                piece = pieces.wB; break;
            case "K":
                piece = pieces.wK; break;
            case "Q":
                piece = pieces.wQ; break;

            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":

                piece = pieces.empty;
                count = key[fen_count].charCodeAt() - "0".charCodeAt();
                break;

            case "/":
            case " ":

                rank--;
                file = files.file_a;
                fen_count++;
                continue;

            default:
                console.log("FEN KEY ERROR!");
                return;

        }

        for (x = 0; x < count; x++) {

            square_120 = fr2sq(file, rank);
            gameboard.pieces[square_120] = piece;
            file++;

        }

        fen_count++;

    }

    gameboard.side = (key[fen_count] == "w") ? colors.white : colors.black;
    fen_count += 2;

    for (x = 0; x < 4; x++) {

        if (key[fen_count] == " ") { break; }

        switch (key[fen_count]) {

            case "K":
                gameboard.castle_perm |= castle.wkca; break;
            case "Q":
                gameboard.castle_perm |= castle.wqca; break;
            case "k":
                gameboard.castle_perm |= castle.bkca; break;
            case "q":
                gameboard.castle_perm |= castle.bqca; break;

        }

        fen_count++;

    }

    fen_count++;

    if (key[fen_count] != "-") {

        file = key[fen_count].charCodeAt() - "a".charCodeAt();
        rank = key[fen_count + 1].charCodeAt() - "1".charCodeAt();

        console.log("fen[fen_count]: " + key[fen_count] + " | File: " + file + " | Rank: " + rank);
        gameboard.en_passant = fr2sq(file, rank);

    }

    gameboard.position_key = generate_position_key();
    update_list();
    print_square_attacked();

}

// -----------------------------------------------------------------------

function print_square_attacked() {

    var square, file, rank, piece;

    console.log("Attacked:\n");

    for (rank = ranks.rank_8; rank >= ranks.rank_1; rank--) {

        var line = ((rank + 1) + " ");

        for (file = files.file_a; file <= files.file_h; file++) {

            square = fr2sq(file, rank);

            if (square_attacked(square, gameboard.side ^ 1) == bool.true) { piece = "X"; }
            else { piece = "-"; }
            line += (" " + piece + " ")

        }

        console.log(line);


    }

    console.log("");

}

function square_attacked (square, side) {

    var piece, target_square, index;

    // Pawns
    if (side == colors.white) {

        if (gameboard.pieces[square - 11] == pieces.wP || gameboard.pieces[square - 9] == pieces.wP) {
            return bool.true;
        }

    } else {

        if (gameboard.pieces[square + 11] == pieces.bP || gameboard.pieces[square + 9] == pieces.bP) {
            return bool.true;
        }

    }

    // Knight
    for (index = 0; index < 8; index++) {

        piece = gameboard.pieces[square + knight_direction[index]];

        if (piece != squares.off_board &&
            piece_color[piece] == side &&
            piece_knight[piece] == bool.true) {
            return bool.true;
        }

    }

    // Rook
    for (index = 0; index < 4; ++index) {

        direction = rook_direction[index];
        target_square = square + direction;
        piece = gameboard.pieces[target_square];

        while (piece != squares.off_board) {

            if (piece != pieces.empty) {

                if (piece_rook_queen[piece] == bool.true && piece_color[piece] == side) { return bool.true; }

                break;

            }

            target_square += direction;
            piece = gameboard.pieces[target_square];

        }

    }

    // Bishop
    for (index = 0; index < 4; ++index) {

        direction = bishop_direction[index];
        target_square = square + direction;
        piece = gameboard.pieces[target_square];

        while (piece != squares.off_board) {

            if (piece != pieces.empty) {

                if (piece_bishop_queen[piece] == bool.true && piece_color[piece] == side) { return bool.true; }

                break;

            }

            target_square += direction;
            piece = gameboard.pieces[target_square];

        }

    }

    // King
    for (index = 0; index < 8; index++) {

        piece = gameboard.pieces[square + king_direction[index]];

        if (piece != squares.off_board &&
            piece_color[piece] == side &&
            piece_king[piece] == bool.true) { return bool.true; }

    }

    return bool.false;

}