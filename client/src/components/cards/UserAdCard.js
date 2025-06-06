import { Badge } from "antd";
import { Link } from "react-router-dom"
import AdFeatures from "./AdFeatures";
import { formatNumber } from "../../helpers/ad";

export default function UserAdCard({ ad }) {
    return (
        
            <div className="col-lg-4 p-4 gx-4 gy-4" key={ad._id}>
                <Link to={`/user/ad/${ad.slug}`}>
                <Badge.Ribbon text={`${ad?.type} for ${ad?.action}`} color={`${ad?.action === "Sell" ? "blue" : "red"}`}>
                    <div className="card hoverable shadow">
                        <img src={ad?.photos?.[0]?.Location}
                            alt={`${ad?.type}-${ad?.address}-${ad?.action}-${ad?.price}`} style={{ height: "250px", objectFit: "cover" }} />
                    </div>
                    <div className="card-body">
                        <h3>BD {formatNumber(ad?.price)}</h3>
                        <p className="card-text">{ad?.address}</p>

                        <AdFeatures ad={ad} />
                    </div>
                </Badge.Ribbon>
                </Link>
            </div>
    )
} 