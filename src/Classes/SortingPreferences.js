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

    static loadFromLoalStorage() {
        const prefs = localStorage.getItem("sortingPreferences");
        if (Validate.isEmpty(prefs)) {
            return new SortingPreferences();
        }

        let prefsJson = null;
        try {
            prefsJson = JSON.parse(prefs);
            if (prefsJson == null) {
                throw 'could not parse';
            }
        } catch (e) {
            return new SortingPreferences();
        }

        const sortingPreferences = new SortingPreferences();
        for (const property in prefsJson) {
            sortingPreferences[property] = prefsJson[property];
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