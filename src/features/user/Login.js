import { useState, useEffect } from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { Link, useNavigate } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import ErrorText from  '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'
import { loginUser } from '../../components/common/userSlice'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login(){

    const INITIAL_LOGIN_OBJ = {
        password : "",
        emailId : ""
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitForm = async (e) => {
        e.preventDefault();

        if (!loginObj.emailId || !loginObj.password) {
            setErrorMessage("Email and password are required!");
            return;
        }

        try {
            const resultAction = await dispatch(loginUser({
                username: loginObj.emailId,
                password: loginObj.password,
            }));
            const result = unwrapResult(resultAction);
            if (result) {
                Swal.fire({
                    title: "เข้าสู่ระบบสำเร็จ",
                    icon: "success",
                    showCancelButton: false,
                    showConfirmButton: false,
                });
                setTimeout(() => {
                    Swal.close();
                    navigate("/app/home");
                    // navigate("/app/welcome");
                }, 1000);
            }
        } catch (error) {
            console.log("Login failed:", error);
            let errorMessage = "Invalid username or password. Please try again.";
            if (error || error.message === "Invalid credentials") {
                errorMessage = "กรุณากรอกชื่อผู้ใช้ และ รหัสผ่าน ให้ถูกต้อง";
            } else if (error?.message) {
                errorMessage = error.message;
            }
            setErrorMessage(errorMessage);
            Swal.fire({
                title: "Login Failed",
                html: errorMessage,
                icon: "warning",
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonColor: '#3085d6',  // สีของปุ่มยืนยัน
                cancelButtonColor: '#d33'
            });
            setTimeout(() => {
                Swal.close();
            }, 3000);
        }
    };

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setLoginObj({...loginObj, [updateType] : value})
    }

    return(
        <div className="min-h-screen bg-base-200 flex items-center" style={{ background: "linear-gradient(to bottom right, #4400A5, #FF8329)" }}>
            <div className="card mx-auto w-full bg-white max-w-xl shadow-xl">
                <div className='py-24 px-10'>
                    <h2 className='text-2xl font-semibold mb-2 text-center'>Login</h2>
                    <form onSubmit={(e) => submitForm(e)}>

                        <div className="mb-4">

                            <InputText type="emailId" defaultValue={loginObj.emailId} updateType="emailId" containerStyle="mt-4" labelTitle="Username" updateFormValue={updateFormValue}/>

                            <InputText defaultValue={loginObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue}/>

                        </div>

                        <div className='text-right text-primary'><Link to="/forgot-password"><span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span></Link>
                        </div>

                        <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                        <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login