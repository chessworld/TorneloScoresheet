<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [chess.ts](./chess.ts.md) &gt; [Chess](./chess.ts.chess.md) &gt; [validateFen](./chess.ts.chess.validatefen.md)

## Chess.validateFen() method

Returns a validation object specifying validity or the errors found within the FEN string.

<b>Signature:</b>

```typescript
validateFen(fen: string): Validation;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  fen | string |  |

<b>Returns:</b>

[Validation](./chess.ts.validation.md)

## Example


```js
chess.validateFen('2n1r3/p1k2pp1/B1p3b1/P7/5bP1/2N1B3/1P2KP2/2R5 b - - 4 25')
// -> { valid: true, error_number: 0, error: 'No errors.' }

chess.validateFen('4r3/8/X12XPk/1p6/pP2p1R1/P1B5/2P2K2/3r4 w - - 1 45')
// -> { valid: false, error_number: 9,
//     error: '1st field (piece positions) is invalid [invalid piece].' }

```

