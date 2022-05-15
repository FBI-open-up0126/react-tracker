import React from "react";
import ReactMarkdown from "react-markdown";

type Props = {
    defaultValue?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function MarkdownEdit({
    defaultValue,
    onChange,
}: Props): JSX.Element {
    const [isFocused, setIsFocused] = React.useState(false);
    const currentValue = React.useRef(defaultValue ?? "");

    if (isFocused) {
        return (
            <textarea
                onBlur={() => setIsFocused(false)}
                defaultValue={currentValue.current}
                onChange={event => {
                    currentValue.current = event.target.value;
                    if (onChange) {
                        onChange(event);
                    }
                }}
                autoFocus={true}
            />
        );
    } else {
        return (
            <div onClick={() => setIsFocused(true)}>
                <ReactMarkdown>
                    {/* Prevent the div with zero height by using the non breaking space character */}
                    {currentValue.current || "\u00A0"}
                </ReactMarkdown>
            </div>
        );
    }
}
