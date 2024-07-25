import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import {
    TextField,
    Box,
    Checkbox,
    FormControlLabel,
    Button,
    InputAdornment,
    Modal,
} from '@mui/material';
import { KbContext } from '../../../contexts/KbContext';
import { StyledIconButton } from '../../chat/chatStyledComponents';
import TextEditor from './textEditor/TextEditor';

const KbUtility = ({ kbName, kbId }) => {
    const [url, setUrl] = useState('');
    const [crawl, setCrawl] = useState(false);
    const {
        scrapeUrl,
        selectedKb,
        textEditorManager: { isTextEditorOpen, handleClose, openTextEditor },
    } = useContext(KbContext);
    const { uid } = useContext(AuthContext);

    const fileInputRef = useRef(null);
    const backendUrl =
        process.env.NODE_ENV === 'development'
            ? `http://${process.env.REACT_APP_BACKEND_URL}`
            : `https://${process.env.REACT_APP_BACKEND_URL_PROD}`;

    const handleScrapeRequest = async () => {
        const trimmedUrl = url.trim();
        if (!trimmedUrl) return;
        const formattedUrl =
            trimmedUrl.startsWith('http://') ||
            trimmedUrl.startsWith('https://')
                ? trimmedUrl
                : 'https://' + trimmedUrl;
        scrapeUrl(kbId, kbName, formattedUrl, crawl);
        setUrl('');
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('kbName', selectedKb.name);
        formData.append('kbId', selectedKb.id);

        try {
            const response = await fetch(`${backendUrl}/kb/extract`, {
                method: 'POST',
                body: formData,
                headers: {
                    dbName: process.env.REACT_APP_DB_NAME,
                    uid: uid,
                },
            });

            if (!response.ok) throw new Error('Failed to upload file');

            const data = await response.json();
            console.log(data.content);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleExtractFileClick = () => {
        fileInputRef.current.click();
    };

    return (
        <Box
            onClick={(e) => e.stopPropagation()}
            display="flex"
            flexDirection="column"
            width="60%"
        >
            <TextField
                label="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                fullWidth
                margin="normal"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <StyledIconButton
                                disableRipple
                                onClick={handleExtractFileClick}
                            >
                                <AddIcon />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                />
                            </StyledIconButton>
                            <StyledIconButton
                                disabled={!url}
                                disableRipple
                                onClick={handleScrapeRequest}
                            >
                                <SendIcon />
                            </StyledIconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={crawl}
                            onChange={(e) => setCrawl(e.target.checked)}
                            name="crawl"
                        />
                    }
                    label="Crawl Site"
                />
                <Button onClick={openTextEditor}>Open Editor</Button>
            </Box>
            <Modal open={isTextEditorOpen} onClose={handleClose}>
                <Box>
                    <TextEditor onClose={handleClose} />
                </Box>
            </Modal>
        </Box>
    );
};

export default KbUtility;
