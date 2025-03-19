import { Presence, User, UserStatus } from "@chatscope/use-chat";
import { listModels } from "./ApiCalls";

const Models = await listModels().then((models) => {
    const temp = models.flatMap((model) => {
      return {
        name: model,
        avatar: "https://upload.wikimedia.org/wikipedia/commons/e/ef/ChatGPT-Logo.svg"
      }
    })
    return temp;
  })
  .then((temp) => {
    return temp;
  });

const Conversations = Models.flatMap((model: { name: any; avatar: any; }) => {
  return new User({
    id: model.name,
    presence: new Presence({ status: UserStatus.Available, description: "" }),
    firstName: "",
    lastName: "",
    username: model.name,
    email: "",
    avatar: model.avatar,
    bio: ""
  })
})

export { Conversations };