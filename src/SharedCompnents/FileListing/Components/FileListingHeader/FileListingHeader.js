
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
import FolderGrid from "../../../FolderGrid/FolderGrid";
import Folder from "../../../../Classes/Folder";


function FileListingHeader(props) {


    // Hader state
    const [headerState, setHeaderState] = useState("initial");
    const [favoritesActive, setFavoritesActive] = useState(false);


    function navigateToFolder(folder){
        Folder.getFolderDetails(
            folder.id,
            (response)=>{
                const folderToRedirect = Folder.castToFolder(response.data);
                folderToRedirect.setCurrentFolderInLocalStorage();
                props.reHydrateListing();
            },
            (request)=>{
                if (!Validate.isEmpty(request.response)) {
                    window.displayError(request.response.data.error);
                } else {
                    window.displayError("Something went wrong. Please try again later");
                }
            },
        )
    }

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
            {/*{(Validate.isArrayEmpty(props.files) && props.sortingPreferences.isEmpty()) ? "" : (*/}
                <div className='listing-sorting-and-layout-container'>
                    <div className='sorting-and-favorites'>

                        {(Validate.isNotEmpty(props.variation) && props.variation === "recent") ?
                            ""
                            :
                            <div className="sort-selector">
                                <SortSelector reHydrateListing={props.reHydrateListing} />
                            </div>
                        }

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

                        {(Validate.isNotEmpty(props.variation) && props.variation === "recent") ?
                            <span className="listing-name">Recent files</span> : ""
                        }
                        {(Validate.isNotEmpty(props.variation) && props.variation === "all-files") ?
                            <span className="listing-breadcrumb">
                                {props.currentFolder == null || props.currentFolder.isEmpty() ? "Home" :
                                    Validate.isArrayEmpty(props.currentFolder.breadcrumb) ? "" :
                                        (
                                            props.currentFolder.breadcrumb.map((breadcrumbItem)=>(
                                                <span
                                                    key={`breadcrumb_${breadcrumbItem.id}`}
                                                    className="breadcrumb-item"
                                                    onClick={()=>{navigateToFolder(breadcrumbItem)}}
                                                >{breadcrumbItem.name}</span>
                                            ))
                                        )
                                }
                            </span> : ""
                        }
                    </div>


                    <LayoutSelector setLayout={props.setLayout} />
                </div>
            {/*)}*/}

        </>
    );
}

export default FileListingHeader;

