import React, { useState, useEffect } from 'react';
import './OTP.css';
import OTPLogo from '../Assets/translogo.png';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function OTP() {
  const [otp, setOtp] = useState(new Array(5).fill(""));
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/users');
        setUsers(Array.isArray(response.data.data) ? response.data.data : []);
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
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 4) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.some((value) => value === "")) {
      setError("All fields are required.");
      Swal.fire({
        title: 'Error!',
        text: 'All fields must be filled in.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#1E306D',
      });
    } else {
      setError("");
      const enteredOtp = otp.join("");
      const user = users.find(user => user.email === email);

      if (user && user.otp === enteredOtp) {
        navigate(`/change-password?email=${email}`);
        Swal.fire({
          title: 'Success!',
          text: 'OTP verified successfully. Redirecting to change password.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Invalid OTP. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#1E306D',
        });
      }
    }
  }

  return (
    <div className="otp-container">
      <div className="otp-form-container">
        <div className="otp-left-side">
          <h2 className="otp-title">Enter OTP</h2>
          <form onSubmit={handleSubmit}>
            <div className="otp-input-group">
              {otp.map((_, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  className="otp-input"
                  value={otp[index]}
                  onChange={(e) => handleChange(e, index)}
                  maxLength="1"
                  placeholder="#"
                />
              ))}
            </div>
            {error && <p className="otp-error">{error}</p>}
            <button type="submit" className="otp-submit-button">Submit</button>
          </form>
        </div>

        <Link to={"/"} className='change-right-side'>
          <div className="change-logo">
            <img src={OTPLogo} alt="Logo" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default OTP;