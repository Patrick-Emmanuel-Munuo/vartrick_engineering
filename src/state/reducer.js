// dependencies
import initialState from "./state"

// reducer
function reducer(state, payload) {
    try {
        // Ensure payload is a valid object
        if (!payload || typeof payload !== "object") {
            return state
        }
        // Merge existing state with payload
        const newStateValues = { ...state, ...payload }
        // Get the first key in payload as action type
        const stateKeys = Object.getOwnPropertyNames(payload)
        const type = stateKeys?.[0] ?? null
        // If type includes "Error", set disabled true
        if (type && type.includes("Error")) {
            return { ...newStateValues, disabled: true }
        }
        // Actions that do not change disabled state
        if (["authenticated", "disabled", "loading"].includes(type)) {
            return newStateValues
        }
        // Unmount action resets state but keeps some values
        if (type === "unMount") {
            return {
                ...initialState,
                authenticated: state?.authenticated ? true : false,
                notification: state?.notification || ""
            }
        }
        // Default: update state, clear corresponding error, enable form
        return {
            ...newStateValues,
            ...(type ? { [`${type}Error`]: "" } : {}),
            disabled: false
        }
    } catch (error) {
        console.error("Reducer error:", error?.message || error)
        return state
    }
}

/* export default reducer for global accessibility */
export default reducer
