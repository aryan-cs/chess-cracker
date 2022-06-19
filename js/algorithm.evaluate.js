console.log("Algorithm evalutation script loaded...");

// Preset score values to encourage algorithm to play the best move
var pawn_table = [

    0, 0, 0, 0, 0, 0, 0, 0,
    10, 10, 0, -10, -10, 0, 10, 10,
    5, 0, 0, 5, 5, 0, 0, 5,
    0, 0, 10, 20, 20, 10, 0, 0,
    5, 5, 5, 10, 10, 5, 5, 5,
    10, 10, 10, 20, 20, 10, 10, 10,
    20, 20, 20, 30, 30, 20, 20, 20,
    0, 0, 0, 0, 0, 0, 0, 0 

];
    
var knight_table = [

    0, -10, 0, 0, 0, 0, -10, 0,
    0, 0, 0, 5, 5, 0, 0, 0,
    0, 0, 10, 10, 10, 10, 0, 0,
    0, 0, 10, 20, 20, 10, 5, 0,
    5, 10, 15, 20, 20, 15, 10, 5,
    5, 10, 10, 20, 20, 10, 10, 5,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0  

];
    
var bishop_table = [

    0, 0, -10, 0, 0, -10, 0, 0,
    0, 0, 0, 10, 10, 0, 0, 0,
    0, 0, 10, 15, 15, 10, 0, 0,
    0, 10, 15, 20, 20, 15, 10, 0,
    0, 10, 15, 20, 20, 15, 10, 0,
    0, 0, 10, 15, 15, 10, 0, 0,
    0, 0, 0, 10, 10, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0 

];
    
var rook_table = [

    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    25, 25, 25, 25, 25, 25, 25, 25,
    0, 0, 5, 10, 10, 5, 0, 0

];
    
var bishop_pair = 40;
    
function evaluate_position () {
        
    var score = gameboard.material[colors.white] - gameboard.material[colors.black];
        
    var piece, square, piece_number;
        
    piece = pieces.wP;
    for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {

        square = gameboard.piece_list[piece_index(piece, piece_number)];
        score += pawn_table[square_64(square)];

    }
        
    piece = pieces.bP;
    for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {

        square = gameboard.piece_list[piece_index(piece, piece_number)];
        score -= pawn_table[mirror_64(square_64(square))];

    }
        
    piece = pieces.wN; 
    for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {

        square = gameboard.piece_list[piece_index(piece, piece_number)];
        score += knight_table[square_64(square)];

    } 
    
    piece = pieces.bN; 
    for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {

        square = gameboard.piece_list[piece_index(piece, piece_number)];
        score -= knight_table[mirror_64(square_64(square))];
         
    }  
    
    piece = pieces.wB; 
    for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {

        square = gameboard.piece_list[piece_index(piece, piece_number)];
        score += bishop_table[square_64(square)];

    } 
    
    piece = pieces.bB; 
    for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {

        square = gameboard.piece_list[piece_index(piece, piece_number)];
        score -= bishop_table[mirror_64(square_64(square))];
     
    }
        
    piece = pieces.wR; 
    for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {

        square = gameboard.piece_list[piece_index(piece, piece_number)];
        score += rook_table[square_64(square)];

    } 
    
    piece = pieces.bR; 
    for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {

        square = gameboard.piece_list[piece_index(piece, piece_number)];
        score -= rook_table[mirror_64(square_64(square))];

    }
        
    piece = pieces.wQ; 
    for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {

        square = gameboard.piece_list[piece_index(piece, piece_number)];
        score += rook_table[square_64(square)];

    } 
    
    piece = pieces.bQ; 
    for (piece_number = 0; piece_number < gameboard.piece_number[piece]; ++piece_number) {


        square = gameboard.piece_list[piece_index(piece, piece_number)];
        score -= rook_table[mirror_64(square_64(square))];


    } 
        
    if (gameboard.piece_number[pieces.wB] >= 2) { score += bishop_pair; }
        
    if (gameboard.piece_number[pieces.bB] >= 2) { score -= bishop_pair; }
        
    if (gameboard.side == colors.white) { return score; }

    else { return -score; }
    
}
