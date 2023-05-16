import './index.scss'
import './interface.scss'
import React, { useState, useEffect, useRef } from "react";
import HUD from './HUD';
import Patron from './Patron';
import Kitchen from './Kitchen';
import Dish from './Dish';
import Trash from './Trash';
import { motion, useIsPresent, } from 'framer-motion';
import { Link } from 'react-router-dom';
const imageHeight = 120;
const imageWidth = 120;
const rectangleWidth = 1700;
const rectangleHeight = 500;
const maxPatrons = 12;
const duration = 30;
const numOfIngredients = 4;
const penalty = 5;
const respite = 3;
const ingredients = 'bcdfghqrstvwxyz';
const choices = ["🍎", "🍌", "🍐", "🍓", "🍉", "🍍", "🥝", "🥭", "🍑", "🥒", "🥕", "🍖", "🍗", "🥩", "🥓", "🍠", "🦐", "🍚", "🥫"];

interface occupantObject {
    seat: [number, number];
    order: string;
    styleID: number;
}

interface dishObject {
    text: string;
    emote: string;
    id: number;
}

export default function Game() {
    const [currentOccupants, setCurrentOccupants] = useState<occupantObject[]>([]);
    const [completedDishes, setCompletedDishes] = useState<dishObject[]>([]);

    const [gameDuration, setGameDuration] = useState<number>(duration);
    const [penaltyValue, setPenaltyValue] = useState<number>(penalty);
    const [countdown, setCountdown] = useState<number>(3);

    const [score, setScore] = useState<number>(0);
    const [scoreStats, setScoreStats] = useState<string>("");

    const [mistakes, setMistakes] = useState<number>(0);
    const [mistakeStats, setMistakeStats] = useState<string>("");

    const [highScoreStats, setHighScoreStats] = useState<string>("")

    const [startTime, setStartTime] = useState<Date>(new Date())
    const [elapsedTimeStats, setElapsedTimeStats] = useState<string>("");

    const [id, setID] = useState<number>(0);
    const [styleID, setStyleID] = useState<number>(0);

    const intervalID = useRef<number>();
    const itemsRef = useRef<HTMLDivElement[]>([]);

    const infoDiv = document.querySelector('.info-display') as HTMLVideoElement;
    const screenDiv = document.querySelector('.screen') as HTMLVideoElement;
    const isPresent = useIsPresent();

    useEffect(() => {
        if (countdown > 0) {
            const timerID = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => {
                setStartTime(new Date())
                clearTimeout(timerID);
            };
        }
    }, [countdown]);

    useEffect(() => {
        if (countdown === 0 && gameDuration > 0 && currentOccupants.length < maxPatrons) {
            intervalID.current = window.setInterval(() => {
                const newPatron = generatePatron();
                setCurrentOccupants([...currentOccupants, newPatron]);
            }, 500);
            return () => window.clearInterval(intervalID.current);
        }
    }, [countdown, gameDuration, currentOccupants.length]);

    useEffect(() => {
        if (gameDuration <= 0) {
            const currentTime = new Date();
            let highScore: number = 0;
            if (localStorage.getItem('highScore')){
                highScore = parseInt(localStorage.getItem('highScore') || "0");
            }
            const difference = (currentTime.getTime() - startTime.getTime()) / 1000;
            const minutes = Math.floor(difference / 60);
            const seconds = Math.floor(difference % 60);
            if (score === 0) {
                setScoreStats("You scored no points. :(")
            } else if (score === 1) {
                setScoreStats("You scored one point. :/")
            } else {
                setScoreStats(`You scored ${score} points. :)`)
            }
            if (minutes === 0) {
                setElapsedTimeStats(`${seconds} seconds.`);
            } else if (minutes === 1) {
                setElapsedTimeStats(`${minutes} minute ${seconds} seconds.`)
            } else {
                setElapsedTimeStats(`${minutes} minutes ${seconds} seconds!`)
            }
            if (mistakes === 0) {
                setMistakeStats('You didn\'t mess up any orders!');
            } else if (mistakes === 1) {
                setMistakeStats(`You only messed up ${mistakes} order!`);
            } else {
                setMistakeStats(`You messed up ${mistakes} orders.`);
            }
            if (score > highScore) {
                setHighScoreStats(`You beat your high score of ${highScore} points! :D`);
                localStorage.setItem('highScore', JSON.stringify(score));
            } else {
                setHighScoreStats(`Your previous best was ${highScore} points.`)
            }
        }
    }, [gameDuration])

    const onServe = (coordinate: [number, number], correct: boolean, styleID: number, dishID: number) => {
        if (!correct) {
            screenDiv.classList.add('shake');
            setGameDuration(gameDuration - penaltyValue);
            setPenaltyValue(penaltyValue + 5);
            setMistakes(mistakes + 1);
        }
        else {
            setGameDuration(gameDuration + respite);
            setScore(score + 1);
        }
        infoDiv.classList.add(correct ? 'highlightCorrect' : 'highlightWrong');
        setTimeout(() => {
            screenDiv.classList.remove('shake');
            infoDiv.classList.remove(correct ? 'highlightCorrect' : 'highlightWrong');
        }, 500);
        const dishIndex = completedDishes.findIndex((item) => item.id === dishID);
        const updatedDishes = [...completedDishes];
        updatedDishes.splice(dishIndex, 1);
        setCompletedDishes(updatedDishes);
        const patronDiv = itemsRef.current[styleID];
        patronDiv.classList.add('fadeOut');
        setTimeout(() => {
            setCurrentOccupants(patrons => patrons.filter(patron => patron.seat !== coordinate));
        }, 250);
    }

    const generateOrder = () => {
        let res = '';
        for (let i = 0; i < numOfIngredients; i++) {
            res += ingredients.charAt(Math.floor(Math.random() * ingredients.length));
        }
        return res;
    }

    const generatePatron = () => {
        const maxX = rectangleWidth - imageWidth;
        const maxY = rectangleHeight - imageHeight;
        let randomX: number;
        let randomY: number;
        let newPosition: [number, number];
        let newOrder: string;
        do {
            randomX = Math.floor(Math.random() * maxX);
            randomY = Math.floor(Math.random() * maxY);
            newPosition = [randomX, randomY];
            newOrder = generateOrder();
            setStyleID(styleID + 1)
        } while (Array.from(currentOccupants).some((occupant) => Math.abs(occupant.seat[0] - randomX) < imageWidth && Math.abs(occupant.seat[1] - randomY) < imageHeight) && currentOccupants.length < maxPatrons);
        return { seat: newPosition, order: newOrder, styleID: styleID };
    }

    const generateDish = (event: string) => {
        if (completedDishes.length < 10) {
            const emote = choices[Math.floor(Math.random() * choices.length)];
            setID(id + 1);
            setCompletedDishes([...completedDishes, { text: event, emote: emote, id: id }])
        }
    }

    const resetGame = () => {
        setCountdown(3);
        setScore(0);
        setGameDuration(duration);
        setMistakes(0);
        setPenaltyValue(penalty);
        setCurrentOccupants([]);
        setCompletedDishes([]);
        
    }

    return (
        <div className='wrapper'>
            <div className='info-display'>
                {countdown > 0 ? <div>Game starts in {countdown} seconds</div> : <HUD score={score} gameDuration={gameDuration} setGameDuration={(e) => setGameDuration(e)} />}
            </div>
            {gameDuration <= 0 ? <div className="screen">
                <div className="stats-list">
                    <p>{scoreStats}</p>
                    <p>You lasted for approximately {elapsedTimeStats}</p>
                    <p>{mistakeStats}</p>
                    <p>{highScoreStats}</p>
                    <Link to="/">
                        <button>main menu</button>
                    </Link>
                    <button onClick={() => resetGame()}>play again</button>
                </div>
            </div> :
                <div className="screen">
                    {countdown === 0 && currentOccupants.map((occupant) => (
                        <div ref={(element) => (itemsRef.current[occupant.styleID] = element!)} key={JSON.stringify(occupant.seat)}>
                            <Patron coordinate={occupant.seat} order={occupant.order} styleID={occupant.styleID} imageHeight={imageHeight} imageWidth={imageWidth} onServe={onServe} />
                        </div>
                    ))}
                </div>}
            <div className="mise-en-place">
                <Kitchen length={numOfIngredients} onSubmit={(e) => generateDish(e)} />
                <div className='conveyor-belt'>
                    {completedDishes.map((dish) => (
                        <Dish key={dish.id} id={dish.id} emote={dish.emote} text={dish.text} />
                    ))}
                </div>
                <Trash setCompletedDishes={setCompletedDishes} completedDishes={completedDishes} />
            </div>
            <motion.div
                className="transition-block"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
                exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
                style={{ originX: isPresent ? 0 : 1 }} />
        </div>
    );
}