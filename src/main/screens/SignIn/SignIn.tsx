import React, {useRef} from 'react';
import {signIn} from "../../redux/actions/AuthActions";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Navigate} from "react-router-dom";
import {updateLoginPageState} from "../../redux/actions/LoginPageStateActions";


function SignIn() {
    const dispatch = useAppDispatch();

    const passwordInput = useRef<HTMLInputElement>(null)

    const button = useRef<HTMLButtonElement>(null)

    const authentication = useAppSelector(state => state.authentication);

    const pageData = useAppSelector(state => state.loginPageState)

    const email = pageData?.email;

    const password = pageData?.password;

    const error = pageData?.error;

    if (authentication) {
        return <Navigate to="/"/>
    }

    const signInButtonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(signIn({email: email!, password: password!}))
    }

    return (
        <div className="sign-in-page">
            <Form style={{maxWidth: '400px'}} className='mx-auto my-auto'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <input className={`sign-in-page__input form-control sign-in-page__input_email ${error?'is-invalid':''}`}  type="email" placeholder="Enter email"
                           value={email}
                           onInput={(e)=>dispatch(updateLoginPageState({email: e.currentTarget.value}))}
                           onKeyDown={e=>{
                               if (e.key==="Enter") {
                                   e.preventDefault()
                                   passwordInput.current?.focus()
                               }
                           }}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <input ref={passwordInput} className={`sign-in-page__input form-control sign-in-page__input_password ${error?'is-invalid':''}`} type="password" placeholder="Password"
                           value={password}
                           onInput={(e)=>dispatch(updateLoginPageState({password: e.currentTarget.value}))}
                           onKeyDown={e=>{
                               if (e.key==="Enter") {
                                   e.preventDefault()
                                   button.current?.click();
                               }
                           }}
                    />
                </Form.Group>

                <Button ref={button} variant="primary" onClick={signInButtonHandler} className="w-100 py-2 mt-3 litmus-primary-btn">
                    Sign In
                </Button>

                {(error?.status===401)?<p className="error-text text-center sign-in-page__error-text">Недійсна email адреса чи пароль</p>:null}
            </Form>
        </div>

    );
}

export default SignIn;
