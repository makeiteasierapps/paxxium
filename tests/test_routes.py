from unittest.mock import patch
from flask import url_for


@patch('firebase_admin.auth.verify_id_token')
def test_get_messages(mock_verify_id_token, client, app, config):
    with app.app_context():
        mock_verify_id_token.return_value = {'uid': '123'}
        token = 'test-token'
        client.environ_base['HTTP_AUTHORIZATION'] = token
        res = client.get(url_for('messages.get_messages', conversation_id='123'))
        assert res.status_code == 200

@patch('myapp.services.user_services.UserService.get_keys')
@patch('myapp.services.user_services.UserService.decrypt')
@patch('myapp.services.user_services.UserService.check_authorization')
@patch('firebase_admin.auth.verify_id_token')
def test_conversation_start(mock_verify_id_token, mock_check_authorization, mock_decrypt, mock_get_keys, client, app, config):
    app.config['SERVER_NAME'] = 'localhost:5000'
    app.config['APPLICATION_ROOT'] = '/'
    app.config['PREFERRED_URL_SCHEME'] = 'http'
    with app.app_context():
        mock_verify_id_token.return_value = {'uid': '123'}
        mock_check_authorization.return_value = True
        mock_get_keys.return_value = ('test_openai_key', 'test_serp_key')
        mock_decrypt.return_value = 'decrypted_message'
        data = {
            'bot_profile_id': 'test_bot_profile_id',
            'bot_name': 'test_bot_name'
        }
        response = client.post(url_for('start_conversation.conversation_start'), json=data, headers={'Authorization': 'test_token'})
        assert response.status_code == 201
        json_response = response.get_json()
        assert json_response['message'] == 'A conversation has been started with bot test_bot_profile_id.'
        assert 'conversation' in json_response
        assert 'agent_id' in json_response['conversation']
        assert 'id' in json_response['conversation']
        assert 'user_id' in json_response['conversation']
        assert 'agent_name' in json_response['conversation']
        assert isinstance(json_response['conversation']['agent_id'], str)
        assert json_response['conversation']['agent_id'] != ''
        assert isinstance(json_response['conversation']['id'], str)
        assert json_response['conversation']['id'] != ''
        assert json_response['conversation']['user_id'] == '123'
        assert json_response['conversation']['agent_name'] == 'test_bot_name'
         # Additional assertions to check the return values of get_keys and decrypt
        assert mock_get_keys.return_value == ('test_openai_key', 'test_serp_key')
        assert isinstance(mock_get_keys.return_value, tuple)
        assert all(isinstance(item, str) for item in mock_get_keys.return_value)
        assert mock_decrypt.return_value == 'decrypted_message'
        assert isinstance(mock_decrypt.return_value, str)
