import "./styles/Header.css"

export default function Header(props) {
    return (
        <div className="header-container">
            <img src={props.headerImg} alt="header" />
            <span>{props.headerText}</span>
        </div>
    )
}