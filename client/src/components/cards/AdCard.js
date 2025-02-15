export default function AdCard({ad}){
    return (
        <div className="col-lag-4 p-4 gx-4 gy-4">
            <div className="card hoverable shadow">
                <img src={ad?.photos?.[0]?.Location}
                     alt={`${ad?.type}-${ad?.address}-${ad?.action}-${ad?.price}`} style= {{height: "250px", objectFit: "cover"}} /> 
            </div>
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <h3>{ad?.price}</h3>
                </div>
                <p>Ad Features</p>
            </div>
        </div>
    )
} 