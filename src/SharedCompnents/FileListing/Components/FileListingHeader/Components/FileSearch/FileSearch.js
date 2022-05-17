
import React, { useEffect, useState } from 'react';
import SortingPreferences from '../../../../../../Classes/SortingPreferences';

import UserFile from "../../../../../../Classes/UserFile";
import Validate from "../../../../../../Classes/Validate";
import { ReactComponent as CloseSvg } from "./imgs/cancel.svg";
import { ReactComponent as SearchSvg } from "./imgs/search.svg";
import LayoutContext from "../../../../../../Classes/LayoutContext";


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
        const context = LayoutContext.getContext(props.contextName)
        context.sortingPreferences.searchQuery = searchQuery;
        LayoutContext.saveContext(props.contextName,context);
        props.updateSortingPrefs();
    }

    function search(event) {
        const searchQuery = event.target.value;
        props.setLoadingAnimationState(true);
        updateSortingPreferences(searchQuery);
        props.reHydrateListing()
        props.updateSortingPrefs();
    }

    useEffect(()=>{
        const context = LayoutContext.getContext(props.contextName);
        const searchQuery = context.sortingPreferences.searchQuery;
        if(Validate.isEmpty(searchQuery)){
            return;
        }

        openSearch();
        document.getElementById("searchField").value = searchQuery;
    },[])

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