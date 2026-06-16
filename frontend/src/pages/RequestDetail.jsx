import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";

const RequestDetail=()=>{
  const navigate = useNavigate();
const { id } = useParams();
const [request, setRequest] = useState(null);

const [loading, setLoading] =
  useState(true);

const [error, setError] =
  useState("");

const handleAccept =
async () => {

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await api.post(
        `/sessions/accept/${id}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    navigate(
      `/sessions/${response.data.session._id}`
    );

  } catch (error) {

    console.log(error);

  }
};

useEffect(() => {
  const fetchRequest = async () => {
    try {
      const response =
        await api.get(`/requests/${id}`);

      setRequest(response.data.request);
    } catch (error) {
      setError("Request not found");
    } finally {
      setLoading(false);
    }
  };

  fetchRequest();
}, [id]);

if (loading) {
  return <h1>Loading...</h1>;
}

if (error) {
  return <h1>{error}</h1>;
}

return (
  <div>
    <h1>{request.subject}</h1>

    <p>{request.description}</p>

    <p>
      Posted by:
      {request.requester?.name}
    </p>

    <p>
      Email:
      {request.requester?.email}
    </p>

    <p>
      Mode:
      {request.mode}
    </p>


    {
  request.mode === "paid" && (

    <div>

      <h3>
        Payment
      </h3>

      <p>
        {request.coinAmount} Coins
      </p>

    </div>

  )
}

    {
  request.mode === "barter" && (

    <div>

      <h3>
        Barter Offer
      </h3>

      <p>
        {request.barterOffer}
      </p>

    </div>

  )
}
    
  {request.status === "accepted" ? (
  <button disabled>
    Already Accepted
  </button>
) : (
  <button onClick={handleAccept}>
    Accept Request
  </button>
)}

  </div>
);
};
export default RequestDetail;