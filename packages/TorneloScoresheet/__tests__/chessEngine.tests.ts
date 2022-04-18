import moment from 'moment';
import { parseGameInfo } from '../src/chessEngine';

const pgnSuccess = `[Event "Skywalker Challenge - A"]
[Site "Prague, Czechia"]
[Date "2021.09.12"]
[Round "6.1"]
[White "Skywalker, Anakin"]
[Black "Yoda, Master"]
[Result "*"]
[BlackFideId "1000000"]
[WhiteFideId "600000"]

*
`

test('chessEngineParsePgnSuccess', () => {

    let gameInfo = parseGameInfo(pgnSuccess)
    expect(gameInfo).toEqual({
        name: "Skywalker Challenge - A",
        site: "Prague, Czechia",
        round: 6,
        subRound: 1,
        result: "*",
        date: moment("2021.09.12", "YYYY.MM.DD"),
        pgn: pgnSuccess,
        players: [
            {
                color: 0,
                firstName: " Anakin",
                lastName: "Skywalker",
                elo: 0,
                country: "",
                fideId: 600000
            },
            {
                color: 1,
                firstName: " Master",
                lastName: "Yoda",
                elo: 0,
                country: "",
                fideId: 1000000
            }
        ]
    })

})


const pgnFailure = ``
test('chessEngineParsePgnFailure', () => {

    let gameInfo = parseGameInfo(pgnFailure)
    expect(gameInfo).toEqual(undefined)
})

const pgnNoFIdeId = `[Event "Skywalker Challenge - A"]
[Site "Prague, Czechia"]
[Date "2021.09.12"]
[Round "6.1"]
[White "Skywalker, Anakin"]
[Black "Yoda, Master"]
[Result "*"]

*
`
test('chessEngineParsePgnNoFideId', () => {

    let gameInfo = parseGameInfo(pgnNoFIdeId)
    expect(gameInfo).toEqual({
        name: "Skywalker Challenge - A",
        site: "Prague, Czechia",
        round: 6,
        subRound: 1,
        result: "*",
        date: moment("2021.09.12", "YYYY.MM.DD"),
        pgn: pgnNoFIdeId,
        players: [
            {
                color: 0,
                firstName: " Anakin",
                lastName: "Skywalker",
                elo: 0,
                country: "",
                fideId: 0
            },
            {
                color: 1,
                firstName: " Master",
                lastName: "Yoda",
                elo: 0,
                country: "",
                fideId: 0
            }
        ]
    })
})
const pgnNoFirstName = `[Event "Skywalker Challenge - A"]
[Site "Prague, Czechia"]
[Date "2021.09.12"]
[Round "6.1"]
[White "Skywalker, ?"]
[Black "Yoda, ?"]
[Result "*"]
[BlackFideId "1000000"]
[WhiteFideId "600000"]

*
`

test('chessEngineParsePgnNoFirstName', () => {

    let gameInfo = parseGameInfo(pgnNoFirstName)
    expect(gameInfo).toEqual({
        name: "Skywalker Challenge - A",
        site: "Prague, Czechia",
        round: 6,
        subRound: 1,
        result: "*",
        date: moment("2021.09.12", "YYYY.MM.DD"),
        pgn: pgnNoFirstName,
        players: [
            {
                color: 0,
                firstName: " ?",
                lastName: "Skywalker",
                elo: 0,
                country: "",
                fideId: 600000
            },
            {
                color: 1,
                firstName: " ?",
                lastName: "Yoda",
                elo: 0,
                country: "",
                fideId: 1000000
            }
        ]
    })

})