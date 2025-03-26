import { AxiosResponse } from "axios";

export default function HTTPResponseHandler(result: AxiosResponse) {
  if (result.status === 200) {
    return true;
  } else {
    return false;
  }
}
