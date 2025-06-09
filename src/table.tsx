import { useState } from 'react';
import { useParams } from "react-router";
import { useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


type TableItems = {

    name: string;
    price: number;
    quantity: number;
}

function fetchTableItems(tableNumber: string | undefined) {
    const [tableItems, setTableItems] = useState< TableItems[] >([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/table-items/${tableNumber}`)
        .then(res => setTableItems(res.data))
        .catch(err => console.error(err));
    }, []);

    return tableItems;
}


function Table(){

    const {tableNumber} = useParams<{ tableNumber: string }>();//tableNumber is passed as a URL parameter

    const tableItemsData = fetchTableItems(tableNumber);
    console.log(tableItemsData);
    const [tableItems, setTableItems] = useState<TableItems []>([]);

    useEffect(() => {
        setTableItems(tableItemsData);
    }, [tableItemsData]);


    return(
        <div>
            <h2>Table {tableNumber}</h2>
            <table style={{border: "1px solid black"}}>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {tableItems.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )


}

export default Table;