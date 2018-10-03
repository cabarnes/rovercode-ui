import { combineReducers } from 'redux';
import code from './code';
import console from './console';
import rover from './rover';
import sensor from './sensor';

export default combineReducers({
  code,
  console,
  rover,
  sensor,
});