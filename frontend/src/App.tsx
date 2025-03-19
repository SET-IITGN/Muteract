import { Tabs, TabList, TabPanels, Tab, TabPanel, Heading, StackDivider } from "@chakra-ui/react";
import { Box, VStack } from "@chakra-ui/react";
import "chart.js/auto";
import HelpComponent from "./HelpComponent";
import ParentFormComponent from "./FormComponents";

const App = () => {
  return (
    <Box w="inherit">
      <VStack divider={<StackDivider />}>
        <Heading>Tool UI</Heading>
        <TabComponent />
      </VStack>
    </Box>
  );
};

function TabComponent() {
  const seed = Math.floor(Math.random() * 2147483647)
  return (
    <Tabs isFitted variant="soft-rounded" w="100%">
      <TabList>
        <Tab>ChatGPT</Tab>
        <Tab>Help</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          {/* <ParentFormComponent inputToApi="chat-gpt" seed={seed} /> */}
          <ParentFormComponent seed={seed} />
        </TabPanel>
        <TabPanel>
          <HelpComponent />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default App;