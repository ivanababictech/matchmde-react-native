import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from 'App/Sagas'
// import { reducer as ExampleReducer } from './Example/Reducers'
import { reducer as StartupReducer } from './Startup/Reducers'
import { reducer as UserReducer } from './User/Reducers'
import { reducer as DatingReducer } from './Dating/Reducers'

export default () => {
  const rootReducer = combineReducers({
    /**
     * Register your reducers here.
     * @see https://redux.js.org/api-reference/combinereducers
     */
    // example: ExampleReducer,
    startup: StartupReducer,
    user:UserReducer,
    dating:DatingReducer
  });

  return configureStore(rootReducer, rootSaga)
}
