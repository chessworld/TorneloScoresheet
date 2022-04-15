<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [chess.ts](./chess.ts.md) &gt; [Chess](./chess.ts.chess.md) &gt; [inCheck](./chess.ts.chess.incheck.md)

## Chess.inCheck() method

Returns true or false if the side to move is in check.

<b>Signature:</b>

```typescript
inCheck(): boolean;
```
<b>Returns:</b>

boolean

## Example


```js
const chess = new Chess(
    'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3'
)
chess.inCheck()
// -> true

```
