# Muteract [![PyPI version](https://badge.fury.io/py/your-package-name.svg)](https://pypi.org/project/muteract/0.1.3/) [![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE) 

Interactive and Iterative Prompt Mutation Interface for LLM Developers and Evaluators
![Screenshot of the Muteract User Interface](images/UI.png "Muteract User Interface")

## Table of Contents

- [Muteract  ](#muteract--)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Usage](#usage)
  - [Configuration](#configuration)
  - [Acknowledgements](#acknowledgements)
  - [Contributing](#contributing)
  - [License](#license)

## Introduction

Muteract - an interactive and iterative prompt mutation interface that enables LLM developers and evaluators to input natural language (NL) text prompts, apply mutations, analyze variations in textual responses, and archive results.

![structure](images/Muteract-Arch.drawio.svg)

As of now, this tool provides only Radamsa as the mutator, since it works directly on the bytes in a prompt and can be applied to various modalities. We plan to add more mutators for specific to images, text etc. in the future.

The interaction flow of Muteract is

![flowchart](images/Muteract-Flow.drawio.svg)


## Getting Started

Muteract is a python based tool. Make sure python is installed before following the [Installation](#installation) guide.

### Installation

Muteract can be installed with a simple pip command.

```bash
# Installation command
pip install muteract
```

All the dependencies are taken care by the installation.

### Usage
Ensure that the OpenAI API Key is configured in the environment variable `OPEN_AI_API_KEY` before starting the application.

Just running the Muteract command will open the GUI:
```bash
muteract
```


## Configuration

```
Python version above 3.10 is needed for running the application, along with a browser that supports ES2017.
```

## Acknowledgements
This tool is being developed by [SET-IITGN Group](https://sites.google.com/view/shouvick/shouvick-mondal) in collaboration with [HAIx Lab, IITGN](https://labs.iitgn.ac.in/haix/).

This work is supported by Grant No. IP/IITGN/CSE/SM/2324/02
and Grant No. IP/IITGN/CSE/YM/2324/05 from IIT Gandhinagar,
Gujarat, India.

## Contributing

Conrtibutions are accepted via pull requests. The PRs will be accepted only if they are suitable for the tool.

## License
[Apache License](LICENSE)

