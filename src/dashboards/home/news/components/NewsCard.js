import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Tooltip, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { AuthContext, backendUrl } from "../../../../auth/AuthContext";
import { NewsContext } from "../NewsContext";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import {
    StyledCard,
    StyledCardMedia,
    StyledCardContent,
    StyledIconButton,
} from "../styledNewsComponents";

const NewsCard = ({ news, index }) => {
    const { markNewsAsRead, deleteNewsArticle, setSlideIndex } =
        useContext(NewsContext);
    const { idToken } = useContext(AuthContext);
    const [openDialog, setOpenDialog] = useState(false);

    const markArticleRead = async () => {
        try {
            const response = await fetch(`${backendUrl}/news_articles`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: idToken,
                },
                body: JSON.stringify({ articleId: news.id }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            markNewsAsRead(news.id);
        } catch (error) {
            console.error(error);
        }
    };

    const handleArticleDelete = async () => {
        try {
            const response = await fetch(`${backendUrl}/news_articles`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: idToken,
                },
                body: JSON.stringify({ articleId: news.id }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            deleteNewsArticle(news.id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            style={{ height: "100%" }}
        >
            <StyledCard key={news.id} onClick={() => setSlideIndex(index)}>
                <StyledCardMedia image={news.image}>
                    <Tooltip title="Mark read" placement="top-end">
                        <StyledIconButton
                            style={{ right: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!news.is_read) {
                                    markArticleRead();
                                }
                            }}
                        >
                            {news.is_read ? (
                                <CheckBoxIcon />
                            ) : (
                                <CheckBoxOutlineBlankIcon />
                            )}
                        </StyledIconButton>
                    </Tooltip>
                    <Tooltip title="Trash" placement="top-start">
                        <StyledIconButton
                            style={{ left: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenDialog(true);
                            }}
                        >
                            <DeleteIcon />
                        </StyledIconButton>
                    </Tooltip>
                </StyledCardMedia>
                <StyledCardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        {news.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {news.summary}
                    </Typography>
                    <Button variant="outlined" href={news.url}>
                        Read More
                    </Button>
                </StyledCardContent>
            </StyledCard>
            <DeleteConfirmationDialog
                open={openDialog}
                handleClose={() => setOpenDialog(false)}
                handleConfirm={() => {
                    setOpenDialog(false);
                    handleArticleDelete();
                }}
            />
        </motion.div>
    );
};

export default NewsCard;
