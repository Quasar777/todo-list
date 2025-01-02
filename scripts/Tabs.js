import BaseComponent from "./BaseComponent.js"

const rootSelector = '[data-js-tabs]'

// для основной логики конкретной группы табов
class Tabs extends BaseComponent {
    
    selectors = {
        root: rootSelector,
        button: '[data-js-tabs-button]',
        content: '[data-js-tabs-content]',
    }
    
    stateClasses = {
        isActive: 'is-active',
    }

    // данный объект нам понадобиться, когда мы будем обновлять значения атрибутов дом элементов
    stateAttributes = {
        ariaSelected: 'aria-selected',
        tabIndex: 'tabindex',
    }

    constructor(rootElement) {
        super()
        this.rootElement = rootElement
        this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button)
        this.contentElements = this.rootElement.querySelectorAll(this.selectors.content)
        // сущность state - проксируемый объект
        this.state = this.getProxyState(
            {
                activeTabIndex: [...this.buttonElements]
                    .findIndex((buttonElement) => buttonElement.classList.contains(this.stateClasses.isActive)),
            }
        )
        // лимит индекса табов. Нужен для корректного управления табами с клавиатуры
        this.limitTabsIndex = this.buttonElements.length - 1
        this.bindEvents()
    }

    updateUI() {
        const { activeTabIndex } = this.state

        this.buttonElements.forEach((buttonElement, index) => {
            const isActive = index === activeTabIndex

            buttonElement.classList.toggle(this.stateClasses.isActive, isActive)
            buttonElement.setAttribute(this.stateAttributes.ariaSelected, isActive.toString())
            buttonElement.setAttribute(this.stateAttributes.tabIndex, isActive ? '0' : '-1')
        })

        this.contentElements.forEach((contentElement, index) => {
            const isActive = index === activeTabIndex

            contentElement.classList.toggle(this.stateClasses.isActive, isActive)
        })
    }

    activateTab(newTabIndex) {
        this.state.activeTabIndex = newTabIndex
        this.buttonElements[newTabIndex].focus()
    }

    previousTab = () => {
        const newTabIndex = this.state.activeTabIndex === 0
            ? this.limitTabsIndex
            : this.state.activeTabIndex - 1

        this.activateTab(newTabIndex)
    }

    nextTab = () => {
        const newTabIndex = this.state.activeTabIndex === this.limitTabsIndex
            ? 0
            : this.state.activeTabIndex + 1

        this.activateTab(newTabIndex)
    }

    firstTab = () => {
        this.activateTab(0)
    }

    lastTab = () => {
        this.activateTab(this.limitTabsIndex)
    }

    onButtonClick(buttonIndex) {
        this.state.activeTabIndex = buttonIndex
    }

    onKeyDown = (event) => {
        const { code, metaKey } = event
        
        // названия свойств - код клавиш, которые мы получем из объекта event
        const action = {
            ArrowLeft: this.previousTab,
            ArrowRight: this.nextTab,
            Home: this.firstTab,
            End: this.lastTab,
        }[code]

        // убеждаемся, что был зажат конкретный хоткей на клавиатуре мака
        const isMacHomeKey = metaKey && code === 'ArrowLeft'
        if (isMacHomeKey) {
            this.firstTab()
            return
        }

        const isMacEndKey = metaKey && code === 'ArrowRight'
        if (isMacEndKey) {
            this.lastTab()
            return
        }

        action?.()
        
    }

    // метод для привязки обработчиков событий к элементами
    bindEvents() {
        this.buttonElements.forEach((buttonElement, index) => {
            buttonElement.addEventListener('click', () => this.onButtonClick(index))
        })

        this.rootElement.addEventListener("keydown", this.onKeyDown)
    }
}

// для инициализации логики всех табов на одной странице
// этот класс будет заниматься точечным запуском экзмепляров класса Tabs
class TabsCollection {
    constructor() {
        this.init()
    }

    init() {
        document.querySelectorAll(rootSelector).forEach((element) => {
            new Tabs(element)
        })
    }
}


export default TabsCollection;