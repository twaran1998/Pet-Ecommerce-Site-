import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import "./modal.css"; 
const Modal = ({ open, handleClose, title, message }) => {
    useEffect(() => {
      if (open) {
        const timer = setTimeout(() => {
          handleClose();
        }, 5000);
  
        return () => {
          clearTimeout(timer);
        };
      }
    }, [open, handleClose]);
  
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="modalTitle">{title}</DialogTitle>
        <Divider />
        <DialogContent className="modalContent">{message}</DialogContent>
        <Divider />
        <DialogActions className="modalActions">
          <Button onClick={handleClose} style={{color: "white", marginRight:"45%"}} className="closeButton">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default Modal;