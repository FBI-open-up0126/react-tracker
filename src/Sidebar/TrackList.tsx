import "./TrackList.scss";
import "../NoSelect.scss";
import { Link } from "react-router-dom";
import { listURL } from "../Util/ListURL";
import React from "react";
import { TrackerListData } from "../MainContent/TrackerList/index";

export default function TrackList() {
    const [trackerList, setTrackerList] = React.useState<
        TrackerListData[] | null
    >(null);

    const openMasturbationRecords = () => {
        console.log("Opening masturbation records!!!");
    };

    React.useEffect(() => {
        TrackerListData.loadFromDatabase().then(value => {
            setTrackerList(value);
        });
    }, []);

    const lists = (trackerList ?? []).map(value => {
        return (
            <li key={value.id}>
                <Link to={listURL(value.id)} key={value.id}>
                    {value.id}
                </Link>
            </li>
        );
    });

    return (
        <div className="track-list-container">
            <ul className="track-list no-select">{lists}</ul>
        </div>
    );
}
