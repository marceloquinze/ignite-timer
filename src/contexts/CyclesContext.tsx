import { ReactNode, createContext, useReducer, useState } from 'react'

// Interfaces
interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string // Cycle ID
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

// Context Interface
interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

// Context Provider
export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // Hooks
  // This state is an array of cycles and starts as an array of cycles
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      // state corresponds to the same value as the cyclesState variable. Inside the reducer, we always call it 'state'
      // it can contain a simple state, or more objects (in this case, look at the interface above)
      // dispatch is a function used to trigger the useReducer action, not a function that alters the state as in useState
      // every action goes within an if or switch block. So, when we say dispatch('blabla'), 'blabla' corresponds to one of the actions below

      switch (action.type) {
        case 'ADD_NEW_CYCLE':
          // The new value the state will receive whenever the action is triggered
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          }
        case 'INTERRUPT_NEW_CYCLE':
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
        case 'MARK_CURRENT_CYCLE_AS_FINISHED':
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
    },
    {
      cycles: [],
      activeCycleId: null,
    },
  ) // initial state of the reducer

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { activeCycleId, cycles } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      },
    })
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finishedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    // Every time I'm changing a state that depends on its previous version, this state value needs
    // to be set as an arrow function (closure). So instead of:
    // setCycles([...cycles, newCycle]), we'll have it like the code below, where (state) means the actual state:
    // setCycles((state) => [...state, newCycle])
    // See: https://app.rocketseat.com.br/classroom/projeto-02/group/funcionalidades-da-aplicacao/lesson/iniciando-novo-ciclo

    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_NEW_CYCLE',
      payload: {
        activeCycleId,
      },
    })
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, interruptedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )
    // setActiveCycleId(null)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
