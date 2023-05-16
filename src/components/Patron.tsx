import './index.scss';
import React, { useState } from "react";
import Oatmeal from '../assets/pop1.png';
import OatmealPop from '../assets/pop2.png';

interface PatronProps {
    coordinate: [number, number];
    order: string;
    styleID: number;
    imageHeight: number;
    imageWidth: number;
    onServe: (coordinate: [number, number], correct: boolean, styleID: number, dishID: number) => void;
}

const Patron: React.FC<PatronProps> = (props: PatronProps) => {
    const [open, setOpen] = useState(Oatmeal);

    return (
        <div className="fadeIn" onDrop={(e) => {
            if (e.dataTransfer.getData('text/name') === props.order) {
                props.onServe(props.coordinate, true, props.styleID, parseInt(e.dataTransfer.getData('text/plain')));
            }
            else {
                props.onServe(props.coordinate, false, props.styleID, parseInt(e.dataTransfer.getData('text/plain')));
            }
        }} onDragOver={(e) => {
            e.preventDefault(); setOpen(OatmealPop);
        }} onDragLeave={() => setOpen(Oatmeal)}>
            <img
                src={open}
                style={{ position: 'absolute', left: props.coordinate[0], top: props.coordinate[1], height: props.imageHeight, width: props.imageWidth }}
                draggable="false"
                className='oatmeal'
                alt='Oatmeal'
            />
            <div className="order" style={{ position: 'absolute', left: props.coordinate[0] + 40, top: props.coordinate[1] + 60 }}>{props.order}</div>
        </div>
    );
}

export default Patron;