// This is the Mutation Window.
// Responsibilities:
// -- Have one ediatble textbox and another non-editable one to show the mutated prompt..
// -- Have a component enclosed to select the mutation parameters.
// -- Share the mutated prompt with the Chat Window to allow interaction with the model.
//    -- Share the mutations applied along with the mutated message itself to be recorded in the history panel.

import { Card, CardHeader, Heading, CardBody, FormControl, Textarea, Accordion, AccordionItem, AccordionButton, Box, AccordionPanel, CheckboxGroup, Checkbox, CardFooter, Button, Stack, Flex } from "@chakra-ui/react";
import { useFormik } from "formik";
import { createContext, useContext, useState } from "react";
import { MutatedPromptContextType } from "./Types";
import { v4 as uuidv4 } from 'uuid';
import * as api from "./ApiCalls";

// This is a Context and its Provider that is used to 
// share the mutated prompt across the 
// Chat and Mutation Windows.
const MutatedPromptContext = createContext<MutatedPromptContextType>({ 
  originalPrompt: "", 
  mutatedPrompt: "", 
  setOriginalPrompt: () => {}, 
  setMutatedPrompt: () => {} 
});
const MutatedPromptProvider = ({ children }) => {
  const [mutatedPrompt, setMutatedPrompt] = useState("");
  const [originalPrompt, setOriginalPrompt] = useState("");
  return (
    <MutatedPromptContext.Provider value={{ originalPrompt, mutatedPrompt, setOriginalPrompt, setMutatedPrompt }}>
      {children}
    </MutatedPromptContext.Provider>
  )
}

const MutationPanel = ({ seed }) => {
  const prompt = useContext(MutatedPromptContext);
  const optionCategories = {
    "asciiRelated": ["ab"],
    "singleByte": ["bd", "bf", "bi", "br", "bp", "bei", "bed", "ber"],
    "seqBytes": ["sr", "sd"],
    "lineBased": ["ld", "lds", "lr2", "li", "lr", "ls", "lp", "lis", "lrs"],
    "treeBased": ["td", "tr2", "ts1", "ts2", "tr"],
    "utf8Based": ["uw", "ui"],
    "xmlBased": ["xp"],
    "numberBased": ["num"],
    "fuseRelated": ["ft", "fn", "fo"]
  };
  const mutationForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      prompt: prompt.originalPrompt,
      options: new Array<string>(),
      random_seed: seed
    },
    onSubmit: async (values, actions) => {
      const mutatedPrompt = await api.getMutation(values).then((data) => {
        return data;
      })
      // alert(mutatedPrompt);
      prompt.setMutatedPrompt(mutatedPrompt);
      const record = {
        ...values,
        'prompt': mutatedPrompt
      }
      // This needs to be enabled after implementing the 
      // ChatWindow's state to store mutation-related info
      // onMutate(record);
      actions.resetForm();
    }
  });
  return (
    <Card h="87vh" direction="column">
      <form onSubmit={mutationForm.handleSubmit}>
        <CardBody>
          <FormControl onChange={mutationForm.handleChange}>
            <Textarea placeholder="Message can go here!" id="prompt" name="prompt" value={prompt.originalPrompt} onChange={(e) => { prompt.setOriginalPrompt(e.target.value); prompt.setMutatedPrompt(e.target.value) }} />
            <Textarea placeholder="Mutated message shows up here!" id="mutatedPrompt" name="mutatedPrompt" value={prompt.mutatedPrompt} isReadOnly={true} />
          </FormControl>
          <FormControl onChange={mutationForm.handleChange}>
            <Accordion>
              {
                Object.entries(optionCategories).map(([heading, options]) => (
                  <AccordionItem>
                    <AccordionButton>
                      <Box as='span' flex='1' textAlign='left' >
                        {heading}
                      </Box>
                    </AccordionButton>
                    <AccordionPanel>
                      <CheckboxGroup>
                        <Flex direction="row">
                        {
                          options.map((option) => (
                            <FormControl onChange={mutationForm.handleChange} key={uuidv4()}>
                              <Checkbox
                                onChange={mutationForm.handleChange}
                                checked={mutationForm.values.options.includes(option)}
                                name="options"
                                value={option}
                              >
                                {option}
                              </Checkbox>
                            </FormControl>
                          ))
                        }
                        </Flex>
                      </CheckboxGroup>
                    </AccordionPanel>
                  </AccordionItem>)
                )
              }
            </Accordion>
          </FormControl>
        </CardBody>
        <CardFooter>
          <Button type="submit">Mutate</Button>
          <Button type="button" onClick={(e) => prompt.setOriginalPrompt(prompt.mutatedPrompt)}>Select</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export { MutatedPromptContext, MutatedPromptProvider, MutationPanel };