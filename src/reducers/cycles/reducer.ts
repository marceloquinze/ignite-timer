export interface Cycle {
  id: string // Cycle ID
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export enum ActionTypes {
  ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
  INTERRUPT_CURRENT_CYCLE = 'INTERRUPT_CURRENT_CYCLE',
  MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED',
}

export function cyclesReducer(state: CyclesState, action: any) {
  // state corresponds to the same value as the cyclesState variable. Inside the reducer, we always call it 'state'
  // it can contain a simple state, or more objects (in this case, look at the interface above)
  // dispatch is a function used to trigger the useReducer action, not a function that alters the state as in useState
  // every action goes within an if or switch block. So, when we say dispatch('blabla'), 'blabla' corresponds to one of the actions below

  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      // The new value the state will receive whenever the action is triggered
      return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      }
    case ActionTypes.INTERRUPT_CURRENT_CYCLE:
      return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, interruptedDate: new Date() }
          } else {
            return cycle
          }
        }),
        activeCycleId: null,
      }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
      return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, finishedDate: new Date() }
          } else {
            return cycle
          }
        }),
        activeCycleId: null,
      }

    // By default, return the state itself
    default:
      return state
  }
}
