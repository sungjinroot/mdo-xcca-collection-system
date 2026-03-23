import { useState } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Backdrop from "@mui/material/Backdrop";

function Options() {
  const [open, setOpen] = useState(false);

  return (
    <div className="options-container">
      
      <Backdrop open={open} sx={{backdropFilter: "blur(5px)",backgroundColor: "rgba(0,0,0,0.2)",zIndex: 1,}} onClick={() => setOpen(false)}/>

      <SpeedDial ariaLabel="Simple SpeedDial" open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} style={{ position: "absolute", bottom: 60, right: 50, zIndex: 1}} icon={<span>+</span>}>
        
        <SpeedDialAction icon={<span>A</span>} tooltipTitle="Add Artifact" onClick={() => alert("First")}/>
        
        <SpeedDialAction icon={<span>B</span>} tooltipTitle="Head Count" onClick={() => alert("Second")}/>
        
        <SpeedDialAction icon={<span>C</span>} tooltipTitle="Something Else" onClick={() => alert("Third")}/>

      </SpeedDial>
    </div>
  );
}

export default Options;