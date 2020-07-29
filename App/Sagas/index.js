import { takeLatest, all } from 'redux-saga/effects'
import { StartupTypes } from 'App/Stores/Startup/Actions'
import { UserActionTypes } from 'App/Stores/User/Actions'
import { DateActionTypes } from 'App/Stores/Dating/Actions'

import { startup } from './StartupSaga'
import { fetchAllInformation } from './UserSaga'
import { fetchDiscovering } from './DatingSaga'

export default function* root() {
  yield all([    
    takeLatest(StartupTypes.STARTUP, startup),    
    takeLatest(UserActionTypes.FETCH_ALL_INFORMATION, fetchAllInformation),

	takeLatest(DateActionTypes.FETCH_DISCOVERING, fetchDiscovering),    
  ])
}
