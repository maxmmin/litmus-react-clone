import {Dropdown} from "react-bootstrap";
import React from "react";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {logOut} from "../../../util/pureFunctions";


function HeaderMenu () {
    const isOpened: boolean = useAppSelector<boolean>(state => state.appState!.isHeaderMenuOpened)
    const dispatch = useAppDispatch();
    return (
        <Dropdown bsPrefix='header__home-menu' show={isOpened} onClick={e=>{
            e.stopPropagation();
        }}>
            <Dropdown.Menu variant="light" align='start' >
                <Link className='dropdown-item' to="/profile">Профіль</Link>
                <Link className='dropdown-item' to="/settings">Налаштування</Link>

                <Dropdown.Divider />
                <Dropdown.Item onClick={()=>logOut(dispatch)}>Вийти</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default HeaderMenu;