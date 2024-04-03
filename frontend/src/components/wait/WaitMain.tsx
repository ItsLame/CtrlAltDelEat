import { Box } from "@mantine/core";
import { ReadyToServe } from "./ReadyToServe";
import { RequestAssistance } from "./RequestAssistance";
import { InProgress } from "./InProgress";
import { assistRequests, updateAssistance, waitMainProps } from "@/models";
import { useEffect, useState } from "react";
import { updateWaitAssistance } from "@/services";
import toast from "react-hot-toast";

export function WaitMain({ custAssistReqs, refreshFunc }: waitMainProps) {
  const [toAssist, setToAssist] = useState([] as assistRequests[]);
  const [assistInProg, setAssistInProg] = useState([] as assistRequests[]);
  const [totalAssists, setTotalAssists] = useState(0);
  const [lock, setLock] = useState(false);
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

  const addAssistInP = (num: number) => {
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
        <ReadyToServe />
        <RequestAssistance
          allRequests={toAssist}
          assistBtn={addAssistInP}
          totalAssistLen={totalAssists}
          refreshFunc={refreshFunc}
        />
        <InProgress
          allRequests={assistInProg}
          assistUndo={delAssistNoUpdate}
          assistUpdate={deleteAssistInProgress}
          refreshFunc={refreshFunc}
        />
      </Box>
    </Box>
  );
}
