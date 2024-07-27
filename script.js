//model

const controller = document.querySelector("[data-controller]");
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const LOCAL_STRORAGE_TASKS = 'task.names';
const LOCAL_STORAGE_SELECTED_CONTROL_BTN = 'task.controlbtn';
const taskTemplate = document.getElementById("task-template");
const taskCountElement = document.querySelector('[data-tasks-count]')
const tasksElement = document.querySelector('[data-tasks]');
const r = document.querySelector(":root");
const modeBtn = document.querySelector('[data-mode-btn]');
const modeIcon = document.getElementById('modeIcon');
const LOCAL_STORAGE_LIGHT = 'task.lightflag';

let lmt = localStorage.getItem(LOCAL_STORAGE_LIGHT);
let lightMode = (lmt === "true") ? true : (lmt === "false") ? false : true; // Default to true if not found
const controllerButtons = [
    { name: "All", id: "all-btn" },
    { name: "Active", id: "active-btn" },
    { name: "Completed", id: "completed-btn" }
];
let selectedControlBtn = localStorage.getItem(LOCAL_STORAGE_SELECTED_CONTROL_BTN);
selectedControlBtn = selectedControlBtn || 'all-btn'; // Default to 'all-btn' if not found

let tasks = JSON.parse(localStorage.getItem(LOCAL_STRORAGE_TASKS)) || [];




 
function save(){
    localStorage.setItem(LOCAL_STRORAGE_TASKS,JSON.stringify(tasks));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_CONTROL_BTN,selectedControlBtn);
    localStorage.setItem(LOCAL_STORAGE_LIGHT,lightMode);
}



//control

modeBtn.addEventListener('click',e =>{
    lightMode = !lightMode;
    save();
    renderMode();
 })

 window.addEventListener('resize', event=>{
    renderMode();
 })

newTaskForm.addEventListener('submit', event =>{
    event.preventDefault();
    const taskName = newTaskInput.value;
    if(taskName===''){
        retrun
    }
    tasks.push(createTask(taskName));
    newTaskInput.value = null;
   saveAndRender();
})

controller.addEventListener("click", event => {
    if(event.target.tagName.toLowerCase()!=="button"){
        return;
    }
    const btn = event.target;
    selectedControlBtn = btn.dataset.btnId;
    saveAndRender();
})

tasksElement.addEventListener('click',event =>{
    const tp = event.target.tagName.toLowerCase() 
    const selectedTask = tasks.find(item => item.id=== event.target.id);
    console.log(tp)
    if( tp == 'label' || tp == "input" || tp == 'span'){
        selectedTask.completed = event.target.checked;
    } else if(tp === 'img'){
        tasks = tasks.filter(item => item.id !== event.target.dataset.id)
    }
   saveAndRender();

})

function deleteCompleted(){
    tasks = tasks.filter(item=> !item.completed);
    saveAndRender();

}

function createTask(taskName){
    const newTask = {
        name : taskName,
        id : ''+ new Date().getTime(),
        completed : false
    }
    return newTask
}


//view

function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

function renderTasksCount(){
    let count = tasks.filter(task => !task.completed).length;
    let temp = count ==1 ? 'task' : 'tasks';
    taskCountElement.innerText = `${count} ${temp} remaining`

}

function renderTasks(){
    clearElement(tasksElement);
    let t;
    if (selectedControlBtn === "all-btn"){
        t = tasks ;
    }else if(selectedControlBtn==="active-btn"){
        t = tasks.filter(item=> !item.completed);
    }else if(selectedControlBtn === "completed-btn"){
        t = tasks.filter(item=> item.completed);
    }
    else{
        t= tasks;
    }
    t.forEach(item => {
        const task = taskTemplate.content.cloneNode(true);
        const checkbox = task.querySelector('input');
        const label = task.querySelector('label');
        const delIcon = task.querySelector('img');
        delIcon.dataset.id = item.id;
        checkbox.id = item.id;
        label.htmlFor = item.id;
        checkbox.checked = item.completed;
        label.append(item.name);
        tasksElement.appendChild(task);
    })
}

function saveAndRender(){
    save();
    renderTasks();
    renderTasksCount();
    renderController();
}

function renderController (){
    console.log(selectedControlBtn);
    clearElement(controller);
    controllerButtons.forEach(item => {
        const btn = document.createElement("button");
        btn.classList.add("btn");
        btn.classList.add("btn-footer");
        btn.innerText = item.name;
        btn.dataset.btnId = item.id;
        if(item.id===selectedControlBtn){
            btn.classList.add("active-btn");
        }
        controller.appendChild(btn);
    }
    )
}

function renderMode(){
   
    if(lightMode){
        r.style.setProperty('--background', 'hsl(0, 0%, 98%)');
        r.style.setProperty('--task-background', 'hsl(236, 33%, 92%)');
        r.style.setProperty('--checkbox-border', 'hsl(235, 19%, 35%)');
        r.style.setProperty('--task-text-color', 'hsl(235, 19%, 35%)');
        r.style.setProperty('--active-color', 'hsl(216, 100%, 52%)');
        r.style.setProperty('--check-blue', 'hsl(241, 90%, 68%)');
        r.style.setProperty('--check-pink', 'hsl(274, 94%, 49%)');
        let t = getComputedStyle(r).getPropertyValue('--light-background')
        r.style.setProperty('--header-background', `url(${t})`);
        modeIcon.textContent = 'brightness_4';
       
    }else{
        r.style.setProperty('--background', 'hsl(235, 24%, 19%)');
        r.style.setProperty('--task-background', 'hsl(235, 21%, 11%)');
        r.style.setProperty('--checkbox-border', 'hsl(236, 9%, 61%)');
        r.style.setProperty('--task-text-color', 'hsl(234, 39%, 85%)');
        r.style.setProperty('--active-color', 'hsl(264, 100%, 52%)');
        r.style.setProperty('--check-blue', 'hsl(233, 14%, 35%)');
        r.style.setProperty('--check-pink', 'hsl(234, 11%, 52%)');
        let t = getComputedStyle(r).getPropertyValue('--dark-background')
        r.style.setProperty('--header-background', `url(${t})`);
        modeIcon.textContent = 'brightness_6';
       
    }
 }

 renderMode();
saveAndRender();
















































