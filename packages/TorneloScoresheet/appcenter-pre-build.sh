#!/usr/bin/env bash

cd ../chess.ts
echo 'intalling chess.ts dependancies'
npm install
echo 'compiling chess.ts'
npx tsc
