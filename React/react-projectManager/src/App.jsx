import NewProject from "./components/projectManager/NewProject";
import NoProjectSelected from "./components/projectManager/NoProjectSelected";
import ProjectsSidebar from "./components/mainComponents/ProjectsSidebar";
import { useState, useRef } from "react";
import SelectedProject from "./components/projectManager/SelectedProject";
import Modal from "./components/mainComponents/Modal";

function App() {
  const [projectsState, setProjectsState] = useState({
    selectedProjectId: undefined,
    projects: [],
    tasks: [],
  });

  const modal = useRef();

  function handleAddTask(text) {
    if (text) {
      setProjectsState((prevState) => {
        const taskId = Math.random();

        const newTask = {
          text: text,
          projectId: prevState.selectedProjectId,
          id: taskId,
        };

        return {
          ...prevState,
          tasks: [newTask, ...prevState.tasks],
        };
      });
    } else {
      modal.current.open();
    }
  }

  function handleDeleteTask(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        tasks: prevState.tasks.filter((task) => task.id !== id),
      };
    });
  }

  function handleDeleteProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: undefined,
        projects: prevState.projects.filter((project) => {
          project.id !== prevState.selectedProjectId;
        }),
      };
    });
  }

  function handleSelectProject(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: id,
      };
    });
  }

  function handleCancelAddProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: undefined,
      };
    });
  }

  function handleStartAddProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: null,
      };
    });
  }

  function handleAddProject(projectData) {
    setProjectsState((prevState) => {
      const newProject = { ...projectData, id: Math.random() };

      return {
        ...prevState,
        selectedProjectId: undefined,
        projects: [...prevState.projects, newProject],
      };
    });
  }

  const selectedProject = projectsState.projects.find(
    (project) => project.id === projectsState.selectedProjectId
  );

  const selectedProjectTasks = projectsState.tasks.filter(
    (task) => task.projectId === projectsState.selectedProjectId
  );

  let content = (
    <SelectedProject
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
      project={selectedProject}
      onDelete={handleDeleteProject}
      tasks={selectedProjectTasks}
    />
  );

  if (projectsState.selectedProjectId === null) {
    content = (
      <NewProject onSave={handleAddProject} onCancel={handleCancelAddProject} />
    );
  } else if (projectsState.selectedProjectId === undefined) {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
  }

  return (
    <>
      <Modal ref={modal} buttonCaption="Close">
        <h2 className="text-xl font-bold text-stone-700 my-4">Invalid task!</h2>
        <p className="text-stone-600 mb-4">
          Please make sure you provide a valid input for a task.
        </p>
      </Modal>
      <main className="h-screen my-8 flex gap-8">
        <ProjectsSidebar
          onStartAddProject={handleStartAddProject}
          projects={projectsState.projects}
          onSelectProject={handleSelectProject}
          selectedProjectId={projectsState.selectedProjectId}
        />
        {content}
      </main>
    </>
  );
}

export default App;
