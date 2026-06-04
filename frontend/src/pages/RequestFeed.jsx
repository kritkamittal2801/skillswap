import { useEffect, useState,useContext } from "react";
import api from "../services/api.js";
import RequestCard from "../components/RequestCard";
import { AuthContext } from "../contexts/AuthContext.jsx";

const RequestFeed = () => {
  const { user } =useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] =useState("");
  const [modeFilter, setModeFilter] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get("/requests");
        console.log("Logged in user:", user);
console.log("Requests:", requests);


        setRequests(response.data.requests);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }

    };

    fetchRequests();
  }, []);
  
    
  // Filter requests
  const filteredRequests =
  requests.filter((request) => {
    
    const subjectMatch =
      !subjectFilter ||
      request.subject === subjectFilter;

    const modeMatch =
      !modeFilter ||
      request.mode === modeFilter;

      const notOwnRequest =
      request.requester?._id !==
      user?._id;


    return (
      subjectMatch && modeMatch &&
      notOwnRequest
    );
  });

  if (loading) {
    return (
      <h1 className="text-center mt-10 text-xl">
        Loading...
      </h1>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Learning Requests
      </h1>

      {/* Subject Filter */}
      <div className="mb-6">
        <select
          value={subjectFilter}
          onChange={(e) =>
            setSubjectFilter(
              e.target.value
            )
          }
          className="border p-2 rounded"
        >
          <option value="">
            All Subjects
          </option>

          <option value="React">
            React
          </option>

          <option value="Node.js">
            Node.js
          </option>

          <option value="MongoDB">
            MongoDB
          </option>

          <option value="JavaScript">
            JavaScript
          </option>

          <option value="Physics">
            Physics
          </option>

          <option value="Mathematics">
            Mathematics
          </option>
        </select>

         {/* Mode Filter */}
  <select
    value={modeFilter}
    onChange={(e) =>
      setModeFilter(e.target.value)
    }
    className="border p-2 rounded"
  >
    <option value="">
      All Modes
    </option>

    <option value="paid">
      Paid
    </option>

    <option value="barter">
      Barter
    </option>
  </select>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center text-gray-500">
          No requests found 
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestFeed;