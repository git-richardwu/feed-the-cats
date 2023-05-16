import './index.scss';
import React, { DragEvent } from 'react';

interface DishProps {
    text: string;
    emote: string;
    id: number;
}

const Dish: React.FC<DishProps> = (props: DishProps) => {
    const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData("text/name", props.text);
        event.dataTransfer.setData("text/plain", JSON.stringify(props.id));
    }

    return (
        <div className='plate' draggable onDragStart={handleDragStart}>
            <div>{props.emote}</div>
            <div>{props.text}</div>
        </div>
    );
}
export default Dish;