import './interface.scss'
import React, { useState, useRef, useEffect } from "react";

interface KitchenProps {
    length: number;
    onSubmit: (recipe: string) => void;
}

const Kitchen: React.FC<KitchenProps> = (props: KitchenProps) => {
    const [dish, setDish] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus()
    });

    const submit = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === ' ' && dish.length === props.length) {
            event.preventDefault();
            props.onSubmit(dish);
            setDish('');
        }
    }

    return (
        <input ref={inputRef} type='text' maxLength={props.length} value={dish} onKeyDown={submit} onChange={(e) => setDish(e.target.value.replace(/\s/g, ""))}></input>
    );
}

export default Kitchen;