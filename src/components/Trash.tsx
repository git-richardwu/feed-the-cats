import './interface.scss';

interface TrashProps {
    completedDishes: { text: string, emote: string, id: number }[];
    setCompletedDishes: React.Dispatch<React.SetStateAction<{ text: string, emote: string, id: number }[]>>;
}

const Trash: React.FC<TrashProps> = (props: TrashProps) => {
    const trashDiv = document.querySelector('.trash') as HTMLVideoElement;

    return (
        <div onDrop={(e) => {
            props.setCompletedDishes(props.completedDishes.filter(dish => dish.id !== parseInt(e.dataTransfer.getData('text/plain'))));
            trashDiv.classList.remove('shake');
        }}
            onDragOver={(e) => {
                e.preventDefault();
                trashDiv.classList.add('shake');
            }}
            onDragLeave={() => trashDiv.classList.remove('shake')}
            className='trash'>trash Can</div>
    );
}
export default Trash;