import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    BsPersonCircle, BsFillGearFill, BsCheckCircle,
} from 'react-icons/bs';
import logo from './../Assets/translogo.png';
import './../Pages/Css/admin.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function CheckinSidebar({ openSidebarToggle, OpenSidebar }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation(); // Get current location
    const [user, setUser] = useState();
    const id = Cookies.get('token');

    const isActive = (path) => {
        return location.pathname === path;
    };
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:4001/api/users/${id}`);
                setUser(response.data.data);
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "Error fetching data",
                    icon: "error",
                    confirmButtonColor: "#1E306D",
                    confirmButtonText: "OK",
                });
            }
        };

        fetchData();
    }, [id]);

    const logout = () => {
        Swal.fire({
            title: "",
            text: "Are you sure you want to logout?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#1E306D",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.get(`http://localhost:4001/api/users/logout`, { withCredentials: true });
                    if (response.data.status === "success") {
                        Cookies.remove('token', { path: '/' });
                        Swal.fire({
                            title: 'Success!',
                            text: 'Logout Successful',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        navigate('/login')
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Error logging out',
                        icon: 'error',
                        confirmButtonColor: '#1E306D',
                        confirmButtonText: 'OK',
                    });
                }
            }
        })
    }

    return (
        <aside id="superadmin_sidebar" className={isSidebarOpen ? "superadmin-sidebar-responsive" : ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    <img src={logo} alt="Logo" className='logo_header' />
                </div>
            </div>

            <ul className='pilot-sidebar-list'>


                <li className={`superadmin-sidebar-list-item ${isActive('/checkin-schedules') ? 'active' : ''}`}>
                    <Link to="/checkin-schedules">
                        <BsCheckCircle className='icon' /> Passenger Verification
                    </Link>
                </li>
                <hr className='pilot-line' />
                <li className={`superadmin-sidebar-list-item ${isActive('/checkin-profile') ? 'active' : ''}`}>
                    <Link to="/checkin-profile">
                        <BsPersonCircle className='icon' /> {user ? user.name : "Loading..."}
                    </Link>
                </li>
                <li className={`superadmin-sidebar-list-item ${isActive('/pilot-schedule') ? 'active' : ''}`}>
                    <Link onClick={logout}>
                        <BsFillGearFill className='icon' /> Log Out
                    </Link>
                </li>
            </ul>
        </aside>
    );
}

export default CheckinSidebar;
