import FirebaseContext, {withFirebase} from './context';
import Firebase from './firebase';

/*For each component, it is recommended to keep everything of exports in index.js-files for easier import-management.*/
export default Firebase;

export { FirebaseContext,withFirebase };