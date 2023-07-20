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

@patch('firebase_admin.auth.verify_id_token')
def test_conversation_start(mock_verify_id_token, client, app, config):
    app.config['SERVER_NAME'] = 'localhost:5000'
    app.config['APPLICATION_ROOT'] = '/'
    app.config['PREFERRED_URL_SCHEME'] = 'http'
    with app.app_context():
        mock_verify_id_token.return_value = {'uid': '123'}
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
