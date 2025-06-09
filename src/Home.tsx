import { useState, useEffect } from "react";
import PopupModal from "./PopupModal"; // Order Status Modal
import { useNavigate } from "react-router";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from './AuthContext';
import { Card, CardContent, Typography, Button, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TablePopupModel from "./tableOrderpopup";

import SettingsIcon from '@mui/icons-material/Settings';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Use API_BASE_URL for socket.io
const socket = io(API_BASE_URL);

type OrderStatus = {
    ordered: boolean;
    preparing: boolean;
    prepared: boolean;
    served: boolean;
    billed: boolean;
    orderedBy: string | null  ;
    preparingBy: string | null ;
    preparedBy: string | null ;
    servedBy: string | null ;
    billedBy: string | null ;
  };

 // should be taken the accual value
  // const userName = "John Doe"; // Replace with actual username from context or props
  
  function Home() {
    const { userName, userRole } = useAuth();

    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    
    const [orderStatus, setOrderStatus] = useState<{ [key: string]: OrderStatus }>({
    });

    const [isorderPopupOpen, setIsOrderPopupOpen] = useState(false);
    
    
    const openTablePopup = (table: string) => {
      setSelectedTable(table);
      setIsOrderPopupOpen(true);
    }

    const closeTablePopup = () => {
      setIsOrderPopupOpen(false);
    }

    const [tableCount, setTableCount] = useState<number>(5);

    useEffect(() => {
      axios.get(`${API_BASE_URL}/settings/table-count`)
      .then(res => {
        if (typeof res.data === 'number') {
        setTableCount(res.data);
        } else if (res.data && typeof res.data.tableCount === 'number') {
        setTableCount(res.data.tableCount);
        }
      })
      .catch(err => {
        console.error('Failed to fetch table count:', err);
      });
    }, []);

    useEffect(() => {
      // Fetch initial data
      axios.get(`${API_BASE_URL}/table-status`)
        .then(res => {
          const updatedStatus: any = {};
          res.data.forEach((entry: any) => {
            updatedStatus[entry.tableName] = {
              ordered: entry.ordered,
              preparing: entry.preparing,
              prepared: entry.prepared,
              served: entry.served,
              billed: entry.billed,
              orderedBy: entry.orderedBy,
              preparingBy: entry.preparingBy,
              preparedBy: entry.preparedBy,
              servedBy: entry.servedBy,
              billedBy: entry.billedBy,
            };
          });
          setOrderStatus(updatedStatus);
        })
        .catch(err => console.error(err));
  
      // Socket.IO - Real-time updates
      socket.on("tableStatusUpdate", (updatedEntry: any) => {
        console.log("Received update:", updatedEntry);
  
        setOrderStatus(prevStatus => ({
          ...prevStatus,
          [updatedEntry.tableName]: {
            ordered: updatedEntry.ordered,
            preparing: updatedEntry.preparing,
            prepared: updatedEntry.prepared,
            served: updatedEntry.served,
            billed: updatedEntry.billed,
            orderedBy: updatedEntry.orderedBy,
            preparingBy: updatedEntry.preparingBy,
            preparedBy: updatedEntry.preparedBy,
            servedBy: updatedEntry.servedBy,
            billedBy: updatedEntry.billedBy,
          }
        }));
      });
  
      // Cleanup on unmount
      return () => {
        socket.off("tableStatusUpdate");
      };
  
    }, []);

    // Open the Status Popup Modal
    const openPopup = (table: string) => {
      setSelectedTable(table);
      setIsPopupOpen(true);
    };

    const clearTable = (table: number) => {
      axios.delete(`${API_BASE_URL}/table-items/${table}`)
      //make the all status false
      axios.put(`${API_BASE_URL}/table-status/table${table}`, { ordered: false , preparing: false , prepared: false , served: false , billed: false })
    };
  
    // Save Order Status
    const savePopup = (status: OrderStatus) => {
      //use the put method to update the status of the selected table
      if (selectedTable) {
        axios.put(`${API_BASE_URL}/table-status/${selectedTable}`, status)
          .then(() => {
            console.log("Status updated successfully");
          })
          .catch(err => console.error("Error updating status:", err));
      }
    };


  
    // Close Order Status Popup
    const closePopup = () => {
      setIsPopupOpen(false);
      setSelectedTable(null);
    };



  
    return (
      <>


<Box


  sx={{
    height: '90vh',
    overflowY: 'auto',
    padding: 2,
    boxSizing: 'border-box',
  }}
>

<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: { xs: 1, sm: 1, md: 1 } }}>
  {userRole && userRole === "Admin" && (
    <Button
      variant="outlined"
      onClick={() => {
        navigate('/admin-user-settings');
      }}
      color="primary"
      endIcon={<SettingsIcon />}
    >
      Admin
    </Button>
  )}
</Box>


  <Box sx={{ textAlign: 'center', mb: 2  }}>
    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
      Table Status
    </Typography>
    <Typography variant="h6">User: {userName}</Typography>
  </Box>

  <Grid container spacing={3} justifyContent="center">
    {Array.from({ length: tableCount }, (_, i) => {
      const tableNum = i + 1;
      const key = `table${tableNum}`;
      const status = orderStatus[key] || {};

     return (
        <Grid key={key}>
          <Card sx={{ width: 300, padding: 2, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" align="center" gutterBottom>
                Table {tableNum}
              </Typography>

              <Stack spacing={0.5} sx={{ mb: 2 }}>
                <Typography align="center" variant="body2">
                  {(() => {
                    if (status.billed) return `Billed ✅ - ${status.billedBy}`;
                    if (status.served) return `Served ✅ - ${status.servedBy}`;
                    if (status.prepared) return `Prepared ✅ - ${status.preparedBy}`;
                    if (status.preparing) return `Preparing ✅ - ${status.preparingBy}`;
                    if (status.ordered) return `Ordered ✅ - ${status.orderedBy}`;
                    return 'Not Ordered ❌';
                  })()}
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/menu/${tableNum}`)}
                >
                  {(() => {
                    if (!status.ordered) return "Set Order" ;
                    else return "Update Order" ;

                  })()}

                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  disabled={!status.ordered}
                  onClick={() => openTablePopup(tableNum.toString())}
                >
                  Order
                </Button>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => openPopup(key)}
                >
                  Set Status
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  disabled={!status.billed}
                  onClick={() => clearTable(tableNum)}
                >
                  Clear Table
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      );
    })}
  </Grid>
</Box>



        {/* Order Status Popup Modal */}
        {selectedTable && isPopupOpen && (
          <PopupModal
            isOpen={isPopupOpen}
            onSave={savePopup}
            onClose={closePopup}
            initialStatus={orderStatus[selectedTable]} // Pass saved status
            userName={userName} // Replace with actual username
          />
        )}
  
          
          {/* Table Order list Popup Modal */}
        {selectedTable && isorderPopupOpen && (
          <TablePopupModel 
          tableNum={selectedTable ?? undefined}
          isOpen={isorderPopupOpen} // Pass the selected table number to TablePopupModel
          onClose={closeTablePopup} // Pass the close function to TablePopupModel
          
          /> // Pass the selected table number to TablePopupModel
        )}

      </>
    );
  }

  export default Home;