import { useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { getComparisonData } from "./ApiCalls";
import { HistoryRecord } from "./Types";

const ComparisonModal = ({ history, model }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [data, setData] = useState({ labels: [], datasets: [] });

  function getHistory(history) {
    let myOut = Array<HistoryRecord>();
    let myIn = Array<HistoryRecord>();
    let out = true;
    history.map(group => {
      // console.log(group.id)
      group.messages.map(message => {
        // console.log(message.direction)
        if(out) {
          myOut.push({
            prompt: message.content.content,
            response: "",
            config: message.content.config
          })
        } else {
          myIn.push({
            prompt: "",
            response: message.content.content
          })
        }
        out = !out;
      });
    });
    myIn.forEach((message, index) => {
      myOut[index].response = message.response;
    })
    return myOut;
  }

  const downloadFile = () => {
    const myData = {
      ...data,
      history: getHistory(history),
      model: model
    }; // I am assuming that "this.state.myData"
    // is an object and I wrote it to file as
    // json
    // create file in browser
    const fileName = "my-comparison";
    const json = JSON.stringify(myData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }

  const compare = async () => {
    const response = await getComparisonData(getHistory(history)).then((v) => { return v; });
    // alert(JSON.stringify(response));
    setData(response)
  }

  

  return (
    <>
      <Button colorScheme="yellow" onClick={onOpen}>Compare</Button>
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Metrics</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Line data={data}></Line>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green" mr={3} onClick={downloadFile}>Save as JSON</Button>
            <Button colorScheme="blue" mr={3} onClick={compare}>Get Comparison</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export { ComparisonModal };