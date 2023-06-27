import React, {useState} from "react";

interface IPickGridProps {
    values: string[]
    onChange?: (values: string[]) => void
    selectedValues?: string[]
}
const PickGrid = (props: IPickGridProps) => {
    const {values} = props
    const [picked, setPicked] = useState<string[]>(props.selectedValues || [])

    const handleTogglePick = (value: string) => {
        let newVal = picked;
        if (picked && picked.includes(value)) {
            if (picked.length === 1) {
                newVal = [values[0]]
            } else {
                newVal = picked.filter((v) => v !== value)
            }
        } else {
            if (!picked || !picked.length) {
                newVal = [value]
            }
            newVal = [...picked, value].sort((a, b) => parseInt(a) - parseInt(b))
        }

        if (props.onChange) {
            setPicked(newVal)
            props.onChange(newVal)
        }
    }

    return (
        <div style={{
            width: "300px",
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gridGap: "5px"
        }}>
            {values && values.map((v, i) => (
                <PickGridItem key={i} value={v}
                    onTogglePick={handleTogglePick}
                    picked={picked.includes(v)}/>
            ))}
        </div>
    )
}

const PickGridItem = (props: any) => {
    const {picked, value, onTogglePick, key} = props;

    return (
        <div
            key={key}
            style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "5px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: picked ? "#D1E7DD" : "#fff",
                transform: picked ? "scale(0.8)" : "scale(1)",
                transition: "all 0.2s ease-in-out",
            }}
            onClick={() => {
                onTogglePick(value);
            }}
        >{value}</div>
    )
}

export default PickGrid