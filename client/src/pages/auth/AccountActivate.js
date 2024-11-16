import { useParams } from "react-router-dom";

export default function AccountActivate() {
  const { token } = useParams();
  console.log(token);

  return (
    <div
      className="display-1 d-flex justify-content-center align-items-center vh-100"
      style={{ marginTop: "-5%" }}
    >
      Please Wait...
    </div>
  );
}
