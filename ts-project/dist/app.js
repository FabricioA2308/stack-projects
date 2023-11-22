"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Project state Management
class ProjectState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    // ADDS A PROJECT TO THE PROJECTS ARRAY AND BINDS A RANDOM ID TO IT
    addProject(title, description, numOfPeople) {
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
function Autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
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
    constructor(type) {
        this.type = type;
        this.templateElement = document.getElementById(
        // GETS THE LIST ELEMENT
        "project-list");
        this.hostElement = document.getElementById("app"); // GETS APP DIV AS THE HOST ELEMENT
        this.assignedProjects = [];
        const importedNode = document.importNode(
        // DEEPCLONES THE TEMPLATE INTO THE LIST
        this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        projectState.addListener((projects) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });
        this.attach();
        this.renderContent();
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        // LOOPS THROUGH EVERY PROJECT IN THE LIST
        for (const prjItem of this.assignedProjects) {
            // CREATES A LIST, SETS THE TITLE AS THE HEADER TEXT THEN APPENDS THE NEW LIST TO THE UNORDERED LIST
            const listItem = document.createElement("li");
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem);
        }
    }
    // GIVES THE UNORDERED LIST AN ID BASED ON THE TYPE OF LIST CREATED (EITHER FINISHED OR ACTIVE), THEN ADDS TEXT TO THE LIST HEADER
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent =
            this.type.toUpperCase() + " PROJECTS";
    }
    attach() {
        // ATTACH BOTTOM UP THE ELEMENT (LIST) TO THE HOST (DIV)
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}
// Project Input class
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById("project-input"); // GETS THE TEMPLATE WITH THE PROJECT-INPUT ID
        this.hostElement = document.getElementById("app"); // SETS THE HOST ELEMENT AS THE ELEMENT WITH APP ID
        const importedNode = document.importNode(
        // DEEP CLONES THE TEMPLATE INTO A NODE
        this.templateElement.content, true);
        this.element = importedNode.firstElementChild; //CREATES A OBJECT WITH THE FORM FROM INSIDE THE CLONED TEMPLATE
        this.element.id = "user-input";
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
        this.attach();
    }
    // Validation
    validateInputs(title, description, people, minLength = 5, maxLength = 50) {
        let isValid = true;
        // CHECK IF TITLE LENGTH IS ABOVE THE MINIMUN LENGTH AND BENEATH THE MAX LENGTH
        if (title.trim().length < minLength || title.trim().length > maxLength) {
            isValid = false;
        }
        // CHECK IF DESCRIPTION LENGTH IS ABOVE THE MINIMUN LENGTH AND BENEATH THE MAX LENGTH
        else if (description.trim().length < minLength ||
            description.trim().length > maxLength) {
            isValid = false;
        } // REDUDANT VALIDATION, THE PEOPLE INPUT IN THE HTML ONLY ACCEPTS BETWEEN 0 AND 10 (LINE 24 IN INDEX.HTML)
        else if (people < 0 || people > 10)
            [(isValid = false)];
        return isValid;
    }
    // GETS THE INPUTS FROM THE ELEMENTS IN THE DOM, VALIDATES THEM AND RETURN A TUPLE WITH THE VALUES
    gatherUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        if (this.validateInputs(enteredTitle, enteredDescription, +enteredPeople, 5, 30)) {
            console.log("All good.");
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
        else {
            alert("Invalid inputs, please try again!");
            return;
        }
    }
    // CLEAR EVERY FIELD AFTER SUBMITTING
    clearInput() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput; // DE-ESTRUCTURES THE ELEMENTS FROM THE TUPLE GENERATED INTO ITS OWN VARIABLES
            projectState.addProject(title, description, people); // CREATES THE PROJECT IN THE PROJECT MANAGER CLASS
            this.clearInput();
        }
    }
    configure() {
        // ADDS A LISTENER TO THE FORM, WHICH ON SUBMIT HANDLES THE CREATION AND VALIDATION OF THE PROJECT OBJECT
        this.element.addEventListener("submit", this.submitHandler);
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element); // INSERT THE FORM RIGHT AFTER THE HOST ELEMENT START
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
