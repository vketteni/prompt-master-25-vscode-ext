prompt-master-25 README

Overview

prompt-master-25 is a Visual Studio Code extension that provides a fast and reliable way to copy function signatures and bodies in customizable formats. This extension makes it easy to extract function details, including class methods, and efficiently retrieve them for quick reference.

Features

Function Extraction: Automatically detects all functions and methods in a file.

Quick Pick Menu: Easily search and copy function details.

Class-Aware Method Listing: Methods now display their ClassName.methodName format for better identification.

Customizable Copy Format: Configure function copy settings via VS Code settings.

Supports Multiple Languages: Works with Python, JavaScript, TypeScript, and more.

Screenshot

!

Requirements

Visual Studio Code v1.60.0+

A supported language server (e.g., Pylance for Python, TypeScript for JS/TS)

Extension Settings

This extension contributes the following settings:

prompt-master-25.format: Defines the format for copied functions. Options:

signature: Copy only the function signature.

body: Copy only the function body.

full: Copy the entire function.

prompt-master-25.customTemplate: Allows defining a custom format using {name}, {params}, and {body} placeholders.

Usage

Open a file containing functions or class methods.

Use the command prompt-master-25.copyFunction to open the quick function list (Ctrl+Shift+P → "Copy Function").

Select a function to copy it to the clipboard.

Paste the function anywhere you need it.

Known Issues

Class methods may not be detected if the language server does not provide nested symbols.

May not work with all VS Code-supported languages; tested primarily with Python and JavaScript.

Release Notes

0.0.1

Initial release with function extraction and copy support.

Contributing

Contributions welcome! Feel free to submit issues and pull requests on GitHub.

Extension Guidelines

Ensure you follow VS Code Extension Guidelines for best practices.

Additional Resources

VS Code API Documentation

Markdown Syntax Reference

Enjoy using prompt-master-25! 🚀

