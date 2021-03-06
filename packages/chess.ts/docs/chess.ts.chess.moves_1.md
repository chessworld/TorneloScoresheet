<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [chess.ts](./chess.ts.md) &gt; [Chess](./chess.ts.chess.md) &gt; [moves](./chess.ts.chess.moves_1.md)

## Chess.moves() method

Returns a list of legal moves from the current position. The function takes an optional parameter which controls the single-square move generation and verbosity.

<b>Signature:</b>

```typescript
moves(options: {
        square?: string;
        verbose: true;
    }): Move[];
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  options | { square?: string; verbose: true; } |  |

<b>Returns:</b>

[Move](./chess.ts.move.md)<!-- -->\[\]

## Example


```js
const chess = new Chess()
chess.moves({ verbose: true })
// -> [{ color: 'w', from: 'a2', to: 'a3',
//       flags: 'n', piece: 'p', san 'a3'
//       # a captured: key is included when the move is a capture
//       # a promotion: key is included when the move is a promotion
//     },
//     ...
//     ]

```
[Move](./chess.ts.move.md)

