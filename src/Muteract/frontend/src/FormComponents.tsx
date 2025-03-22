import { Grid, GridItem } from "@chakra-ui/react";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { ChatProvider, AutoDraft, BasicStorage, ConversationId, Participant, ConversationRole, TypingUsersList } from "@chatscope/use-chat";
import { Conversation } from "@chatscope/use-chat";
import { ExampleChatService } from "@chatscope/use-chat/dist/examples"
import { nanoid } from "nanoid";
import { Conversations } from "./Models";
import { MutatedPromptProvider, MutationPanel } from "./MutationPanel";
import { ChatGPTConfigProvider, ChatPanel } from "./ChatPanel";

// The Parent Component, which is supposed to contain:
// -- The Chat Window where the interaction takes place.
// -- The Mutation Window where the message sent to the model is mutated.
const ParentFormComponent = ({ seed }) => {
  // Storage needs to generate id for messages and groups
  const messageIdGenerator = () => nanoid();
  const groupIdGenerator = () => nanoid();

  // Create serviceFactory
  const serviceFactory = (storage, updateState) => {
    return new ExampleChatService(storage, updateState);
  };
  // const Store = Models.flatMap((model) => {
  //   return {
  //     name: model.name,
  //     storage: new BasicStorage({ groupIdGenerator, messageIdGenerator })
  //   }
  // })
  const createConversation = (id: ConversationId, name: string) => {
    return new Conversation({
      id,
      participants: [
        new Participant({
          id: name,
          role: new ConversationRole([])
        })
      ],
      unreadCounter: 0,
      typingUsers: new TypingUsersList({ items: [] }),
      draft: ""
    });
  }

  const chatStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });
  Conversations.forEach(c => {
    if (c.id.includes("gpt") && !(c.id.includes("preview") || c.id.includes("latest"))) {
      chatStorage.addUser(c);
      const conversationId = nanoid();
      const myConversation = chatStorage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === c.id) !== "undefined");
      if (!myConversation) {
        chatStorage.addConversation(createConversation(conversationId, c.id));
        const chat = Conversations.find(chat => chat.name === c.id);
        if (chat) {
          const hisConversation = chat.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === c.name) !== "undefined");
          if (!hisConversation) {
            chat.storage.addConversation(createConversation(conversationId, c.name));
          }
        }
      }
    }
  });

  return (
    <ChatProvider serviceFactory={serviceFactory} storage={chatStorage} config={{
      typingThrottleTime: 250,
      typingDebounceTime: 900,
      debounceTyping: true,
      autoDraft: AutoDraft.Save | AutoDraft.Restore
    }}>
      <ChatGPTConfigProvider>
        <MutatedPromptProvider>
          <Grid 
            templateAreas={`"main sidebar"`}
            columnGap={1}
            maxH="100vh">
            <GridItem w="100%">
              <ChatPanel />
            </GridItem>
            <GridItem  w="100%">
              <MutationPanel seed={seed} />
            </GridItem>
          </Grid>
        </MutatedPromptProvider>
      </ChatGPTConfigProvider>
    </ChatProvider>
  )
}

export default ParentFormComponent;