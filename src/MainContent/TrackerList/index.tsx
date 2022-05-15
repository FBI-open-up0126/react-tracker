import { Alert } from "@mui/material";
import { height } from "@mui/system";
import React from "react";
import "../../BlueButton.scss";
import { cursorDatabase, saveToDatabase } from "../../Util/Database";
import "../../Util/DateExtension";
import MarkdownEdit from "../../Util/MarkdownEdit";
import "./index.scss";

export type ListType = "string" | "date" | "number";

export type List = {
    /**
     * The title of the list
     */
    title: string;

    /**
     * The type of this list. There can be multiple types,
     * e.g. a string list which is just a list of descriptions,
     * or, there could be a list of number which we might use
     * to track numeric data.
     */
    type: ListType;

    /**
     * The values of the list
     */
    values: any[];
};

export type TrackerListDatabaseFormat = {
    id: string;
    lists: List[];
};

/**
 * A list. It will always contains a list of dates,
 * which is the dates array.
 */
export class TrackerListData {
    private m_id: string;
    private m_lists: List[] = [];
    private triggerUnsavedChanges: (yes: boolean) => void = _ => {};

    public constructor(id: string) {
        this.m_id = id;
    }

    public static fromDatabaseFormat = ({
        id,
        lists,
    }: TrackerListDatabaseFormat): TrackerListData => {
        const data = new TrackerListData(id);
        data.m_lists = lists;

        return data;
    };

    public setTriggerUnsavedChanges = (func: (yes: boolean) => void) => {
        this.triggerUnsavedChanges = func;
    };

    public static loadFromDatabase = async (): Promise<TrackerListData[]> => {
        const list: TrackerListData[] = [];

        await cursorDatabase("tracker-lists", value => {
            list.push(TrackerListData.fromDatabaseFormat(value));
        });

        return list;
    };

    public add = (date?: Date) => {
        for (const list of this.m_lists) {
            switch (list.type) {
                case "date":
                    list.values.push(date ?? new Date());
                    break;
                case "number":
                    list.values.push(0);
                    break;
                case "string":
                    list.values.push("");
            }
        }

        this.triggerUnsavedChanges(true);
    };

    public get id() {
        return this.m_id;
    }

    public get lists() {
        return this.m_lists;
    }

    public changeList = (func: (list: List[]) => void) => {
        func(this.m_lists);
        this.triggerUnsavedChanges(true);
    };

    public toDatabaseFormat = (): TrackerListDatabaseFormat => {
        return {
            id: this.m_id,
            lists: this.m_lists,
        };
    };
}

/**
 * this will map the list into a tr(table row) array which contains td(table data) for
 * display
 * @param list the list to convert to
 */
function mapToDisplayList(
    list: TrackerListData,
    onDataChange: (
        dataType: ListType,
        event: HTMLElement,
        indices: [number, number]
    ) => void
): JSX.Element[] {
    const table: JSX.Element[] = [];
    const lists = list.lists;

    for (let i = 0; i < lists[0].values.length; i++) {
        const row: JSX.Element[] = [];

        for (let j = 0; j < lists.length; j++) {
            const column = lists[j];

            let content: JSX.Element;

            switch (column.type) {
                case "date": {
                    const date = column.values[i] as Date | null;

                    let formattedDate: string =
                        date === null ? "" : date.toInputDateString();

                    content = (
                        <div className="centered">
                            <input
                                type="date"
                                defaultValue={formattedDate}
                                // onChange={e => {
                                //     const valueAsDate = e.target.valueAsDate;

                                //     const date =
                                //         valueAsDate === null
                                //             ? null
                                //             : valueAsDate.inputDateToLocalDate();
                                //     column.values[i] = date;
                                // }}
                                onChange={e => {
                                    onDataChange("date", e.target, [j, i]);
                                }}
                            />
                        </div>
                    );
                    break;
                }

                case "number": {
                    content = (
                        <div className="centered">
                            <input
                                type="number"
                                defaultValue={(
                                    column.values[i] as number
                                ).toString()}
                                // onChange={e => {
                                //     column.values[i] = e.target.valueAsNumber;
                                // }}
                                onChange={e => {
                                    onDataChange("number", e.target, [j, i]);
                                }}
                            />
                        </div>
                    );
                    break;
                }

                case "string": {
                    content = (
                        <div className="string-cell">
                            <MarkdownEdit
                                defaultValue={column.values[i] as string}
                                // onChange={e => {
                                //     column.values[i] = e.target.value;
                                // }}
                                onChange={e => {
                                    onDataChange("string", e.target, [j, i]);
                                }}
                            />
                        </div>
                    );
                    break;
                }
            }

            row.push(<td key={`${list.id}-${j}-${i}`}>{content}</td>);
        }

        table.push(<tr key={`${list.id}-${i}`}>{row}</tr>);
    }

    return table;
}

