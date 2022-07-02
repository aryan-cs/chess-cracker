console.log("Setup script loaded...");

var pieces = {

    empty : 0, // Empty
    wP : 1, // White Pawn
    wN : 2, // White Knight (yes, I used 'N', it's to avoid repeating 'K')
    wB : 3, // White Bishop
    wR : 4, // White Rook
    wQ : 5, // White Queen
    wK : 6, // White Knight
    bP : 7, // Black Pawn
    bN : 8, // Black Knight (yes, I used 'N', it's to avoid repeating 'K')
    bB : 9, // Black Bishop
    bR : 10, // Black Rook
    bQ : 11, // Black Queen
    bK : 12  // Black King

};

var board_square_number = 120;

// Files, or columns
var files = {

    file_a : 0,
    file_b : 1,
    file_c : 2,
    file_d : 3,
    file_e : 4,
    file_f : 5,
    file_g : 6,
    file_h : 7,
    file_none : 8
    
};

// Ranks, or rows
var ranks = {

    rank_1 : 0,
    rank_2 : 1,
    rank_3 : 2,
    rank_4 : 3,
    rank_5 : 4,
    rank_6 : 5,
    rank_7 : 6,
    rank_8 : 7,
    rank_none : 8
    
};

// Colors stored in one bit
var colors = {

    white : 0,
    black : 1,
    both : 2

};

var castle = {

    wkca : 1, // Castle to White King side  | 0001
    wqca : 2, // Castle to White Queen side | 0010
    bkca : 4, // Castle to Black King side  | 0100
    bqca : 8  // Castle to Black Queen side | 1000 

}

// Some special squares on the board
var squares = {

    a1 : 21,
    b1 : 22,
    c1 : 23,
    d1 : 24,
    e1 : 25,
    f1 : 26,
    g1 : 27,
    h1 : 28,
    a8 : 91,
    b8 : 92,
    c8 : 93,
    d8 : 94,
    e8 : 95,
    f8 : 96,
    g8 : 97,
    h8 : 98,
    no_square : 99,
    off_board : 100

};

// Boolean values stored in one bit
var bool = {

    false : 0,
    true : 1

};

var max_game_moves = 2048;
var max_position_moves = 256;
var max_depth = 64;
var infinity = 30000;
var mate = 29000;
var pv_entries = 10000;

var files_board = new Array (board_square_number);
var ranks_board = new Array (board_square_number);

var starting_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

var piece_characters = ".PNBRQKpnbrqk";
var side_characters = "wb-";
var rank_characters = "12345678";
var file_characters = "abcdefgh";

// Given file and rank, get square 
function fr2sq(file, rank) { return ((21 + (file)) + ((rank) * 10 )); }

// Boolean values for piece positions based on value
var piece_big = [ bool.false, bool.false, bool.true, bool.true, bool.true, 
                  bool.true, bool.true, bool.false, bool.true, bool.true, 
                  bool.true, bool.true, bool.true ];

var piece_maj = [ bool.false, bool.false, bool.false, bool.false, bool.true, 
                  bool.true, bool.true, bool.false, bool.false, bool.false, 
                  bool.true, bool.true, bool.true ];

var piece_min = [ bool.false, bool.false, bool.true, bool.true, bool.false, 
                  bool.false, bool.false, bool.false, bool.true, bool.true, 
                  bool.false, bool.false, bool.false ];

var piece_value = [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000 ];

var piece_color = [ colors.both, colors.white, colors.white, colors.white, 
                    colors.white, colors.white, colors.white, colors.black, 
                    colors.black, colors.black, colors.black, colors.black, 
                    colors.black ];
	
var piece_pawn = [ bool.false, bool.true, bool.false, bool.false, bool.false, 
                   bool.false, bool.false, bool.true, bool.false, bool.false, 
                   bool.false, bool.false, bool.false ];

var piece_knight = [ bool.false, bool.false, bool.true, bool.false, bool.false, 
                     bool.false, bool.false, bool.false, bool.true, bool.false, 
                     bool.false, bool.false, bool.false ];

var piece_king = [ bool.false, bool.false, bool.false, bool.false, bool.false, 
                   bool.false, bool.true, bool.false, bool.false, bool.false, 
                   bool.false, bool.false, bool.true ];

