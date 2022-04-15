<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [chess.ts](./chess.ts.md) &gt; [Chess](./chess.ts.chess.md) &gt; [gameOver](./chess.ts.chess.gameover.md)

## Chess.gameOver() method

Returns true if the game has ended via checkmate, stalemate, draw, threefold repetition, or insufficient material. Otherwise, returns false.

<b>Signature:</b>

```typescript
gameOver(): boolean;
```
<b>Returns:</b>

boolean

## Example


```js
const chess = new Chess()
chess.gameOver()
// -> false

// stalemate
chess.load('4k3/4P3/4K3/8/8/8/8/8 b - - 0 78')
chess.gameOver()
// -> true

// checkmate
chess.load('rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3')
chess.gameOver()
// -> true

```
