import { useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from './AuthContext';
import Paper from '@mui/material/Paper';
import { Typography, Button} from '@mui/material';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import './ItemMenu.css'; // 
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,

  } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

/* category
name , price

*/


type Items = {

    category: string;
    name: string;
    price: number;
}

type TableItems = {

    name: string;
    price: number;
    quantity: number;
    category: string;
}

function fetchMenuItems() {
    const [menuItems, setMenuItems] = useState<Items[] >([]);
    useEffect(() => {
        axios.get(`${API_BASE_URL}/items`)
        .then(res => setMenuItems(res.data))
        .catch(err => console.error(err));
    }, []);
    return menuItems;
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


function ItemMenu(){

    const {userName } = useAuth();
    
    const menuItems = fetchMenuItems();
    const [categories, setCategories] = useState<string[]>([]);
    
    // const [tableItems, setTableItems] = useState<(Items & { quantity: number })[]>([]);
    const { tableNumber } = useParams<{ tableNumber: string }>(); //tableNumber is passed as a URL parameter
    const tableItemsData = fetchTableItems(tableNumber);
    console.log(tableItemsData);
    const [tableItems, setTableItems] = useState<TableItems []>([]);

    useEffect(() => {
        setTableItems(tableItemsData);
    }, [tableItemsData]);



    // for items in the Menu , get the categories
    useEffect(() => {
        const uniqueCategories = Array.from(new Set(menuItems.map(item => item.category)));
        setCategories(uniqueCategories);
    }, [menuItems]);
    

    const navigate = useNavigate();

    const processOrder = () => {
        //save the order to the server
        const orderData = 
            tableItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }));
        console.log(orderData);
        // axios.put(`http://localhost:3000/table-status/${tableNumber}`, orderData)
        console.log(JSON.stringify(orderData, null, 2));
        axios.put(`${API_BASE_URL}/table-items/${tableNumber}`, orderData)
        // checking the order list is empty or not
        // if empty , make the ordered status false
        // if not empty , make the ordered status true
        const orderedStatus = orderData.length > 0 ? true : false;
        console.log(orderedStatus);
        axios.put(`${API_BASE_URL}/table-status/table${tableNumber}`, { ordered: orderedStatus , orderedBy: userName })
        navigate("/home"); // after clicking the Process order -> it will go to home 
    }

return (
    
  <div>
    <div className="centered-container">
    <div>


      <Typography variant="h3"  sx={{ fontWeight: 'bold', mt: 5, mb: 1 }}>
        Item Menu
      </Typography>
      <Typography variant="subtitle1" textAlign={"center"} className="table-info" sx={{ mb: 2 }}>
        Selected Table: {tableNumber}
      </Typography>
    </div>
    <div
  style={{
    display: "flex",
    flexWrap: "wrap", // Allow items to wrap to next row
    gap: "20px",
    justifyContent: "center", // Center items nicely
    padding: "20px",
    marginTop: "40px",

  }}
>
  {categories.map((category) => (
    <div
      key={category}
      style={{
      backgroundColor: "#ffffff",
      color: "black",
      padding: "16px",
      borderRadius: "8px",
      width: "350px", // Consistent width per card
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      // justifyContent: "space-between",
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)", // <-- Added box shadow
      }}
    >
      <h2>{category}</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
      {menuItems
        .filter((item) => item.category === category)
        .map((item, index) => (
      <li
        key={index}
        style={{
        marginBottom: "12px",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // space between text and button
        gap: "12px",
        }}
      >
        <div>
        <strong>{item.name}</strong>
        <div>Rs. {item.price.toFixed(2)}</div>
        </div>
        <Button
        variant="outlined"
        startIcon={<AddIcon />}
        size="small"
        onClick={() => {
          const existingItem = tableItems.find(
          (tableItem) => tableItem.name === item.name
          );
          if (existingItem) {
          setTableItems(
            tableItems.map((tableItem) =>
            tableItem.name === item.name
              ? { ...tableItem, quantity: tableItem.quantity + 1 }
              : tableItem
            )
          );
          } else {
          setTableItems([...tableItems, { ...item, quantity: 1 }]);
          }
        }}
        >
        add
        </Button>
      </li>
        ))}
      </ul>
    </div>
  ))}
</div>


<div>
<TableContainer
  component={Paper}
  sx={{
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "60px",
    width: "90%",
    maxWidth: "800px",
    marginInline: "auto",
    color: "black",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
  }}
>
  <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
    Selected Items
  </Typography>

  <Table>
    <TableHead>
      <TableRow>
        <TableCell><strong>Item</strong></TableCell>
        <TableCell align="right"><strong>Price (Rs.)</strong></TableCell>
        <TableCell align="right"><strong>Quantity</strong></TableCell>
        <TableCell align="right"><strong></strong></TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {tableItems.map((item, index) => (
        <TableRow key={index}>
          <TableCell>{item.name}</TableCell>
          <TableCell align="right">{item.price.toFixed(2)}</TableCell>
          <TableCell align="right">{item.quantity}</TableCell>
          <TableCell align="right">
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => {
                const existingItem = tableItems.find(
                  (tableItem) => tableItem.name === item.name
                );
                if (existingItem && existingItem.quantity > 1) {
                  setTableItems(
                    tableItems.map((tableItem) =>
                      tableItem.name === item.name
                        ? {
                            ...tableItem,
                            quantity: tableItem.quantity - 1,
                          }
                        : tableItem
                    )
                  );
                } else {
                  setTableItems(
                    tableItems.filter(
                      (tableItem) => tableItem.name !== item.name
                    )
                  );
                }
              }}
            >
              Remove
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>

  <Button
    onClick={processOrder}
    variant="contained"
    color="primary"
    sx={{
      display: "block",
      margin: "40px auto 50px",
      padding: "10px 20px",
      borderRadius: "4px",
    }}
  >
    Process Order
  </Button>
</TableContainer>

</div>



    </div>
    
    </div>
);


}


export default ItemMenu;