var piece_rook_queen = [ bool.false, bool.false, bool.false, bool.false, 
                         bool.true, bool.true, bool.false, bool.false, bool.false, 
                         bool.false, bool.true, bool.true, bool.false ];

var piece_bishop_queen = [ bool.false, bool.false, bool.false, bool.true, 
                           bool.false, bool.true, bool.false, bool.false, bool.false, 
                           bool.true, bool.false, bool.true, bool.false ];
                    
var piece_slides = [ bool.false, bool.false, bool.false, bool.true, bool.true, 
                     bool.true, bool.false, bool.false, bool.false, bool.true, 
                     bool.true, bool.true, bool.false ];

var knight_direction = [-8, -19, -21, -12, 8, 19, 21, 12];
var rook_direction = [-1, -10,	1, 10];
var bishop_direction = [-9, -11, 11, 9];
var king_direction = [-1, -10,	1, 10, -9, -11, 11, 9];

var direction_number = [0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8];
var piece_direction = [0, 0, knight_direction, bishop_direction, rook_direction, king_direction, king_direction,
                       0, knight_direction, bishop_direction, rook_direction, king_direction, king_direction];

var loop_nonslide_pieces = [pieces.wN, pieces.wK, 0, pieces.bN, pieces.bK, 0];
var loop_nonslide_index = [0, 3];

var loop_slide_pieces = [pieces.wB, pieces.wR, pieces.wQ, 0, pieces.bB, pieces.bR, pieces.bQ, 0];
var loop_slide_index = [0, 4];
                    
function generate_key() { return (Math.floor((Math.random() * 255) + 1) << 23) | 
                            (Math.floor((Math.random() * 255) + 1) << 16) | 
                            (Math.floor((Math.random() * 255) + 1) << 8) | 
                            Math.floor((Math.random() * 255) + 1); }

var piece_keys = new Array(14 * 20);
var side_key;
var castle_keys = new Array (16);

var mirror_64_table = [

    56,	57,	58,	59,	60,	61,	62,	63,
    48,	49,	50,	51,	52,	53,	54,	55,
    40,	41,	42,	43,	44,	45,	46,	47,
    32,	33,	34,	35,	36,	37,	38,	39,
    24,	25,	26,	27,	28,	29,	30,	31,
    16,	17,	18,	19,	20,	21,	22,	23,
    8,	9,	10,	11,	12,	13,	14,	15,
    0,	1,	2,	3,	4,	5,	6,	7

];

var square_120_to_square_64 = new Array(board_square_number);
var square_64_to_square_120 = new Array(64);

function square_64 (square_120) { return square_120_to_square_64[(square_120)]; }
function square_120 (square_64) { return square_64_to_square_120[(square_64)]; }

function piece_index (piece, piece_number) { return (piece * 10 + piece_number); }

function mirror_64 (square) { return mirror_64_table[(square)]; }

var kings = [pieces.wK, pieces.bK];

var castle_perm = [

    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 13, 15, 15, 15, 12, 15, 15, 14, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15,  7, 15, 15, 15,  3, 15, 15, 11, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15

];

function from_square (m) { return (m & 0x7F); }
function to_square (m) { return ((m >> 7) & 0x7F); }
function captured (m) { return ((m >> 14) & 0xF); }
function promoted_piece (m) { return ((m >> 20) & 0xF); }

var move_flag_en_passant = 0x40000;
var move_flag_pawn_start = 0x80000;
var move_flag_castling = 0x1000000;
var move_flag_capture = 0x7C000;
var move_flag_promoted = 0xF00000;
var no_move = 0;

function square_off_board (square) {

    if (files_board[square] == squares.off_board) { return bool.true; }

    return bool.false;

}

function hash_piece (piece, square) { gameboard.position_key ^= piece_keys[(piece * 120) + square]; }

function hash_castle () { gameboard.position_key ^= castle_keys[gameboard.castle_perm]; }

function hash_side () { gameboard.position_key ^= side_key; }

function hash_en_passant () { gameboard.position_key ^= piece_keys[gameboard.en_passant_square]; }

var game_controller = {};
game_controller.engine_side = colors.both;
game_controller.player_side = colors.both;
game_controller.game_over = bool.false;

var user_move = {};
user_move.from = squares.no_square;
user_move.to = squares.no_square;

var selected_square, selected_piece;