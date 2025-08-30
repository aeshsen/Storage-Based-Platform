import { v4 as uuidv4 } from 'uuid';

function uuidToNumber() {
  return parseInt(uuidv4().replace(/-/g, '').slice(0, 15), 16);
}

export default uuidToNumber;