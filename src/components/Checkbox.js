// import React from 'react';
// import PropTypes from 'prop-types';
// import { firebaseConfig } from '../firebase';

// export const Checkbox = ({ id, taskDesc }) => {
//   const archiveTask = () => {
//     firebaseConfig.firestore().collection('tasks').doc(id).update({
//       archived: true,
//     });
//   };

//   return (
//     <div
//       className="checkbox-holder"
//       data-testid="checkbox-action"
//       onClick={() => archiveTask()}
//       onKeyDown={(e) => {
//         if (e.key === 'Enter') archiveTask();
//       }}
//       aria-label={`Mark ${taskDesc} as done?`}
//       role="button"
//       tabIndex={0}
//     >
//       <span className="checkbox" />
//     </div>
//   );
// };

// Checkbox.propTypes = {
//   id: PropTypes.string.isRequired,
//   taskDesc: PropTypes.string.isRequired,
// };
import React from "react";
import PropTypes from "prop-types";
import { firestore } from "../firebase"; // Import the Firestore instance
import { doc, updateDoc } from "firebase/firestore"; // Import the necessary Firestore functions

export const Checkbox = ({ id, taskDesc }) => {
  const archiveTask = async () => {
    try {
      const taskDoc = doc(firestore, "tasks", id);
      await updateDoc(taskDoc, {
        archived: true,
      });
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  return (
    <div
      className="checkbox-holder"
      data-testid="checkbox-action"
      onClick={archiveTask}
      onKeyDown={(e) => {
        if (e.key === "Enter") archiveTask();
      }}
      aria-label={`Mark ${taskDesc} as done?`}
      role="button"
      tabIndex={0}
    >
      <span className="checkbox" />
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  taskDesc: PropTypes.string.isRequired,
};
