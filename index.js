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

const actionCreators = {
  incrementCounter: () => ({type: INCREMENT}),
  decrementCounter: () => ({type: DECREMENT}),
}

const counter = (state=0, action) => {
  switch (action.type) {
    case INCREMENT:
      return state + 1
    case DECREMENT:
      return state - 1
    default:
      return state
  }
}

const combineReducers = reducers => (state={}, action) => (
  Object.entries(reducers).reduce((acc, [name, reducer]) => (
    Object.assign({}, acc, {[name]: reducer(state[name], action)})
  ), {})
)


const reducer = combineReducers({
  counter,
})

const logger = store => next => action => {
  console.table(store.getState())
  return next(action)
}

const applyMiddleware = middleware => createStore => reducer => {
  const store = createStore(reducer)
  return Object.assign({}, store, {
    dispatch: action => middleware(store)(store.dispatch)(action),
  })
}

const store = applyMiddleware(logger)(createStore)(reducer)

const bindActionCreators = (actionCreators, dispatch) => {
  return Object.entries(actionCreators).reduce((acc, [name, func]) => {
    return Object.assign({}, acc, {[name]: (...args) => dispatch(func(...args))})
  }, {})
}

const {
  incrementCounter,
  decrementCounter,
} = bindActionCreators(actionCreators, store.dispatch)



const counterP = document.getElementById("counter")
const incrementButton = document.getElementById("increment")
const decrementButton = document.getElementById("decrement")
incrementButton.addEventListener("click", incrementCounter)
decrementButton.addEventListener("click", decrementCounter)

store.subscribe(() => {
  const state = store.getState()
  counterP.innerHTML = state.counter
})
