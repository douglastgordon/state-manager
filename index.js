const createStore = reducer => {
  let state
  let listeners = []

  const getState = () => state

  const subscribe = listener => {
    const listenerIdx = listeners.length
    listeners = [...listeners, listener]

    return () => { // returns unsubscribe function
      listeners = [...listeners.slice(0, listenerIdx), ...listeners.slice(listenerIdx + 1)]
    }
  }

  const dispatch = action => {
    state = reducer(state, action)
    listeners.forEach(listener => {
      listener()
    })
    return action // for middleware
  }

  return {
    getState,
    subscribe,
    dispatch,
  }
}


const INCREMENT = "INCREMENT"
const DECREMENT = "DECREMENT"

const incrementCounter = () => ({type: INCREMENT})
const decrementCounter = () => ({type: DECREMENT})

const counter = (state=0, action) => {
  console.log(state, action)
  switch (action.type) {
    case INCREMENT:
      return state + 1
    case DECREMENT:
      return state - 1
    default:
      return state
  }
}

const store = createStore(counter)

const counterP = document.getElementById("counter")
const incrementButton = document.getElementById("increment")
const decrementButton = document.getElementById("decrement")
incrementButton.addEventListener("click", () => store.dispatch(incrementCounter()))
decrementButton.addEventListener("click", () => store.dispatch(decrementCounter()))

store.subscribe(() => {
  const state = store.getState()
  counterP.innerHTML = state
})
