Tx parser
=========

Reads a file `sample.input` line-by-line and tries to interpret the data as hex strings (either stripping of the `0x` in front of the string, or interpreting the entire string using `Buffer.from(<string>, 'hex')`). It then feeds this buffer into the `TransactionFactory.fromSerializedData()` using a `Common` set to `Mainnet` (chain ID = 1) and hardfork `London`.

To run:

`npm i`

`ts-node index.ts`

Output of the sample input:

```
err: Invalid serialized tx input. Must be array
err: Invalid serialized tx input. Must be array
err: Invalid serialized tx input. Must be array
err: TypedTransaction with ID 17 unknown
err: invalid RLP (safeSlice): end slice of Uint8Array out-of-bounds
err: Invalid transaction. Only expecting 6 values (for unsigned tx) or 9 values (for signed tx).
0xd02d72e067e77158444ef2020ff2d325f929b363
0xd02d72e067e77158444ef2020ff2d325f929b363
err: invalid RLP (safeSlice): end slice of Uint8Array out-of-bounds
```

The program reads from `sample.input` by default, but `ts-node index.ts --stdin` will make it read from the standard input instead.