import { apiUrlBase } from "@/constants";
import { failedGetError, failedPutError } from "@/helpers";
import { getHeaders } from "@/services";
import { updateAssistance } from "@/models";

const apiUrl = `${apiUrlBase}/api/tables/assistance_requested/`;
const apiUrlUpdate = `${apiUrlBase}/api/tables/assisted/`;

export async function getWaitAssistance() {
  const headersConfig = await getHeaders.json();
  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint, {
    headers: headersConfig,
  });

  if (!res.ok) failedGetError();
  return res.json();
}

export async function updateWaitAssistance(
  tableNum: number,
  request: updateAssistance
) {
  const headersConfig = await getHeaders.json();
  const req = request;
  const endpoint = `${apiUrlUpdate}${tableNum}`;
  const res = await fetch(endpoint, {
    method: "PUT",
    headers: headersConfig,
    body: JSON.stringify(req),
  });

  if (!res.ok) failedPutError();
  return res.json();
}
