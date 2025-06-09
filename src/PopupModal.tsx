import { useState, useEffect, use } from "react";
import { Switch, FormControlLabel } from '@mui/material';
import { Box, Paper, Backdrop } from "@mui/material";
import Button from '@mui/material/Button';

type PopupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: { 
    ordered: boolean; preparing: boolean; prepared:boolean; served: boolean ; billed:boolean; 
    orderedBy: string | null ; preparingBy: string | null; preparedBy: string | null ; servedBy: string | null ; billedBy: string | null ;  }) => void;
  initialStatus: { ordered: boolean; preparing: boolean; prepared:boolean; served: boolean; billed:boolean;
    orderedBy: string | null ; preparingBy: string | null ; preparedBy: string | null ; servedBy: string | null ; billedBy: string | null;
  };

  userName: string | null;
};




const PopupModal: React.FC<PopupModalProps> = ({ isOpen, onClose, onSave, initialStatus,userName }) => {


  const [ordered, setOrdered] = useState(initialStatus.ordered);
  const [preparing, setPreparing] = useState(initialStatus.preparing);
  const [prepared, setPrepared] = useState(initialStatus.prepared);
  const [served, setServed] = useState(initialStatus.served);
  const [billed, setBilled] = useState(initialStatus.billed);
  const [orderedBy, setOrderedBy] = useState(initialStatus.orderedBy);
  const [preparingBy, setPreparingBy] = useState(initialStatus.preparingBy);
  const [preparedBy, setPreparedBy] = useState(initialStatus.preparedBy);
  const [servedBy, setServedBy] = useState(initialStatus.servedBy);
  const [billedBy, setBilledBy] = useState(initialStatus.billedBy);

  // Sync state with initialStatus when modal opens
  useEffect(() => {
    if (isOpen) {
      setOrdered(initialStatus.ordered);
      setPreparing(initialStatus.preparing);
      setPrepared(initialStatus.prepared);
      setServed(initialStatus.served);
      setBilled(initialStatus.billed);
      setOrderedBy(initialStatus.orderedBy);
      setPreparingBy(initialStatus.preparingBy);
      setPreparedBy(initialStatus.preparedBy);
      setServedBy(initialStatus.servedBy);
      setBilledBy(initialStatus.billedBy);
    }

  }, [isOpen, initialStatus]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ ordered, preparing, prepared , served , billed , orderedBy , preparingBy , preparedBy , servedBy , billedBy });
    onClose();
    
  };

  return (

    // <div style={modalOverlayStyles}>
    //   <div style={modalStyles}>
        
    <Backdrop open={true} sx={{ zIndex: 1000 }}>
  {/* Modal Content */}
  <Paper
    elevation={3}
    sx={{
      backgroundColor: "#F9FAFB",
      color: "black",
      padding: { xs: 2, sm: 3 },
      borderRadius: 5,
      width: { xs: "70vw", sm: 350, md: 380 },
      maxWidth: "100vw",
      height: { xs: "auto", sm: 550, md: 550 },
      maxHeight: { xs: "80vh", sm: 530, md: 600 },
      display: "flex",
      flexDirection: "column",
      gap: 2,
      textAlign: "left",
      boxSizing: "border-box",
      overflowY: "auto",
    }}
  >

        <h2 style={{ textAlign: "center" }}>Order Status</h2>

        {/* This will swtich on when order is placed */}
        <FormControlLabel
        control={
          <Switch
            checked={ordered} readOnly
            color="secondary"

          />
        }
        label={ordered ? `Ordered - ${orderedBy}` : "Ordered"}
        />

        <FormControlLabel
        control={
          <Switch
            checked={preparing}
            onChange={() => {
              if (prepared && served) {
                // optionally do something
              } else if (ordered) {
                setPreparing(!preparing);
                setPrepared(false);
                setPreparingBy(userName);
              }
            }}
            color="primary"
          />
        }
        label={preparing ? `Preparing - ${preparingBy}` : "Preparing"}
      />


        <FormControlLabel
          control={
            <Switch
              checked={prepared}
              onChange={() => {
                if (prepared && served) {
                  // Do nothing
                } else if (ordered) {
                  setPrepared(!prepared);
                  setPreparing(false);
                  setPreparedBy(userName);
                }
              }}
              color="primary"
            />
          }
          label={prepared ? `Prepared - ${preparedBy}` : "Prepared"}
        />

        <FormControlLabel
          control={
            <Switch
              checked={served}
              onChange={() => {
                if (prepared && !billed) {
                  setServed(!served);
                  setServedBy(userName);
                }
              }}
              color="primary"
            />
          }
          label={served ? `Served - ${servedBy}` : "Served"}
        />

        <FormControlLabel
          control={
            <Switch
              checked={billed}
              onChange={() => {
                if (served) {
                  setBilled(!billed);
                  setBilledBy(userName);
                }
              }}
              color="primary"
            />
          }
          label={billed ? `Billed - ${billedBy}` : "Billed"}
        />

        <br />
        {/* <button onClick={handleSave}>Save</button> */}
        <Button  variant="contained" onClick={handleSave} >Save</Button>
        <Button variant="outlined" onClick={onClose}>Cancel </Button>


        </Paper>
        </Backdrop>
  );
};



export default PopupModal;
