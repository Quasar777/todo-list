class BaseComponent {
    constructor() {
        if (this.constructor === BaseComponent) {
            throw new Error("Невозможно создать экземпляр асбтрактного класса BaseComponent.")
        }
    }

    getProxyState(initialState) {
        return new Proxy(initialState, {
            get: (target, prop) => {
                return target[prop]
            },
            set: (target, prop, newValue) => {
                const oldValue = target[prop]
                
                target[prop] = newValue

                if (oldValue !== newValue) {
                    this.updateUI()
                }

                return true
            },
        })
    }

    // перерисовка контента в ответ на обновление состояния
    updateUI() {
        throw new Error("Необходимо реализовать метод updateUI!")
    }
}

export default BaseComponent