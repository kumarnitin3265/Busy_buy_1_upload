
import { useParams } from "react-router-dom";
import { ITEMS } from "../data/itemData";

function ItemDetails(){

    const { id } = useParams();
    const item = ITEMS.find(
        (item) => item.id === id
    );

    return (
        <>
            <main>
                <h3>ItemDetails</h3>
            </main>
            <h2>{item.title}</h2>
            <h2>{item.description}</h2>
            <img src={item.src}/>
        </>
    )
}

export default ItemDetails;