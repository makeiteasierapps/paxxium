## Bug Fixes:
- When you close a chat and then try to reload via the "Load Chat" the socket connection does not re-establish. Error of 'Invalid frame header' is thrown. This might be because the socket connection is not being closed properly. This is not causing any issues but something to be aware of.

- Add visual indication to show selected chat box. This could be a change in color, a border, or any other visual cue that clearly indicates the active chat box.

## Feature Enhancements:
- Make avatar specific to user and add feature to change avatar. This will involve adding a new field to the user's profile data and creating a new interface for avatar selection.
- Add form validation to agent menu. Name and model should be required

## User Profile Enhancements:
- Implement 'use profile data' for chats to allow the agent to make suggestions based on user's profile data. This will involve passing the user's profile data to the LLM and updating the chatbot's response generation to incorporate this data.
- Display the analysis of the profile on the profile dashboard. This will require creating a new display component on the dashboard and connecting it to the user's profile data.

## Questionnaire Updates:
- Review existing questions and decide which ones to keep or add. This will involve a review of the current questionnaire and potentially the creation of new questions.
- Consider allowing users to add custom questions or remove existing ones for customization. This will require updates to the questionnaire system to allow for user input.


## Additional Features:
- Add a secondary check for when the chat clear or trash buttons are clicked. This could be a confirmation dialog that prevents accidental deletion of chats.

## General Refactoring:
- The styled components could be moved into their own files to reduce the size of the main files.

## Error handling/Spinners:
- Display loading spinners and error messages


