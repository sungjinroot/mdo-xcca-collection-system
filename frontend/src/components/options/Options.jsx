import { useState } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";

import NewArtifact from "../MODALS/NewArtifact/NewArtifact";
import AssistantsModal from "../MODALS/Assistants/AssistantsModal.jsx";

function Options( { categories, rooms, initiateArtifactSearch } ) {
  const [open, setOpen] = useState(false);

  const [show, setShow] = useState(false);
  const [showAssistants, setShowAssistants] = useState(false);

  return (
    <>
      <div className="options-container">
        <SpeedDial
          ariaLabel="Simple SpeedDial"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          icon={<span style={{ fontSize: "28px" }}>+</span>}
          FabProps={{
            sx: {
              backgroundColor: "#283971",
              color: "#fff",
              "&:hover": { backgroundColor: "#3a52a3" },
              width: 80,
              height: 80,
            },
          }}
          sx={{
            position: "absolute",
            bottom: 25,
            right: 60,
            zIndex: 1,
          }}
        >
          <SpeedDialAction
            icon={<img src="src/assets/add-artifact.png" style={{ width: 32, height: 32 }} />}
            tooltipTitle="New Artifact"
            onClick={() => setShow(true)}
            FabProps={{
              sx: {
                width: 65,
                height: 65,
              },
            }}
          />

          <SpeedDialAction
            icon={<img src="src/assets/add-user.png" style={{ width: 32, height: 32 }} />}
            tooltipTitle="New User"
            onClick={() => setShowAssistants(true)}
            FabProps={{
              sx: {
                width: 65,
                height: 65,
              },
            }}
          />
        </SpeedDial>
      </div>

      <NewArtifact show={show} setShow={setShow} categories={categories} rooms={rooms} initiateArtifactSearch={initiateArtifactSearch}/>
      <AssistantsModal showAssistants={showAssistants} setShowAssistants={setShowAssistants}/>
    </>
  );
}

export default Options;