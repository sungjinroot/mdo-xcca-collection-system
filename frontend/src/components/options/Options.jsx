import { useState } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";

import NewArtifact from "../MODALS/NewArtifact/NewArtifact";

import AssistantsModal from "../MODALS/Assistants/AssistantsModal.jsx";

function Options() {
  const [open, setOpen] = useState(false);

  //This is for modal
  const [show,setShow] = useState(false);
  const [showAssistants,setShowAssistants] = useState(false);


  //Create separate set show for head count

  return (
    <>
      <div className="options-container">
      
        <SpeedDial ariaLabel="Simple SpeedDial" FabProps={{sx: {backgroundColor: "#283971", color: "#fff", "&:hover": {backgroundColor: "#3a52a3"}, width: '55px', height: '55px' }}} open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} style={{ position: "absolute", bottom: 15, right: 50, zIndex: 1,}} icon={<span>+</span>}>
        
          <SpeedDialAction icon={<span>A</span>} tooltipTitle="New Artifact" onClick={() => setShow(true)}/>
        
          <SpeedDialAction icon={<span>B</span>} tooltipTitle="New User" onClick={() => setShowAssistants(true)}/>
        
        </SpeedDial>
      </div>

      <NewArtifact show={show} setShow={setShow}/>
      <AssistantsModal showAssistants={showAssistants} setShowAssistants={setShowAssistants}/>
    </>
  );
}

export default Options;