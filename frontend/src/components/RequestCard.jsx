import { Link } from "react-router-dom";

const RequestCard = ({ request }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 border">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">
          {request.subject}
        </h2>

        <span
          className={`px-3 py-1 rounded text-sm font-medium ${
            request.mode === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {request.mode}
        </span>
        
      </div>

      <p className="text-gray-600 mb-3">
        {request.description}
      </p>

      {request.mode === "paid" && (
        <p className="font-medium mb-2">
          💰 {request.coinAmount} Coins
        </p>
      )}

      {request.mode === "barter" && (
        <div className="font-medium mb-2">
         <p>
        Can Teach:
      </p>
      <p>
        {
          request.exchangeTopics?.slice(0, 3).join(", ")
        }
      </p>
        </div>
      )}

      <p className="text-sm text-gray-500 mb-4">
        Posted by: {request.requester?.name}
      </p>

      <Link
        to={`/requests/${request._id}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View Details
      </Link>
    </div>
  );
};

export default RequestCard;