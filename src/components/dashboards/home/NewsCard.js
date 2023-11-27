import { useState, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
    IconButton,
    Tooltip,
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const NewsCard = ({ news, index, setSlideIndex }) => {
    const [isRead, setIsRead] = useState(news.is_read);
    const { idToken } = useContext(AuthContext);

    const markArticleRead = async () => {
        try {
            const response = await fetch(`${backendUrl}/news_articles`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
                body: JSON.stringify({ articleId: news.id }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            setIsRead(true);
            //TODO: display success message to user
            console.log(data.response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            height={'100vh'}
        >
            <Card
                key={news.id}
                sx={{
                    height: 600,
                    width: 400,
                    overflow: 'scroll',
                    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
                }}
                onClick={() => setSlideIndex(index)}
            >
                <CardMedia
                    sx={{ height: 200, position: 'relative' }}
                    image={news.image}
                >
                    <Tooltip title="Mark read" placement="top-end">
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                opacity: 0.3,
                                '&:hover': { opacity: 1 },
                            }}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering Card's onClick
                                if (!isRead) {
                                    markArticleRead();
                                }
                            }}
                        >
                            {isRead ? (
                                <CheckBoxIcon />
                            ) : (
                                <CheckBoxOutlineBlankIcon />
                            )}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Trash" placement="top-start">
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                opacity: 0.3,
                                '&:hover': { opacity: 1 },
                            }}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering Card's onClick
                                // Fetch request to delete
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </CardMedia>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        {news.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {news.summary}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button variant="outlined" href={news.url}>
                        Read More
                    </Button>
                </CardActions>
            </Card>
        </motion.div>
    );
};

export default NewsCard;
