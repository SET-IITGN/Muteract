// This is the Chat Window.
// Responsibilities:
// -- Maintain the history of the interaction.
// -- Get the mutated prompt from the Mutation Window to be sent as the message to the model.
// -- Have a component enclosed to enable changing the request parameters like temperature etc.
// -- Have a component to view and allow analysis of the history of responses from the model.
//    -- Allow the history to be downloaded at the highest level of detail possible.

import { useDisclosure, Card, CardBody, Button, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Box, Flex, Spacer, Input, Text, StackDivider, Stack, Textarea, NumberInput, NumberDecrementStepper, NumberIncrementStepper, NumberInputField, NumberInputStepper, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react";
import { Avatar, MessageModel, MainContainer, Sidebar, ConversationList, Conversation, ChatContainer, ConversationHeader, MessageList, TypingIndicator, MessageGroup, Message, MessageInput } from "@chatscope/chat-ui-kit-react";
import { MessageContent, MessageContentType, MessageDirection, useChat } from "@chatscope/use-chat";
import { useContext, useState, useMemo, createContext } from "react";
import * as api from "./ApiCalls";
import { ChatGPTConfig, ChatGPTConfigContextType } from "./Types";
import { MutatedPromptContext } from "./MutationPanel";
import { ComparisonModal } from "./ComparisonModal";
import { parse } from "path";

interface MyMessageContent extends MessageContent<MessageContentType.TextPlain> {
	content: string,
	config?: ChatGPTConfig
}

const ChatGPTConfigContext = createContext<ChatGPTConfigContextType>({
	temperature: 0.0,
	topP: 0.5,
	outputTokens: 1024,
	developerMessage: "",
	setDeveloperMessage: () => { },
	setOutputTokens: () => { },
	setTopP: () => { },
	setTemperature: () => { }
});
const ChatGPTConfigProvider = ({ children }) => {
	const [temperature, updateTemperature] = useState(0.0);
	const [topP, updateTopP] = useState(0.5);
	const [outputTokens, updateOutputTokens] = useState(1024);
	const [developerMessage, updateDeveloperMessage] = useState("");
	const setTemperature = (value1, value2) => updateTemperature(value2);
	const setTopP = (value1, value2) => updateTopP(value2);
	const setOutputTokens = (value) => updateOutputTokens(value);
	const setDeveloperMessage = (value) => updateDeveloperMessage(value);
	return (
		<ChatGPTConfigContext.Provider value={
			{
				temperature, topP, outputTokens, developerMessage,
				setTemperature, setTopP, setOutputTokens, setDeveloperMessage
			}}>
			{children}
		</ChatGPTConfigContext.Provider>
	)
}

const ConfigDrawer = ({ onOpen, onClose, isOpen }) => {
	const config = useContext(ChatGPTConfigContext);
	return (
		<>
			<Button colorScheme="teal" onClick={onOpen}>Configure</Button>
			<Drawer placement="left" onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth='1px'>ChatGPT Configuration</DrawerHeader>
					<DrawerBody>
						<div>
							<Text fontSize="lg" >Temperature</Text>
							<NumberInput maxW='100px' mr='2rem' allowMouseWheel min={0} max={2} step={0.01} value={config.temperature} onChange={config.setTemperature}>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
						</div>
						<div>
							<Text fontSize="lg">top-p</Text>
							<NumberInput maxW='100px' mr='2rem' allowMouseWheel min={0} max={1} step={0.01} value={config.topP} onChange={config.setTopP}>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
						</div>
						<div>
							<Text fontSize="lg">Maximum Output Tokens</Text>
							<Input
								onChange={(e) => config.setOutputTokens(Number(e.target.value))}
								value={config.outputTokens}
								size="sm" />
						</div>
						<div>
							<Text fontSize="lg">Developer Message</Text>
							<Textarea
								onChange={(e) => config.setDeveloperMessage(e.target.value)}
								value={config.developerMessage}
								size="lg" />
						</div>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	)
};

const ChatPanel = () => {
	const prompt = useContext(MutatedPromptContext);
	const config = useContext(ChatGPTConfigContext);
	// const [messages, setMessages] = useState<Array<MessageRecord>>([
	//   {
	//     message: "Hello, I'm ChatGPT! Ask me anything!",
	//     // sentTime: "just now",
	//     direction: "incoming" as MessageDirection,
	//     position: "last" as MessageModel["position"],
	//     // sender: "ChatGPT",
	//   }
	// ]);
	const [isTyping, setIsTyping] = useState(false);

	const handleSendRequest = async (messageText) => {
		// alert(messageText);
		const message = {
			id: "",
			content: {
				content: messageText,
				config: {
					outputTokens: config.outputTokens,
					temperature: config.temperature,
					topP: config.topP,
					developerMessage: config.developerMessage
				}
			} as MyMessageContent,
			direction: "outgoing" as MessageDirection,
			status: 4,
			contentType: 0,
			position: 0 as MessageModel["position"],
			senderId: "You",
			createdTime: new Date()
		};

		// setMessages((prevMessages) => [...prevMessages, newMessage]);
		sendMessage({
			message,
			conversationId: activeConversation ? activeConversation.id : "undefined",
			senderId: "You",
		});
		setIsTyping(true);

		try {
			// const response = await processmessageToChatGPT([...messages, newMessage]);
			const response = await api.getLLMResponse(message.content.content, currentUserName, {
				outputTokens: config.outputTokens,
				temperature: config.temperature,
				topP: config.topP,
				developerMessage: config.developerMessage
			});
			if (response) {
				// setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
				// alert(response);
				const message = {
					id: "",
					content: {
						content: response
					} as MyMessageContent,
					direction: "incoming" as MessageDirection,
					status: 4,
					contentType: 0,
					position: 0 as MessageModel["position"],
					senderId: currentUserName,
					createdTime: new Date()
				};
				sendMessage({
					message,
					conversationId: activeConversation ? activeConversation.id : "undefined",
					senderId: currentUserName,
				});
			}
		} catch (error) {
			console.error("Error processing message:", error);
		} finally {
			setIsTyping(false);
		}
	};

	// Get all chat related values and methods from useChat hook 
	const {
		currentMessages, conversations, activeConversation, setActiveConversation, sendMessage, getUser
	} = useChat();

	// Get current user data
	const [currentUserAvatar, currentUserName] = useMemo(() => {

		if (activeConversation) {
			const participant = activeConversation.participants.length > 0 ? activeConversation.participants[0] : undefined;

			if (participant) {
				const user = getUser(participant.id);
				if (user) {
					return [<Avatar src={user.avatar} name={user.username} />, user.username]
				}
			}
		}

		return ["undefined", "undefined"];

	}, [activeConversation]);

	const { isOpen, onOpen, onClose } = useDisclosure();

	// const drawerContainerRef = useRef(null);

	return (
		<Card h="87vh">
			<CardBody h="inherit" >
				<MainContainer>
					<Stack direction="column" h="inherit">
						<Sidebar position="left">
							<ConversationList>
								{conversations.map(c => {

									// Helper for getting the data of the first participant
									const [avatar, name] = (() => {

										const participant = c.participants.length > 0 ? c.participants[0] : undefined;
										if (participant) {
											const user = getUser(participant.id);
											if (user) {

												return [<Avatar src={user.avatar} name={user.username} />, user.username]

											}
										}

										return [undefined, undefined]
									})();

									return (<Conversation key={c.id}
										name={name}
										active={activeConversation?.id === c.id}
										// unreadCnt={c.unreadCounter}
										onClick={e => setActiveConversation(c.id)}>
										{avatar}
									</Conversation>);
								})}
							</ConversationList>
							<StackDivider borderColor='gray.200' />
							<Flex direction="row">
								<ConfigDrawer
									// ref={drawerContainerRef}
									isOpen={isOpen}
									onOpen={onOpen}
									onClose={onClose} />
								<Spacer />
								<ComparisonModal
									history={currentMessages}
									model={currentUserName} />
							</Flex>
						</Sidebar>
					</Stack>
					<ChatContainer>
						<ConversationHeader>
							{currentUserAvatar}
							<ConversationHeader.Content userName={currentUserName} />
						</ConversationHeader>
						<MessageList scrollBehavior="smooth"
							typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
						>
							{currentMessages.map(g => <MessageGroup key={g.id} direction={g.direction}>
								<MessageGroup.Messages>
									{g.messages.map(m => <Message key={m.id} model={{
										type: "custom",
										direction: g.direction,
										position: "normal",
										payload: m.content.content as string
									}} />)}
								</MessageGroup.Messages>
							</MessageGroup>)}
						</MessageList>
						<MessageInput
							attachButton={false}
							placeholder="Send a Message"
							value={prompt?.originalPrompt}
							onChange={(innerHtml, textContent, innerText, nodes) => prompt?.setOriginalPrompt(innerText)}
							onSend={(innerHtml, textContent, innerText, nodes) => handleSendRequest(innerText)} />
					</ChatContainer>
				</MainContainer>
			</CardBody>
		</Card>
	)
}

export { ChatPanel, ChatGPTConfigProvider };