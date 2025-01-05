const selectors = {
    root: '[data-js-tabs]',
    mainList: '[data-js-tasks-main-list]',    
    taskInnerList: '[data-js-tasks-inner-list]',
    addTaskButton: '[data-js-add-task-button]',
    categoryInput: '[data-js-task-category-add-input]',
    taskInput: '[data-js-task-add-input]',
    modalButton: '[data-js-confirm-task-button]',
    modalWindow: '[data-js-modal-add-task]',
    darkBg: '[data-js-dark-bg]',
    deleteTaskButton: '[data-js-delete-task-button]',
}

const addTaskButtonElement = document.querySelector(selectors.addTaskButton);
const modalWindowElement = document.querySelector(selectors.modalWindow)
const darkBgElement = document.querySelector(selectors.darkBg)
const modalAddTaskButtonElement = document.querySelector(selectors.modalButton)
const modalInputCategoryElement = document.querySelector(selectors.categoryInput)
const modalInputTaskElement = document.querySelector(selectors.taskInput)
const CurrentMainTaskListElement = document.querySelector(selectors.mainTaskList)

function showModal() {
    modalWindowElement.classList.toggle('visually-hidden')
    darkBgElement.classList.toggle('visually-hidden')
}

function checkCategory(category) {
    category = category.toLowerCase()
    let hasCategory = false
    const tabsBody = document.querySelector('.tabs__body')
    let currentTabContent = tabsBody.querySelector('.tabs__content.is-active')

    if (!currentTabContent) {
        throw new Error("контент таба не найден")
    }

    let currentTaskCategoryList = currentTabContent.querySelector(selectors.mainList)
    let currentCategoryItems = [...currentTaskCategoryList.children]

    currentCategoryItems.forEach((item) => {
        const currentCategory = item.firstElementChild.textContent.trim().toLowerCase()
        if (currentCategory === category) {
            hasCategory = true
        }
    })

    return { hasCategory, currentTaskCategoryList, currentCategoryItems } 
}

function createNewCategory(category, task) {
    
    let newCategoryItemElement = document.createElement("li")
    newCategoryItemElement.classList.add("task-category-list__item")

    let newCategoryItemTitleElement = document.createElement("p")
    newCategoryItemTitleElement.classList.add("task-category-list__item-title")
    newCategoryItemTitleElement.textContent = `${category}`
 
    let newTaskListElement = document.createElement("ul")
    newTaskListElement.classList.add("tasks-list")

    let newTaskElement = createNewTask(task)
    
    newCategoryItemElement.append(newCategoryItemTitleElement)
    newCategoryItemElement.append(newTaskListElement)
    newTaskListElement.append(newTaskElement)

    return newCategoryItemElement
    
}

function createNewTask(task) {
    let newTaskElement = document.createElement("li")
    newTaskElement.classList.add("tasks-list__item", 'task-card')

    let newCheckboxLabelElement = document.createElement("label")
    newCheckboxLabelElement.classList.add("checkbox")

    let newChecboxInputElement = document.createElement("input")
    newChecboxInputElement.classList.add("checkbox__input")
    newChecboxInputElement.type = "checkbox"
    newCheckboxLabelElement.append(newChecboxInputElement)

    let newSpanElement = document.createElement("span")
    newSpanElement.classList.add("checkbox__label")
    newSpanElement.textContent = `${task}`

    let newDeleteButtonElement = document.createElement("button")
    newDeleteButtonElement.setAttribute("type", "button")
    newDeleteButtonElement.dataset.jsDeleteTaskButton
    newDeleteButtonElement.classList.add("task-card__delete-button")
    newDeleteButtonElement.textContent = "✕"


    newTaskElement.append(newCheckboxLabelElement)
    newTaskElement.append(newDeleteButtonElement)
    newCheckboxLabelElement.append(newSpanElement)

    return newTaskElement
}

function addNewTask(category, task) {


    let { hasCategory, currentTaskCategoryList} = checkCategory(category, task)
    
    if (hasCategory) {
        let currentTasksList = [...currentTaskCategoryList.querySelectorAll(".task-category-list__item")]
        let currentTaskItem = null
    
        currentTasksList.forEach((elem) => {
            let categoryTitle = elem.firstElementChild.textContent.toLowerCase()
            if (categoryTitle === category.toLowerCase()) {
                currentTaskItem = elem.lastElementChild
            }
        })
    
        currentTaskItem.append(createNewTask(task))
    } else {
        if (currentTaskCategoryList) {
            currentTaskCategoryList.append(createNewCategory(category, task))
        } else {
            throw new Error("не удалось найти список задач для текущей категории.")
        }
        
    }  
    

}

const onAddButtonClick = () => {
    showModal()
}

const onModalButtonClick = () => {
    const categoryInputValue = modalInputCategoryElement.value.trim()
    const taskInputValue = modalInputTaskElement.value.trim()

    if (categoryInputValue === "" || taskInputValue === "") {
        console.log("ERROR")
    } else {
        showModal()
        addNewTask(categoryInputValue, taskInputValue)
    }
}

addTaskButtonElement.addEventListener("click", onAddButtonClick)
modalAddTaskButtonElement.addEventListener("click", onModalButtonClick)


const deleteTask = (element) => {
    
    const parentTasksListElement = element.closest(".tasks-list")
    const parentTaskElement = element.closest(".task-card")
    parentTaskElement.remove()

    if (parentTasksListElement.children.length === 0) {
        parentTasksListElement.closest(".task-category-list__item").remove()
    }

    
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains("task-card__delete-button")) {
        deleteTask(event.target)
    }
})