import { EMPTY, WHITE } from './constants'
import { getFen } from './state'

/** @public */
export type Color = 'w' | 'b'

/** @public */
export type FenComment = {
  fen: string
  comment: string
}

/** @public */
export type PartialMove = {
  to: string
  from: string
  promotion?: PieceSymbol
}

/**
 * Represents a chess move
 *
 * @remarks
 * The `piece`, `captured`, and `promotion` fields contain the lowercase
 * representation of the applicable piece.
 *
 * The `flags` field in verbose mode may contain one or more of the following values:
 *
 * - `n` - a non-capture
 *
 * - `b` - a pawn push of two squares
 *
 * - `e` - an en passant capture
 *
 * - `c` - a standard capture
 *
 * - `p` - a promotion
 *
 * - `k` - kingside castling
 *
 * - `q` - queenside castling
 *
 * A flag of `pc` would mean that a pawn captured a piece on the 8th rank and promoted.
 *
 * @public
 */

export enum MoveType {
  PieceMove,
  SkipMove,
}
export type PieceMove = PartialMove & {
  color: Color
  flags: string
  piece: PieceSymbol
  san: string
  captured?: PieceSymbol
  type: MoveType.PieceMove
}

export type SkipMove = {
  san?: string
  color: Color
  type: MoveType.SkipMove
}

export type Move = PieceMove | SkipMove

/** @public */
export type Piece = {
  color: Color
  type: PieceSymbol
}

/** @public */
export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'

/** @public */
export type Validation = {
  valid: boolean
  error_number: number
  error: string
}

/** @public */
export class State {
  board: Board
  kings: ColorState
  turn: Color
  castling: ColorState
  ep_square: number
  half_moves: number
  move_number: number

  constructor(
    board?: Board,
    kings?: ColorState,
    turn?: Color,
    castling?: ColorState,
    ep_square?: number,
    half_moves?: number,
    move_number?: number
  ) {
    this.board = board || new Array(128)
    this.kings = kings || { w: EMPTY, b: EMPTY }
    this.turn = turn || WHITE
    this.castling = castling || { w: 0, b: 0 }
    this.ep_square = ep_square || EMPTY
    this.half_moves = half_moves || 0
    this.move_number = move_number || 1
  }

  public clone(): State {
    return new State(
      this.board.slice(),
      {
        w: this.kings.w,
        b: this.kings.b,
      },
      this.turn,
      {
        w: this.castling.w,
        b: this.castling.b,
      },
      this.ep_square,
      this.half_moves,
      this.move_number
    )
  }

  public get fen(): string {
    return getFen(this)
  }
}

/** Private types */
export type Board = Array<Piece | undefined>

export type ColorState = Record<Color, number> & {
  w: number
  b: number
}

export type Comments = Partial<Record<string, string>>

export type FlagKey =
  | 'NORMAL'
  | 'CAPTURE'
  | 'BIG_PAWN'
  | 'EP_CAPTURE'
  | 'PROMOTION'
  | 'KSIDE_CASTLE'
  | 'QSIDE_CASTLE'

export type GameHistory = {
  move: HexMove | SkipMove
  state: State
}

export type HexMove = {
  to: number
  from: number
  color: Color
  flags: number
  piece: PieceSymbol
  captured?: PieceSymbol
  promotion?: PieceSymbol
  san?: string
  type: MoveType.PieceMove
}

export type Square =
  | 'a8'
  | 'b8'
  | 'c8'
  | 'd8'
  | 'e8'
  | 'f8'
  | 'g8'
  | 'h8'
  | 'a7'
  | 'b7'
  | 'c7'
  | 'd7'
  | 'e7'
  | 'f7'
  | 'g7'
  | 'h7'
  | 'a6'
  | 'b6'
  | 'c6'
  | 'd6'
  | 'e6'
  | 'f6'
  | 'g6'
  | 'h6'
  | 'a5'
  | 'b5'
  | 'c5'
  | 'd5'
  | 'e5'
  | 'f5'
  | 'g5'
  | 'h5'
  | 'a4'
  | 'b4'
  | 'c4'
  | 'd4'
  | 'e4'
  | 'f4'
  | 'g4'
  | 'h4'
  | 'a3'
  | 'b3'
  | 'c3'
  | 'd3'
  | 'e3'
  | 'f3'
  | 'g3'
  | 'h3'
  | 'a2'
  | 'b2'
  | 'c2'
  | 'd2'
  | 'e2'
  | 'f2'
  | 'g2'
  | 'h2'
  | 'a1'
  | 'b1'
  | 'c1'
  | 'd1'
  | 'e1'
  | 'f1'
  | 'g1'
  | 'h1'
