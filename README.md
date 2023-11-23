## Bug Fixes:
- Ensure state updates correctly when chat box settings are changed. Investigate the current state management system and identify why the state isn't updating immediately. After settings are updated and the chat gets clicked the old settings get loaded.
- Add visual indication to show selected chat box. This could be a change in color, a border, or any other visual cue that clearly indicates the active chat box.
- Resolve issue of chat data being fetched twice. Identify why both AgentMenu.js(fetchChats) and ChatDashboard.js(getChatData) are fetching the same data and consolidate this into a single fetch stored in a state variable in ChatContext.js.

## Feature Enhancements:
- Implement automatic news article search based on answered profile questions. This will involve connecting the user's profile data to the news API query system.
- Add features to carousel allowing deletion of news article or marking it as read. This will require updates to both the front-end display and the back-end database management.
- Make avatar specific to user and add feature to change avatar. This will involve adding a new field to the user's profile data and creating a new interface for avatar selection.
- Add form validation to agent menu. Name and model should be required

## User Profile Enhancements:
- Implement 'use profile data' for chats to allow the agent to make suggestions based on user's profile data. This will involve passing the user's profile data to the LLM and updating the chatbot's response generation to incorporate this data.
- Display the analysis of the profile on the profile dashboard. This will require creating a new display component on the dashboard and connecting it to the user's profile data.

## Questionnaire Updates:
- Review existing questions and decide which ones to keep or add. This will involve a review of the current questionnaire and potentially the creation of new questions.
- Consider allowing users to add custom questions or remove existing ones for customization. This will require updates to the questionnaire system to allow for user input.

## Debate Agent Overhaul:
- Rethink the overall architecture of the debate agent. This may involve changes to how debates are initiated, managed, and displayed.
- Change to socket.io for streaming the response back. This will involve a significant overhaul of the current response system.
- This will require some backend work, including potentially a new server setup for socket.io.

## Additional Features:
- Add a secondary check for when the chat clear or trash buttons are clicked. This could be a confirmation dialog that prevents accidental deletion of chats.
- Resolve bug related to code formatting in the response of streaming. This will involve investigating the current formatting system and identifying why it fails with multiple code blocks in a single response.


## General Refactoring:
- The styled components could be moved into their own files to reduce the size of the main files.

## Error handling/Spinners:
- Display loading spinners and error messages

- ## Notes
- Settings Bug

I think I can get rid of SettingsContext.js

Instead of using a separate state variable I can simply load the settings from the agentArray. Then all I would need to do is pass in the ID to the Chat component. 

Chat component can pull the settings from the agentArray via the ID. 

When settings are updated the agentArray would be updated

