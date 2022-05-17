import Validate from "./Validate";
import Model from "./Model";

export default class SortingPreferences extends Model {

    constructor() {
        super();
        this.orderBy = null;
        this.orderWay = null;
        this.onlyFavorites = null;
        this.searchQuery = null;
    }

    static loadFromLocalStorage(contextName = "sortingPreferences") {
        const context = localStorage.getItem(contextName);
        if (Validate.isEmpty(context)) {
            return new SortingPreferences();
        }

        let contextJson = null;
        try {
            contextJson = JSON.parse(context);
            if (contextJson == null) {
                throw 'could not parse';
            }
        } catch (e) {
            return new SortingPreferences();
        }

        const sortingPreferences = new SortingPreferences();
        for (const property in contextJson.sortingPreferences) {
            sortingPreferences[property] = contextJson.sortingPreferences[property];
        }
        return sortingPreferences;
    }

    static writeToLocalStorage(preferences) {
        localStorage.setItem("sortingPreferences", JSON.stringify(preferences));
    }
    writeToLocalStorage() {
        localStorage.setItem("sortingPreferences", JSON.stringify(this));
    }
}