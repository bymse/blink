import cn from "classnames";
import styles from "./input.module.scss";
interface IInputProps {
    value: string,
    onChange?: (value: string) => void,
    className?: string,
    placeholder?: string,
    disabled?: boolean,
    type: string, 
    required?: boolean,
    maxLength?: number,
    readonly?: boolean,
}

export default function Input(props: IInputProps) {
    return (
        <input
            type={props.type}
            value={props.value}
            onChange={e => props.onChange && props.onChange(e.target.value)}
            placeholder={props.placeholder}
            className={cn(styles.Input, props.className)}
            required={props.required}
            disabled={props.disabled}
            maxLength={props.maxLength}
            readOnly={props.readonly}
        />
    )
}