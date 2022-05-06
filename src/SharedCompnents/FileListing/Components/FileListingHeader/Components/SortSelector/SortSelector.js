
import React, { useEffect, useState } from 'react';

import "./SortSelector.css";
import SortingPreferences from "./../../../../../../Classes/SortingPreferences";
import Select from "./../../../../../../SharedCompnents/Select/Select";

import dateAddAscSvg from "./imgs/date_add_asc.svg";
import dateAddDescSvg from "./imgs/date_add_desc.svg";
import fileNameAscSvg from "./imgs/name_asc.svg";
import fileNameDescSvg from "./imgs/name_desc.svg";
import arrowSvg from "./imgs/arrow.svg";

export default function SortSelector(props) {

    const sortingOptions = [
        {
            id: 1,
            name: "",
            orderBy: "date_add",
            orderWay: "desc",
            svg: dateAddDescSvg
        },
        {
            id: 2,
            name: "",
            orderBy: "date_add",
            orderWay: "asc",
            svg: dateAddAscSvg
        },
        {
            id: 3,
            name: "",
            orderBy: "name",
            orderWay: "desc",
            svg: fileNameDescSvg
        },
        {
            id: 4,
            name: "",
            orderBy: "name",
            orderWay: "asc",
            svg: fileNameAscSvg
        }
    ];

    function changeSorting(sortingOption) {
        // Update sorting preferences in the localstorage
        const sortingPreferences = SortingPreferences.loadFromLoalStorage();
        sortingPreferences.orderBy = sortingOption.orderBy;
        sortingPreferences.orderWay = sortingOption.orderWay;
        sortingPreferences.writeToLocalStorage();

        props.reHydrateListing();
    }

    return (
        <div className='listing-sorting'>
            <Select
                id="sorting_select"
                name="sorting-select"
                class="sorting-select"
                options={sortingOptions}
                arrowIcon={arrowSvg}
                callBack={changeSorting}
            />
        </div>
    )
}