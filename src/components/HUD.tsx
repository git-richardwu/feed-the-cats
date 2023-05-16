import './index.scss'
import React, { useEffect } from "react";

interface HUDProps {
    score: number;
    gameDuration: number;
    setGameDuration: React.Dispatch<React.SetStateAction<number>>;
}

const HUD: React.FC<HUDProps> = (props: HUDProps) => {
    useEffect(() => {
        if (props.gameDuration > 0) {
            const durationInterval = setInterval(() => {
                props.setGameDuration(props.gameDuration - 1);
            }, 1000);
            return () => { clearInterval(durationInterval); }
        }
    }, [props.gameDuration]);

    return (
        <div style={{ width: "100%", overflow: "hidden" }}>
            <div style={{ float: "left" }}>Score: {props.score}</div>
            <div style={{ float: "right" }}>{props.gameDuration} seconds remaining</div>
        </div>
    );
}

export default HUD;