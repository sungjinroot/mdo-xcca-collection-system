import { useState } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";

function Options() {
  const [open, setOpen] = useState(false);

  return (
    <div className="options-container">
      
      <SpeedDial ariaLabel="Simple SpeedDial" FabProps={{sx: {backgroundColor: "#283971", color: "#fff", "&:hover": {backgroundColor: "#3a52a3"}}}} open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} style={{ position: "absolute", bottom: 80, right: 50, zIndex: 1,}} icon={<span>+</span>}>
        
        <SpeedDialAction icon={<span>A</span>} tooltipTitle="Add Artifact" onClick={() => console.log("Working")}/>
        
        <SpeedDialAction icon={<span>B</span>} tooltipTitle="Head Count" onClick={() => alert("Second")}/>
        
      </SpeedDial>
    </div>
  );
}

export default Options;