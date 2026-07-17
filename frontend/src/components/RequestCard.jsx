import { Link } from "react-router-dom";
import { ArrowRight, Coins } from "lucide-react";
import { COLORS, TEXT_MUTED, CARD_SHADOW } from "../theme/theme.js";
import { Card } from "../theme/ui.jsx";

const RequestCard = ({ request }) => {
  const isPaid = request.mode === "paid";
  const modeColor = isPaid ? COLORS.gold : COLORS.blue;

  return (
    <Card className="p-6 flex flex-col h-full" style={{ boxShadow: CARD_SHADOW }}>
      <div className="flex justify-between items-start gap-3 mb-3">
        <h2 className="font-display font-medium text-xl">{request.subject}</h2>
        <span
          className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0"
          style={{ color: modeColor, background: `${modeColor}22` }}
        >
          {request.mode}
        </span>
      </div>

      <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "rgba(255,255,255,0.6)" }}>
        {request.description}
      </p>

      {request.topics?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {request.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="text-xs border border-white/10 bg-white/[0.03] rounded-full px-2.5 py-1">
              {topic}
            </span>
          ))}
        </div>
      )}

      {isPaid ? (
        <div className="flex items-center gap-2 mb-4 text-sm font-medium" style={{ color: COLORS.gold }}>
          <Coins className="w-4 h-4" />
          {request.coinAmount} coins
        </div>
      ) : (
  request.barterOffer && (
    <div className="mb-4">
      <div className="text-xs mb-1.5" style={{ color: TEXT_MUTED }}>Can teach in exchange:</div>
      <p className="text-sm leading-relaxed" style={{ color: COLORS.blue }}>
        {request.barterOffer}
      </p>
    </div>
  )
)}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border flex items-center justify-center font-display italic text-xs shrink-0"
            style={{ borderColor: `${COLORS.red}66`, color: COLORS.red }}>
            {request.requester?.username?.[0]?.toUpperCase() || "?"}
          </div>
          <span className="text-xs" style={{ color: TEXT_MUTED }}>
            {request.requester?.username || "Unknown"}
          </span>
        </div>

        <Link
          to={`/requests/${request._id}`}
          className="flex items-center gap-1 text-sm font-medium"
          style={{ color: COLORS.red }}
        >
          View details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
};

export default RequestCard;
