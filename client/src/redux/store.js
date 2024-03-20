import { combineReducers,configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const rootReducer = combineReducers({user: userReducer});

const persistConfig=  {
    key: 'root',
    storage,
    version : 1
}
// Persist Reducer used to store the user data in the local storage of the browser 
// such that if we reload our page, the details of the user still exist
const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})

export const persistor = persistStore(store);