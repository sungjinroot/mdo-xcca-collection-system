import { useState } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";

import NewArtifact from "../MODALS/NewArtifact/NewArtifact";

function Options() {
  const [open, setOpen] = useState(false);

  //This is for modal
  const [show,setShow] = useState(false)

  return (
    <>
      <div className="options-container">
      
        <SpeedDial ariaLabel="Simple SpeedDial" FabProps={{sx: {backgroundColor: "#283971", color: "#fff", "&:hover": {backgroundColor: "#3a52a3"}, width: '55px', height: '55px' }}} open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} style={{ position: "absolute", bottom: 60, right: 50, zIndex: 1,}} icon={<span>+</span>}>
        
          <SpeedDialAction icon={<span>A</span>} tooltipTitle="New Artifact" onClick={() => setShow(true)}/>
        
          <SpeedDialAction icon={<span>B</span>} tooltipTitle="Head Count" onClick={() => alert("Second")}/>
        
        </SpeedDial>
      </div>

      <NewArtifact show={show} setShow={setShow}/>

    </>
  );
}

export default Options;