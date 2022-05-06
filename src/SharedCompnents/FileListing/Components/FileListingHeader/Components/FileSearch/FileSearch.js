
import React, { useEffect, useState } from 'react';
import SortingPreferences from '../../../../../../Classes/SortingPreferences';

import UserFile from "../../../../../../Classes/UserFile";
import Validate from "../../../../../../Classes/Validate";
import { ReactComponent as CloseSvg } from "./imgs/cancel.svg";
import { ReactComponent as SearchSvg } from "./imgs/search.svg";


export default function FileSearch(props) {

    function openSearch() {
        props.setHeaderState("searching");
        document.getElementById("searchField").focus();
    }
    function closeSearch() {
        document.getElementById("searchField").value = "";
        updateSortingPreferences("");
        props.reHydrateListing()
        props.setHeaderState("initial");
    }
    function updateSortingPreferences(searchQuery) {
        const prefs = SortingPreferences.loadFromLoalStorage();
        prefs.searchQuery = searchQuery
        prefs.writeToLocalStorage();
        props.updateSortingPrefs();
    }

    function search(event) {
        const searchQuery = event.target.value;
        props.setLoadingAnimationState(true);
        updateSortingPreferences(searchQuery);
        props.reHydrateListing()
        props.updateSortingPrefs();
    }

    return (
        <>
            <div className="listing-header-btn search-container" onClick={openSearch}>
                <SearchSvg />
                <input type="text" placeholder='Search' id="searchField" onKeyUp={search}></input>
            </div>
            <button className='close-search' onClick={closeSearch}>
                <CloseSvg />
            </button>
        </>
    )
}