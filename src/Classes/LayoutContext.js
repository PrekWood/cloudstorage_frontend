import Model from "./Model";
import SortingPreferences from "./SortingPreferences";
import Folder from "./Folder";
import Validate from "./Validate";

export default class LayoutContext extends Model{

    constructor() {
        super();
        this.sortingPreferences = new SortingPreferences();
        this.currentFolder = new Folder();
    }

    static newLayoutContext(){
        const context = new LayoutContext();
        context.sortingPreferences = new SortingPreferences();
        context.currentFolder = new Folder();
        return context
    }

    static getContext(contextName){
        let contextString = localStorage.getItem(contextName);
        if (Validate.isEmpty(contextString)) {
            return LayoutContext.newLayoutContext()
        }

        let contextJson = null;
        try {
            contextJson = JSON.parse(contextString);
            if (contextJson == null) {
                throw "could not parse"
            }
        } catch (e) {
            return LayoutContext.newLayoutContext()
        }

        const context = new LayoutContext();
        if ("sortingPreferences" in contextJson) {
            context.sortingPreferences = new SortingPreferences();
            for (const property in contextJson.sortingPreferences) {
                context.sortingPreferences[property] = contextJson.sortingPreferences[property];
            }
        }
        if ("currentFolder" in contextJson) {
            context.currentFolder = new Folder();
            for (const property in contextJson.currentFolder) {
                context.currentFolder[property] = contextJson.currentFolder[property];
            }
        }
        // console.log("loadContext: ");
        // console.log(context);
        return context;
    }

    static saveContext(contextName,context){
        // console.log("saveContext: ");
        // console.log(context);
        localStorage.setItem(contextName, JSON.stringify(context));
    }
}
