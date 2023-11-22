// Project state Management
class ProjectState {
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Function) {
    this.listeners.push(listenerFn);
  }

  // ADDS A PROJECT TO THE PROJECTS ARRAY AND BINDS A RANDOM ID TO IT
  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: description,
      people: numOfPeople,
    };

    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      // CALLS EVERY LISTENER FUNCTION PASSING A COPY OF THE PROJECTS ARRAY
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// Autobind decorator
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return adjDescriptor;
}

const number = 5;

// Project List Class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: any[];

  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      // GETS THE LIST ELEMENT
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement; // GETS APP DIV AS THE HOST ELEMENT
    this.assignedProjects = [];

    const importedNode = document.importNode(
      // DEEPCLONES THE TEMPLATE INTO THE LIST
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    // LOOPS THROUGH EVERY PROJECT IN THE LIST
    for (const prjItem of this.assignedProjects) {
      // CREATES A LIST, SETS THE TITLE AS THE HEADER TEXT THEN APPENDS THE NEW LIST TO THE UNORDERED LIST
      const listItem = document.createElement("li");
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  // GIVES THE UNORDERED LIST AN ID BASED ON THE TYPE OF LIST CREATED (EITHER FINISHED OR ACTIVE), THEN ADDS TEXT TO THE LIST HEADER
  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private attach() {
    // ATTACH BOTTOM UP THE ELEMENT (LIST) TO THE HOST (DIV)
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

// Project Input class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement; // GETS THE TEMPLATE WITH THE PROJECT-INPUT ID
    this.hostElement = document.getElementById("app")! as HTMLDivElement; // SETS THE HOST ELEMENT AS THE ELEMENT WITH APP ID

    const importedNode = document.importNode(
      // DEEP CLONES THE TEMPLATE INTO A NODE
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement; //CREATES A OBJECT WITH THE FORM FROM INSIDE THE CLONED TEMPLATE
    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  // Validation
  private validateInputs(
    title: string,
    description: string,
    people: number,
    minLength: number = 5,
    maxLength: number = 50
  ): boolean {
    let isValid = true;

    // CHECK IF TITLE LENGTH IS ABOVE THE MINIMUN LENGTH AND BENEATH THE MAX LENGTH
    if (title.trim().length < minLength || title.trim().length > maxLength) {
      isValid = false;
    }
    // CHECK IF DESCRIPTION LENGTH IS ABOVE THE MINIMUN LENGTH AND BENEATH THE MAX LENGTH
    else if (
      description.trim().length < minLength ||
      description.trim().length > maxLength
    ) {
      isValid = false;
    } // REDUDANT VALIDATION, THE PEOPLE INPUT IN THE HTML ONLY ACCEPTS BETWEEN 0 AND 10 (LINE 24 IN INDEX.HTML)
    else if (people < 0 || people > 10) [(isValid = false)];

    return isValid;
  }

  // GETS THE INPUTS FROM THE ELEMENTS IN THE DOM, VALIDATES THEM AND RETURN A TUPLE WITH THE VALUES
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    if (
      this.validateInputs(
        enteredTitle,
        enteredDescription,
        +enteredPeople,
        5,
        30
      )
    ) {
      console.log("All good.");
      return [enteredTitle, enteredDescription, +enteredPeople];
    } else {
      alert("Invalid inputs, please try again!");
      return;
    }
  }

  // CLEAR EVERY FIELD AFTER SUBMITTING
  private clearInput() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput; // DE-ESTRUCTURES THE ELEMENTS FROM THE TUPLE GENERATED INTO ITS OWN VARIABLES
      projectState.addProject(title, description, people); // CREATES THE PROJECT IN THE PROJECT MANAGER CLASS
      this.clearInput();
    }
  }

  private configure() {
    // ADDS A LISTENER TO THE FORM, WHICH ON SUBMIT HANDLES THE CREATION AND VALIDATION OF THE PROJECT OBJECT
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element); // INSERT THE FORM RIGHT AFTER THE HOST ELEMENT START
  }
}

const prjInput = new ProjectInput();

const activePrjList = new ProjectList("active");

const finishedPrjList = new ProjectList("finished");
