import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { APP_MESSAGES } from "../constants/messages";


export default function BotonInicioSesionGoogle({ text = "signin_with", onCredential }) {
  return (
    <div className="w-100 d-flex justify-content-center">
      <GoogleLogin
        onSuccess={(res) => res.credential && onCredential(res.credential)}
        onError={() => toast.error(APP_MESSAGES.NOTIFICATIONS.GOOGLE_ERROR)}
        useOneTap={false}
        theme="outline"
        size="large"
        width={320}
        text={text}
        shape="rectangular"
      />
    </div>
  );
}