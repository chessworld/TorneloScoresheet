import { Chess } from "chess.ts"
import moment from "moment"
import { GameInfo, Player, PlayerColour, PLAYER_COLOUR_NAME } from "./types/chessGameInfo"

/**
 * Extracts game info from a pgn string (using headers) will return undefined if error occurs when parsing.
 * @param pgn pgn string of the game to be parsed
 * @returns All info of game from headers
 */
export const parseGameInfo = (pgn: string): GameInfo | undefined => {
    // create game object to parse pgn
    let game = new Chess()

    try {
        // if no error while parsing -> return game info object
        if (game.loadPgn(pgn)) {

            // extract required info
            const [mainRound, subRound] = parseRoundInfo(game.header()["Round"])
            const whitePlayer = extractPlayer(PlayerColour.White, game.header())
            const blackPlayer = extractPlayer(PlayerColour.Black, game.header())

            return {
                name: game.header()["Event"] ?? "",
                date: moment(game.header()["Date"] ?? "", "YYYY.MM.DD"),
                site: game.header()["Site"] ?? "",
                round: mainRound,
                subRound: subRound,
                result: game.header()["Result"] ?? "",
                players: [whitePlayer, blackPlayer],
                pgn: pgn
            }

        } else {
            // error while parsing -> return undefined
            return undefined
        }

    } catch {
        // error while parsing -> return undefined
        return undefined
    }

}



// ------- Privates

const extractPlayer = (color: PlayerColour, headers: Record<string, string>): Player => {
    let playerColorName = PLAYER_COLOUR_NAME[color]
    const [firstName, lastName] = parsePlayerName(headers[playerColorName] ?? "")
    let fideId = parseInt(headers[`${playerColorName}FideId`] ?? "")
    return {
        firstName: firstName,
        lastName: lastName,
        color: color,
        fideId: isNaN(fideId) ? 0 : fideId,
        elo: 0,
        country: ""
    }
}

const parsePlayerName = (name: string): [string, string] => {

    // parse first and last names using regex
    let nameRegex = /(.+)[,]{1}(.+)/
    let nameRegexResult = (name).match(nameRegex)

    // error, return provided name as last name and empty first name
    if (nameRegexResult === null) {
        return [name, ""]
    }
    if (nameRegexResult.length != 3) {
        return [name, ""]
    }
    // return firstname, lastname
    return [nameRegexResult[2], nameRegexResult[1]]

}
const parseRoundInfo = (round: string): [number, number] => {

    // parse round and subround using regex
    let regex = /([0-9]+)[.]?([0-9]*)/
    let regexResults = round.match(regex)

    // error occured return 0.0
    if (regexResults === null) {
        return [0, 0]
    }
    if (regexResults.length != 3) {
        return [0, 0]
    }

    // return main round and sub round tuple
    let mainRound = parseInt(regexResults[1])
    let subRound = parseInt(regexResults[2])
    return [isNaN(mainRound) ? 0 : mainRound, isNaN(subRound) ? 0 : subRound]
}