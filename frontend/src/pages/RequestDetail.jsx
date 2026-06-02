import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";


const RequestDetail=()=>{
const { id } = useParams();
const [request, setRequest] = useState(null);

const [loading, setLoading] =
  useState(true);

const [error, setError] =
  useState("");

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

    <p>
      Coins:
      {request.coinAmount}
    </p>
  </div>
);
};
export default RequestDetail;