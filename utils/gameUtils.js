import { Keyboard } from 'react-native';
import {getMovieAndHints} from "../api";

export const handleNewHint = (hintIndex, setHintIndex, hints) => {
    if (hintIndex < hints.length - 1) {
        setHintIndex(hintIndex + 1);
    }
};

export const takeGuess = (gameState, navigation) => {
    Keyboard.dismiss();
    let guess = gameState.guess.replace(/[^a-zA-Z0-9]+/g, "").toLowerCase();
    if (guess === gameState.movieData.movie) {
        gameState.setIsGuessCorrect(true);
        gameState.setScore(gameState.score + 30 - (gameState.hintIndex + 1) * 5);
        gameState.setMoviesGuessed(gameState.moviesGuessed + 1);
        setTimeout(() => {
            resetGame(false, gameState);
        }, 1000);
        return true;
    } else {
        gameState.setIsGuessCorrect(false);
        if (gameState.remainingNumberOfGuesses > 0) {
            gameState.setRemainingNumberOfGuesses(gameState.remainingNumberOfGuesses - 1);
        }
        setTimeout(() => {
            gameState.setIsGuessCorrect(null);
            if (gameState.remainingNumberOfGuesses <= 1) {
                navigation.navigate('Start', { score: gameState.score, moviesGuessed: gameState.moviesGuessed });
            }
        }, 300);
        return false;
    }
};

export const resetGame = async (resetScore, gameState) => {
    if (resetScore) {
        gameState.setScore(0);
    }
    gameState.setHintIndex(0);
    gameState.setIsGuessCorrect(null);
    gameState.setGuess('');
    gameState.setRemainingNumberOfGuesses(3);

    const data = await getMovieAndHints();
    if (data) {
        const { movie, hints } = data;
        gameState.setMovieData({ movie, hints });
    }
};