type Props = {
    list: TrackerListData;
};
type State = {
    showSavedAlert: boolean;
};

export default class TrackerListDisplay extends React.Component<Props, State> {
    currentTimeout: NodeJS.Timeout | null = null;

    constructor(props: Props) {
        super(props);

        this.state = {
            showSavedAlert: false,
        };
    }

    componentDidMount = () => {
        document.onkeydown = e => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                this.save();

                this.setState({ showSavedAlert: true });
                this.haveUnsavedChanges(false);

                if (this.currentTimeout !== null) {
                    clearTimeout(this.currentTimeout);
                }

                this.currentTimeout = setTimeout(() => {
                    this.currentTimeout = null;
                    this.setState({ showSavedAlert: false });
                }, 1000);
            }
        };

        this.props.list.setTriggerUnsavedChanges(this.haveUnsavedChanges);
    };

    render = (): React.ReactNode => {
        const lists = this.props.list.lists;

        const titles = lists.map(value => {
            return <th key={value.title}>{value.title}</th>;
        });

        const contents = mapToDisplayList(
            this.props.list,
            (dataType, e, indices) => {
                let value: any;

                switch (dataType) {
                    case "date":
                        const date = (e as HTMLInputElement).valueAsDate;
                        value =
                            date === null ? null : date.inputDateToLocalDate();
                        break;

                    case "number":
                        value = (e as HTMLInputElement).valueAsNumber;
                        break;

                    case "string":
                        value = (e as HTMLTextAreaElement).value;
                        break;
                }

                this.props.list.changeList(list => {
                    list[indices[0]].values[indices[1]] = value;
                });
            }
        );

        return (
            <div className="content-table">
                <table>
                    <thead>
                        <tr>{titles}</tr>
                    </thead>
                    <tbody>{contents}</tbody>
                </table>
                <div className="add-button-div">
                    <button className="blue-button" onClick={this.addRow}>
                        Add Row
                    </button>
                </div>
                <div className="alert-box">
                    <Alert
                        severity="info"
                        style={{
                            display: this.state.showSavedAlert
                                ? "block"
                                : "none",
                            fontSize: "1.4em",
                            width: "280px",
                            height: "100px",
                            margin: "auto",
                            marginTop: "calc(50vh - 100px)",
                        }}
                    >
                        Saved Successfully!
                    </Alert>
                </div>
            </div>
        );
    };

    addRow = () => {
        this.props.list.add();
        this.forceUpdate();
    };

    componentWillUnmount = () => {
        document.onkeydown = null;
    };

    save = () => {
        saveToDatabase("tracker-lists", this.props.list.toDatabaseFormat());
    };

    haveUnsavedChanges = (yes: boolean) => {
        if (yes) {
            window.onbeforeunload = event => {
                event.preventDefault();

                return "There are unsaved changes. Are you sure you want to exit? (Press ctrl-s to save)";
            };
        } else {
            window.onbeforeunload = null;
        }
    };
}
