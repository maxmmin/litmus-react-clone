import {CSSProperties} from "react";

type ComponentPropsType = {
    className: string,
    color?: string
}

export const GoBubbleIcon = ({className, color}: ComponentPropsType) => {
    return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill={color} height="24" viewBox="0 -960 960 960" width="24">
        <path d="M480-840q74 0 139.5 28.5T734-734q49 49 77.5 114.5T840-480q0 74-28.5 139.5T734-226q-49 49-114.5 77.5T480-120q-41 0-79-9t-76-26l61-61q23 8 46.5 12t47.5 4q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 24 4 47.5t12 46.5l-60 60q-18-36-27-74.5t-9-79.5q0-74 28.5-139.5T226-734q49-49 114.5-77.5T480-840Zm40 520v-144L176-120l-56-56 344-344H320v-80h280v280h-80Z"/>
    </svg>

}
export const VisibilityDisabledIcon = ({className, color}: ComponentPropsType) =>
    <svg xmlns="http://www.w3.org/2000/svg" fill={color} className={className} height="24" viewBox="0 -960 960 960" width="24"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>

export const VisibilityEnabledIcon = ({className, color}: ComponentPropsType) =>
    <svg xmlns="http://www.w3.org/2000/svg" fill={color} className={className} height="24" viewBox="0 -960 960 960" width="24"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>

export const SearchIcon = ({className, color}: ComponentPropsType) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={color}
                                                                    className={className} viewBox="0 0 16 16">
    <path
        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
</svg>

export const PersonIcon = ({className, color}: ComponentPropsType) =>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={color}
         className={className} viewBox="0 0 16 16">
        <path
            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
    </svg>

export const AddUserIcon = ({className}: ComponentPropsType) =>
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path
            d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
        <path
            d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
    </svg>

export const SetUpUser = ({className}: ComponentPropsType) =>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={className}
         viewBox="0 0 16 16">
        <path
            d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/>
    </svg>

export const BackButtonIcon = ({className}: ComponentPropsType) =>
    <svg xmlns="http://www.w3.org/2000/svg" className={className+" bi bi-box-arrow-in-left"} width="16" height="16" fill="currentColor"
         viewBox="0 0 16 16">
        <path fillRule="evenodd"
              d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z"/>
        <path fillRule="evenodd"
              d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
    </svg>

export const GeoLocationPinDropIcon = ({className}: ComponentPropsType) => {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-301q99-80 149.5-154T680-594q0-56-20.5-95.5t-50.5-64Q579-778 544-789t-64-11q-29 0-64 11t-65 35.5q-30 24.5-50.5 64T280-594q0 65 50.5 139T480-301Zm0 101Q339-304 269.5-402T200-594q0-71 25.5-124.5T291-808q40-36 90-54t99-18q49 0 99 18t90 54q40 36 65.5 89.5T760-594q0 94-69.5 192T480-200Zm0-320q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520ZM200-80v-80h560v80H200Zm280-514Z"/></svg>
}

export const GeoLocationIcon = ({ color, className, style }: ComponentPropsType&{color: string, style?: CSSProperties}) => (
    <svg style={style?{...style}:{}} xmlns="http://www.w3.org/2000/svg" className={className} xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xmlSpace="preserve">
        <g style={{ stroke: 'none', strokeWidth: 0, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'none', fillRule: 'nonzero', opacity: 1 }} transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
            <path d="M 45 90 c -1.415 0 -2.725 -0.748 -3.444 -1.966 l -4.385 -7.417 C 28.167 65.396 19.664 51.02 16.759 45.189 c -2.112 -4.331 -3.175 -8.955 -3.175 -13.773 C 13.584 14.093 27.677 0 45 0 c 17.323 0 31.416 14.093 31.416 31.416 c 0 4.815 -1.063 9.438 -3.157 13.741 c -0.025 0.052 -0.053 0.104 -0.08 0.155 c -2.961 5.909 -11.41 20.193 -20.353 35.309 l -4.382 7.413 C 47.725 89.252 46.415 90 45 90 z" style={{ stroke: 'none', strokeWidth: 1, strokeDasharray: 'none', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: color, fillRule: 'nonzero', opacity: 1 }} transform="matrix(1 0 0 1 0 0)" />
            <path d="M 45 45.678 c -8.474 0 -15.369 -6.894 -15.369 -15.368 S 36.526 14.941 45 14.941 c 8.474 0 15.368 6.895 15.368 15.369 S 53.474 45.678 45 45.678 z" style={{ stroke: 'none', strokeWidth: 1, strokeDasharray: 'none', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: '#FFFFFF', fillRule: 'nonzero', opacity: 1 }} transform="matrix(1 0 0 1 0 0)" />
        </g>
    </svg>
);

