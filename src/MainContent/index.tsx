import React from "react";
import { Route, Routes } from "react-router-dom";
import { saveToDatabase } from "../Util/Database";
import Help from "./Help";
import "./index.scss";
import ListNotFound from "./ListNotFound";
import PageNotFound from "./PageNotFound";
import { Settings } from "./Settings";
import TrackerListDisplay, { TrackerListData } from "./TrackerList/index";

function testAddData() {
    // const trackerListTest = new TrackerListData("Test");
    // trackerListTest.lists.push(
    //     {
    //         title: "Dates",
    //         type: "date",
    //         values: [
    //             new Date(),
    //             new Date(),
    //             new Date(),
    //             new Date(),
    //             new Date(),
    //         ],
    //     },
    //     {
    //         title: "Money",
    //         type: "number",
    //         values: [10, 20, 30, 40, 50],
    //     },
    //     {
    //         title: "Descriptions",
    //         type: "string",
    //         values: ["Today", "What", "The", "Fucking", "HAHA"],
    //     }
    // );
    // const sportsRecord = new TrackerListData("Sports Record");
    // sportsRecord.lists.push(
    //     {
    //         title: "Dates",
    //         type: "date",
    //         values: [
    //             new Date(),
    //             new Date(),
    //             new Date(),
    //             new Date(),
    //             new Date(),
    //         ],
    //     },
    //     {
    //         title: "Laps Run",
    //         type: "number",
    //         values: [10, 12, 11, 12, 10],
    //     },
    //     {
    //         title: "Ladders Lifted",
    //         type: "number",
    //         values: [50, 45, 60, 55, 50],
    //     }
    // );
    // (async () => {
    //     try {
    //         await saveToDatabase(
    //             "tracker-lists",
    //             trackerListTest.toDatabaseFormat()
    //         );
    //         await saveToDatabase(
    //             "tracker-lists",
    //             sportsRecord.toDatabaseFormat()
    //         );
    //     } catch (err) {
    //         console.warn(
    //             `Something went wrong when saving to database (Error: ${err})`
    //         );
    //     }
    // })();
}

type Props = {};
type State = {
    trackerLists: TrackerListData[] | null;
};

export default class MainContent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        testAddData();

        this.state = {
            trackerLists: null,
        };
    }

    loadData = async () => {
        this.setState({
            trackerLists: await TrackerListData.loadFromDatabase(),
        });
    };

    componentDidMount = () => {
        this.loadData();
    };

    render = (): React.ReactNode => {
        const data = this.state.trackerLists ?? [];

        const routes = data.map(value => {
            console.log(`encoded "${value.id}" to "${encodeURI(value.id)}"`);

            return (
                <Route
                    key={value.id}
                    path={encodeURI(value.id)}
                    element={<TrackerListDisplay list={value} />}
                />
            );
        });

        return (
            <div className="main-content">
                <Routes>
                    <Route key="home-page" path="" />
                    <Route key="help" path="help" element={<Help />} />
                    <Route
                        key="settings"
                        path="settings"
                        element={<Settings />}
                    />
                    <Route key="404" path="*" element={<PageNotFound />} />
                    <Route key="list" path="list">
                        {routes}
                        <Route key="404" path="*" element={<ListNotFound />} />
                    </Route>
                </Routes>
                {/* <TrackerListDisplay list={trackerListTest} /> */}
            </div>
        );
    };
}
