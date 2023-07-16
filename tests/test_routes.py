from unittest.mock import patch
from flask import url_for

# We use the patch decorator from the unittest.mock module to replace a function during a test.
# In this case, we're replacing firebase_admin.auth.verify_id_token with a mock function.
@patch('firebase_admin.auth.verify_id_token')
def test_get_messages(mock_verify_id_token, client):
    # We set the return value of our mock function to {'uid': '123'}.
    # This means that, during this test, any call to verify_id_token will return {'uid': '123'}, 
    # no matter what arguments it's called with.
    mock_verify_id_token.return_value = {'uid': '123'}

    # The rest of the test proceeds as normal.
    token = 'test-token'
    client.environ_base['HTTP_AUTHORIZATION'] = token
    res = client.get(url_for('messages.get_messages', conversation_id='123'))
    assert res.status_code == 200

@patch('firebase_admin.auth.verify_id_token')
def test_conversation_start(mock_verify_id_token, client):
    mock_verify_id_token.return_value = {'uid': '123'}
    # Mock the request data
    data = {
    'bot_profile_id': 'test_bot_profile_id',
    'bot_name': 'test_bot_name'
    }

    # Make a POST request to the /start_conversation endpoint
    response = client.post(url_for('start_conversation.conversation_start'), json=data, headers={'Authorization': 'test_token'})

    # Check that the status code is 201
    assert response.status_code == 201

    # Check that the JSON response has the correct structure
    json_response = response.get_json()

    # check common message
    assert json_response['message'] == 'A conversation has been started with bot test_bot_profile_id.'

    # check the conversation fields
    assert 'conversation' in json_response
    assert 'agent_id' in json_response['conversation']
    assert 'id' in json_response['conversation']
    assert 'user_id' in json_response['conversation']
    assert 'agent_name' in json_response['conversation']

    # Check that agent_id and id are non-empty strings
    assert isinstance(json_response['conversation']['agent_id'], str)
    assert json_response['conversation']['agent_id'] != ''
    assert isinstance(json_response['conversation']['id'], str)
    assert json_response['conversation']['id'] != ''

    # check other fields
    assert json_response['conversation']['user_id'] == '123'
    assert json_response['conversation']['agent_name'] == 'test_bot_name'
