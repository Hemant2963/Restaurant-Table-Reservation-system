// import React from 'react';


// const Success = () => {
// return (
//     <div>
//     <h1>Success Page</h1>
//     </div>
// );
// };

// export default Success;



import React from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/"); // redirects to the home/reservation page
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1 style={{ color: "#28a745", fontSize: "2.5rem" }}>
        🎉 Reservation Successful!
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
        Thank you for booking your table with Tasty Food Restaurant.
        <br />
        A confirmation email has been sent to your registered address.
      </p>

      <button
        onClick={handleGoBack}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "12px 25px",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        ⬅ Back to Reservation
      </button>
    </div>
  );
};

export default Success;
