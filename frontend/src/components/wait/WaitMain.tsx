import { Box } from "@mantine/core";
import { ReadyToServe } from "./ReadyToServe";
import { RequestAssistance } from "./RequestAssistance";
import { InProgress } from "./InProgress";
import {
  assistRequests,
  Items,
  updateAssistance,
  waitMainProps,
} from "@/models";
import { useEffect, useState } from "react";
import { updateItemStatus, updateWaitAssistance } from "@/services";
import toast from "react-hot-toast";

export function WaitMain({
  serveItemsReqs,
  custAssistReqs,
  refreshAssist,
  refreshServe,
}: waitMainProps) {
  const [toAssist, setToAssist] = useState([] as assistRequests[]);
  const [assistInProg, setAssistInProg] = useState([] as assistRequests[]);
  const [totalAssists, setTotalAssists] = useState(0);
  const [lock, setLock] = useState(false);

  const [toServe, setToServe] = useState([] as Items[]);
  const [serveInProg, setServeInProg] = useState([] as Items[]);
  const [totalServe, setTotalServe] = useState(0);
  const [serveLock, setServeLock] = useState(false);

  useEffect(() => {
    if (lock) {
      let filteredArray = custAssistReqs.filter(
        (item1) =>
          !assistInProg.some(
            (item2) =>
              item2.tableNumber === item1.tableNumber ||
              item2.request_assistance === false
          )
      );
      let filteredArray2 = filteredArray.filter(
        (item1) => item1.request_assistance === true
      );
      setToAssist(filteredArray2);
      setTotalAssists(filteredArray2.length);
      setLock(false);
    }
  }, [assistInProg, custAssistReqs, lock]);

  useEffect(() => {
    setLock(true);
  }, [custAssistReqs]);

  useEffect(() => {
    if (serveLock) {
      let filteredArray = serveItemsReqs.filter(
        (item1) => !serveInProg.some((item2) => item1.id === item2.id)
      );
      setToServe(filteredArray);
      setTotalServe(filteredArray.length);
      setServeLock(false);
    }
  }, [serveInProg, serveItemsReqs, serveLock]);

  useEffect(() => {
    setServeLock(true);
  }, [serveItemsReqs]);

  const addServeItemToInProgress = (serveItem: Items) => {
    setServeLock(true);
    setServeInProg((prev) => [...prev, serveItem]);
  };

  const delServeNoUpdate = (serveItem: Items) => {
    setServeLock(true);
    setServeInProg((prev) => prev.filter((item) => item.id !== serveItem.id));
  };

  const updateItemStatusToServed = (serveItem: Items) => {
    const itemID = serveItem.id;
    const updateItem = {
      tableNumber: serveItem.tableNumber,
      itemName: serveItem.itemName,
      cost: serveItem.cost,
      status: "served",
    };
    updateItemStatus(itemID, updateItem).then(refreshServe);
  };

  const deleteServeInProgress = (serveItem: Items) => {
    toast.success(`Served Table#${serveItem.tableNumber} Item #${serveItem.id}!`, { duration: 5000 });
    updateItemStatusToServed(serveItem);
    setLock(false);
    setServeInProg((prev) => prev.filter((item) => item.id !== serveItem.id));
  };

  const addAssistInProgress = (num: number) => {
    const newCard = { tableNumber: num, request_assistance: true };
    setLock(true);
    setAssistInProg((prev) => [...prev, newCard]);
  };

  const delAssistNoUpdate = (num: number) => {
    setLock(true);
    setAssistInProg((prev) => prev.filter((item) => item.tableNumber !== num));
  };

  const updateAssistance = (num: number, req: updateAssistance) => {
    updateWaitAssistance(num, req);
  };

  const deleteAssistInProgress = (num: number) => {
    toast.success(`Assisted Table#${num}!`);
    updateAssistance(num, { request_assistance: false });
    setLock(false);
    setAssistInProg((prev) => prev.filter((item) => item.tableNumber !== num));
  };

  return (
    <Box className="appshell-h-100 wait-main">
      <Box className="container">
        <ReadyToServe
          allRequests={toServe}
          addToServeInProgress={addServeItemToInProgress}
          totalServeLen={totalServe}
          refreshFunc={refreshServe}
        />
        <RequestAssistance
          allRequests={toAssist}
          addAssistToProgress={addAssistInProgress}
          totalAssistLen={totalAssists}
          refreshFunc={refreshAssist}
        />
        <InProgress
          toAssistRequests={assistInProg}
          toServeRequests={serveInProg}
          assistUndo={delAssistNoUpdate}
          assistUpdate={deleteAssistInProgress}
          serveUndo={delServeNoUpdate}
          serveUpdate={deleteServeInProgress}
          refreshAssist={refreshAssist}
          refreshServe={refreshServe}
        />
      </Box>
    </Box>
  );
}
