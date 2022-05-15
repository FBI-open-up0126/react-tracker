import "../BlueButton.scss";
import "./ListNotFound.scss";

export default function ListNotFound(): JSX.Element {
  return (
    <>
      <span>
        This tracker list is not found! Please recheck if you type in the url
        correctly, or
      </span>
      <button className="blue-button">
        create a tracker list with this name instead
      </button>
    </>
  );
}
