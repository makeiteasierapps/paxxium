import { useContext, useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    CardActions,
} from '@mui/material';
import { Delete, OpenInNew } from '@mui/icons-material/';
import { KbContext } from '../../../contexts/KbContext';
import { StyledIconButton } from '../../chat/chatStyledComponents';
import TextEditor from './textEditor/TextEditor';
import Markdown from 'react-markdown';

const KbDocCard = ({ document }) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const { deleteKbDoc } = useContext(KbContext);

    const matchingContent = useMemo(() => {
        const stripProtocol = (url) =>
            url.replace(/^(https?:\/\/)?(www\.)?/, '');
        const docSource = stripProtocol(document.source);
        const matchingUrl = document.urls.find(
            (url) => stripProtocol(url.source) === docSource
        );
        return matchingUrl ? matchingUrl.content : '';
    }, [document]);
    const handleDelete = () => {
        deleteKbDoc(document.kb_id, document.id);
    };

    const toggleEditor = () => {
        setIsEditorOpen(!isEditorOpen);
    };

    return (
        <Card
            sx={{
                width: '100%',
                height: '500px',
                backgroundColor: '#111111',
            }}
            elevation={6}
        >
            <CardHeader title="Document Source" subheader={document.source} />
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        padding: 2,
                        height: '300px',
                        overflow: 'auto',
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 1,
                    }}
                >
                    <Markdown>{matchingContent}</Markdown>
                </Box>
            </CardContent>
            <CardActions>
                <StyledIconButton onClick={handleDelete}>
                    <Delete />
                </StyledIconButton>
                <StyledIconButton onClick={toggleEditor}>
                    <OpenInNew />
                </StyledIconButton>
            </CardActions>
            {isEditorOpen && (
                <TextEditor
                    open={isEditorOpen}
                    onClose={toggleEditor}
                    doc={document}
                />
            )}
        </Card>
    );
};

export default KbDocCard;
