
import React, { useDebugValue, useEffect, useState } from 'react';
import "./FileListingHeader.css";
import UserFile from "./../../../../Classes/UserFile";
import Validate from "./../../../../Classes/Validate";
import FileUploader from "./Components/FileUploader/FileUploader";
import FileSearch from "./Components/FileSearch/FileSearch";
import LayoutSelector from "./Components/LayoutSelector/LayoutSelector";
import SortSelector from "./Components/SortSelector/SortSelector";

import starSvg from "./imgs/star.svg";
import starSvgFull from "./imgs/star-full.svg";
import SortingPreferences from '../../../../Classes/SortingPreferences';
import userEvent from '@testing-library/user-event';


function FileListingHeader(props) {


    // Hader state
    const [headerState, setHeaderState] = useState("initial");
    const [favoritesActive, setFavoritesActive] = useState(false);

    return (
        <>
            <div className={`listing-header ${headerState == "searching" ? "search" : ""}`}>
                <span id="logo_text">cloudstorage.tech</span>
                <div className={`listing-header-btns ${(Validate.isArrayEmpty(props.files) && props.sortingPreferences.isEmpty()) ? "empty" : ""}`} >
                    <FileUploader
                        reHydrateListing={props.reHydrateListing}
                        updateSortingPrefs={props.updateSortingPrefs}
                    />
                    {(Validate.isArrayEmpty(props.files) && props.sortingPreferences.isEmpty()) ? "" : (
                        <FileSearch
                            reHydrateListing={props.reHydrateListing}
                            updateSortingPrefs={props.updateSortingPrefs}
                            setHeaderState={setHeaderState}
                            setLoadingAnimationState={props.setLoadingAnimationState}
                        />
                    )}
                </div>
            </div>
            {(Validate.isArrayEmpty(props.files) && props.sortingPreferences.isEmpty()) ? "" : (
                <div className='listing-sorting-and-layout-container'>
                    <div>
                        <SortSelector reHydrateListing={props.reHydrateListing} />
                        {/* FavoritesToggler */}
                        <button
                            className="favorites-toggler"
                            onClick={() => {
                                setFavoritesActive(!favoritesActive);
                                const sortingPrefs = SortingPreferences.loadFromLoalStorage();
                                sortingPrefs.onlyFavorites = !favoritesActive;
                                sortingPrefs.writeToLocalStorage();
                                props.reHydrateListing();
                                props.updateSortingPrefs()
                            }}
                        >
                            <img src={favoritesActive ? starSvgFull : starSvg} />
                        </button>
                    </div>
                    <LayoutSelector setLayout={props.setLayout} />
                </div>
            )}

        </>
    );
}

export default FileListingHeader;

