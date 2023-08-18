import React, {useContext, useMemo, useRef} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Navigate} from "react-router-dom";
import {LoginPageState, updateLoginPageState} from "../../redux/actions/LoginPageDataActions";
import AuthenticationManager from "../../service/auth/AuthenticationManager";
import {LitmusServiceContext} from "../App";



function LoginPage() {
    const dispatch = useAppDispatch();

    const passwordInput = useRef<HTMLInputElement>(null)

    const button = useRef<HTMLButtonElement>(null)

    const authentication = useAppSelector(state => state.authentication);

    const {email, password, error} = useAppSelector(state => state.loginPageState)||{};

    const authManager: AuthenticationManager = useContext(LitmusServiceContext).auth.manager

    const signInButtonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const em = email as string;
        const mail = password as string;
        authManager.login({email: em, password: mail});
    }

    if (authentication) {
        return <Navigate to="/"/>
    }

    return (
        <div className="sign-in-page">
            <Form style={{maxWidth: '400px'}} className='mx-auto my-auto'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <input className={`sign-in-page__input form-control sign-in-page__input_email ${error?'is-invalid':''}`}  type="email" placeholder="Enter email"
                           value={email}
                           onInput={(e)=> {
                               const updateObject: Partial<LoginPageState> = {email: e.currentTarget.value}
                               if (error) {
                                   updateObject.error = null;
                               }
                               dispatch(updateLoginPageState(updateObject))
                           }}
                           onKeyDown={e=>{
                               if (e.key==="Enter") {
                                   e.preventDefault()
                                   passwordInput.current?.focus()
                               }
                           }}
                           autoComplete={"email"}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <input ref={passwordInput} className={`sign-in-page__input form-control sign-in-page__input_password ${error?'is-invalid':''}`} type="password" placeholder="Password"
                           value={password}
                           autoComplete={"current-password"}
                           onInput={(e)=> {
                               const updateObject: Partial<LoginPageState> = {password: e.currentTarget.value}
                               if (error) {
                                   updateObject.error = null;
                               }
                               dispatch(updateLoginPageState(updateObject))
                           }}
                           onKeyDown={e=>{
                               if (e.key==="Enter") {
                                   e.preventDefault()
                                   button.current?.click();
                               }
                           }}
                    />
                </Form.Group>

                <Button ref={button} variant="primary" disabled={Boolean(error)} onClick={signInButtonHandler} className="w-100 py-2 mt-3 litmus-primary-btn">
                    Sign In
                </Button>

                {(error?.status===401)?<p className="error-text text-center sign-in-page__error-text">Недійсна email адреса чи пароль</p>:null}
            </Form>
        </div>

    );
}

export default LoginPage;