export const CrossIcon = ({ color, className, style}: ComponentPropsType&{color: string, style?: CSSProperties}) => (
    <svg style={style?{...style}:{}} className={className+" bi bi-plus"} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={color}
         viewBox="0 0 16 16">
        <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
    </svg>
)

export const TrashIcon = ({color, className, style}: ComponentPropsType&{color: string, style?: CSSProperties}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={color} className={`${className} bi bi-trash`}
         style={style?{...style}:{}}
         viewBox="0 0 16 16">
        <path
            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
        <path
            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
    </svg>
)

export const DashedUserIcon = ({className}: ComponentPropsType) => {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enableBackground="new 0 0 100 100" xmlSpace="preserve"><g><circle cx="50.023" cy="7.023" r="1.5"/></g><g><circle cx="55.979" cy="7.719" r="1.5"/></g><g><circle cx="61.538" cy="9.853" r="1.5"/></g><g><circle cx="66.302" cy="13.426" r="1.5"/></g><g><circle cx="69.974" cy="18.14" r="1.5"/></g><g><circle cx="72.406" cy="23.6" r="1.5"/></g><g><circle cx="73.001" cy="29.503" r="1.5"/></g><g><circle cx="71.935" cy="35.859" r="1.5"/></g><g><circle cx="69.974" cy="40.968" r="1.5"/></g><g><circle cx="66.253" cy="45.583" r="1.5"/></g><g><circle cx="61.588" cy="49.255" r="1.5"/></g><g><circle cx="66.302" cy="56.898" r="1.5"/></g><g><circle cx="71.812" cy="59.182" r="1.5"/></g><g><circle cx="76.724" cy="62.556" r="1.5"/></g><g><circle cx="81.239" cy="66.525" r="1.5"/></g><g><circle cx="85.21" cy="70.991" r="1.5"/></g><g><circle cx="88.535" cy="76.004" r="1.5"/></g><g><circle cx="91.065" cy="81.412" r="1.5"/></g><g><circle cx="92.753" cy="87.121" r="1.5"/></g><g><circle cx="93.646" cy="92.977" r="1.5"/></g><g><circle cx="56.03" cy="51.39" r="1.5"/></g><g><circle cx="60.595" cy="55.161" r="1.5"/></g><g><circle cx="50.023" cy="51.638" r="1.5"/></g><g><circle cx="44.021" cy="7.719" r="1.5"/></g><g><circle cx="38.462" cy="9.853" r="1.5"/></g><g><circle cx="33.698" cy="13.426" r="1.5"/></g><g><circle cx="30.024" cy="18.14" r="1.5"/></g><g><circle cx="27.593" cy="23.6" r="1.5"/></g><g><circle cx="26.999" cy="29.503" r="1.5"/></g><g><circle cx="27.941" cy="35.359" r="1.5"/></g><g><circle cx="30.024" cy="40.968" r="1.5"/></g><g><circle cx="33.747" cy="45.583" r="1.5"/></g><g><circle cx="38.412" cy="49.255" r="1.5"/></g><g><circle cx="33.698" cy="56.898" r="1.5"/></g><g><circle cx="28.188" cy="59.182" r="1.5"/></g><g><circle cx="23.276" cy="62.556" r="1.5"/></g><g><circle cx="18.76" cy="66.525" r="1.5"/></g><g><circle cx="14.79" cy="70.991" r="1.5"/></g><g><circle cx="11.464" cy="76.004" r="1.5"/></g><g><circle cx="8.936" cy="81.412" r="1.5"/></g><g><circle cx="7.247" cy="87.121" r="1.5"/></g><g><circle cx="6.354" cy="92.977" r="1.5"/></g><g><circle cx="43.971" cy="51.39" r="1.5"/></g><g><circle cx="39.404" cy="55.161" r="1.5"/></g></svg>
}