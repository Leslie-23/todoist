// /* eslint-disable no-nested-ternary */
// import { useState, useEffect } from "react";
// import moment from "moment";
// import { firebaseConfig } from "../firebase";
// import { firestore } from "../firebase";
// import { collatedTasksExist } from "../helpers";

// export const useTasks = (selectedProject) => {
//   const [tasks, setTasks] = useState([]);
//   const [archivedTasks, setArchivedTasks] = useState([]);

//   useEffect(() => {
//     let unsubscribe = firebaseConfig
//       .firestore()
//       .collection("tasks")
//       .where("userId", "==", "jlIFXIwyAL3tzHMtzRbw");

//     unsubscribe =
//       selectedProject && !collatedTasksExist(selectedProject)
//         ? (unsubscribe = unsubscribe.where("projectId", "==", selectedProject))
//         : selectedProject === "TODAY"
//           ? (unsubscribe = unsubscribe.where(
//               "date",
//               "==",
//               moment().format("DD/MM/YYYY")
//             ))
//           : selectedProject === "INBOX" || selectedProject === 0
//             ? (unsubscribe = unsubscribe.where("date", "==", ""))
//             : unsubscribe;

//     unsubscribe = unsubscribe.onSnapshot((snapshot) => {
//       const newTasks = snapshot.docs.map((task) => ({
//         id: task.id,
//         ...task.data(),
//       }));

//       setTasks(
//         selectedProject === "NEXT_7"
//           ? newTasks.filter(
//               (task) =>
//                 moment(task.date, "DD-MM-YYYY").diff(moment(), "days") <= 7 &&
//                 task.archived !== true
//             )
//           : newTasks.filter((task) => task.archived !== true)
//       );
//       setArchivedTasks(newTasks.filter((task) => task.archived !== false));
//     });

//     return () => unsubscribe();
//   }, [selectedProject]);

//   return { tasks, archivedTasks };
// };

// export const useProjects = () => {
//   const [projects, setProjects] = useState([]);

//   useEffect(() => {
//     firebaseConfig
//       .firestore()
//       .collection("projects")
//       .where("userId", "==", "jlIFXIwyAL3tzHMtzRbw")
//       .orderBy("projectId")
//       .get()
//       .then((snapshot) => {
//         const allProjects = snapshot.docs.map((project) => ({
//           ...project.data(),
//           docId: project.id,
//         }));

//         if (JSON.stringify(allProjects) !== JSON.stringify(projects)) {
//           setProjects(allProjects);
//         }
//       });
//   }, [projects]);

//   return { projects, setProjects };
// };

// index.js
import { useState, useEffect } from "react";
import moment from "moment";
import { firestore } from "../firebase"; // Import the Firestore instance
import { collatedTasksExist } from "../helpers";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
} from "firebase/firestore";

export const useTasks = (selectedProject) => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);

  useEffect(() => {
    let q = query(
      collection(firestore, "tasks"),
      where("userId", "==", "jlIFXIwyAL3tzHMtzRbw")
    );

    if (selectedProject && !collatedTasksExist(selectedProject)) {
      q = query(q, where("projectId", "==", selectedProject));
    } else if (selectedProject === "TODAY") {
      q = query(q, where("date", "==", moment().format("DD/MM/YYYY")));
    } else if (selectedProject === "INBOX" || selectedProject === 0) {
      q = query(q, where("date", "==", ""));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newTasks = snapshot.docs.map((task) => ({
        id: task.id,
        ...task.data(),
      }));

      setTasks(
        selectedProject === "NEXT_7"
          ? newTasks.filter(
              (task) =>
                moment(task.date, "DD-MM-YYYY").diff(moment(), "days") <= 7 &&
                task.archived !== true
            )
          : newTasks.filter((task) => task.archived !== true)
      );
      setArchivedTasks(newTasks.filter((task) => task.archived !== false));
    });

    return () => unsubscribe();
  }, [selectedProject]);

  return { tasks, archivedTasks };
};

export const useProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const q = query(
      collection(firestore, "projects"),
      where("userId", "==", "jlIFXIwyAL3tzHMtzRbw"),
      orderBy("projectId")
    );

    getDocs(q).then((snapshot) => {
      const allProjects = snapshot.docs.map((project) => ({
        ...project.data(),
        docId: project.id,
      }));

      if (JSON.stringify(allProjects) !== JSON.stringify(projects)) {
        setProjects(allProjects);
      }
    });
  }, [projects]);

  return { projects, setProjects };
};
