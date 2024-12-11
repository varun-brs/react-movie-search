import axios from "axios";

const BaseURL = process.env.REACT_APP_API_ENDPOINT;

export const HttpGet = async (aParams) => {
  aParams["apikey"] = process.env.REACT_APP_API_KEY;

  const oURL = BaseURL + "?" + new URLSearchParams(aParams);
  let oResponse = await axios.get(oURL);
  return oResponse?.data;
};
