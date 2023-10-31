import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
} from '@mui/material';
import { motion } from 'framer-motion';

const NewsCard = ({ news, index, setSlideIndex }) => {

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
                <CardMedia sx={{ height: 200 }} image={news.image} />
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
