
import React, { useEffect, useState } from 'react';

import Switch from "./../../../../../Switch/Switch";


import gridSvg from "./imgs/grid.svg";
import listSvg from "./imgs/list.svg";

export default function LayoutSelector(props) {
    const layoutOptions = [
        {
            name: "grid",
            svg: gridSvg
        },
        {
            name: "list",
            svg: listSvg
        }
    ]

    function layoutChange(selectedLayout) {
        const layout = layoutOptions[selectedLayout];
        console.log("FileListingHeader setLayout " + layout.name)
        props.setLayout(layout.name);
    }

    return (
        <div className='listing-layout'>
            <Switch
                options={layoutOptions}
                callBack={layoutChange}
            />
        </div>
    )
}