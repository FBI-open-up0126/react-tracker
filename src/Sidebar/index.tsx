import "./index.scss";
import Other from "./Other";
import TrackList from "./TrackList";

export default function Sidebar(): JSX.Element {
  return (
    <div className="side-bar">
      <TrackList />
      <Other />
    </div>
  );
}
