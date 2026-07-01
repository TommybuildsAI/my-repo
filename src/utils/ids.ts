import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

/** Generate a unique id. Prefixes make ids readable in logs/storage. */
export function newId(prefix = 'id'): string {
  return `${prefix}_${uuidv4()}`;
}
