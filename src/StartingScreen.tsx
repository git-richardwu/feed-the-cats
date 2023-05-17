import './App.scss';
import { Link } from 'react-router-dom';
import { motion, useIsPresent } from 'framer-motion';

export default function StartingScreen() {
    const isPresent = useIsPresent();

    return (
        <div>
            <h1>feed the cats.</h1>
            <Link to="/play">
                <button>start game</button>
            </Link>
            <div className='how-to-play'>
                <div className='instructions'>Instructions: </div>
                <div>
                    <span>type in text box</span> to assemble dish
                    </div>
                <div>
                    <span>press space bar</span> to create dish
                    </div>
                <div>
                    <span>drag and drop</span> dish to feed
                </div>
            </div>    
            <motion.div
                className="transition-block"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
                exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
                style={{ originX: isPresent ? 0 : 1 }}
            />
        </div>
    );
}