/**
 * Creates a signal with an initial value.
 * @param {*} initialValue - The initial value of the signal.
 * @returns {object} - An object with properties and methods to interact with the signal.
 */
export function createSignal(initialValue) {
    let _value = initialValue;
    let _subscribers = new Set();

    /**
     * Notifies all subscribers with the current value of the signal.
     */
    function notify() {
        _subscribers.forEach((callback) => {
            callback(_value);
        });
    }

    return {
        /**
         * Gets the current value of the signal.
         * @returns {*} - The current value of the signal.
         */
        get value() { return _value },

        /**
         * Sets the value of the signal and notifies all subscribers.
         * @param {*} value - The new value of the signal.
         */
        set value(value) {
            _value = value;
            notify()
        },

        /**
         * Subscribes a callback function to the signal.
         * The callback will be called whenever the value of the signal changes.
         * @param {function} subscriber - The callback function to be subscribed.
         */
        subscribe: (subscriber) => {
            _subscribers.add(subscriber);
            notify()
        }
    }
}