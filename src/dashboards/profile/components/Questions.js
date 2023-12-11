import { Box, Tab, Tabs, TextField, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { ProfileContext } from "../ProfileContext";

const questions = {
    "Personal Interests": [
        "What are your favorite hobbies or activities?",
        "Are there any specific sports or games you enjoy playing or watching?",
        "Do you have any favorite books, movies, or TV shows?",
        "Are there any particular genres of music or artists you like?",
        "Do you have any favorite travel destinations or places you would like to visit?",
        "Are there any specific topics or subjects that you enjoy learning about?",
        "Do you have any favorite cuisines or types of food?",
        "Are there any social causes or organizations that you are passionate about?",
        "Do you have any favorite hobbies or activities that you enjoy doing with friends or family?",
        "Are there any specific skills or talents that you have developed or are interested in developing?",
    ],
    "Professional Background": [
        "What industry do you work in or have experience in?",
        "What is your current job role or profession?",
        "Are you satisfied with your current job or are you looking for new opportunities?",
        "Can you tell me about any specific skills or expertise you have developed in your professional career?",
        "Have you worked in any notable companies or organizations?",
        "Are there any specific certifications or qualifications you have obtained?",
        "Do you have any professional goals or aspirations?",
        "Are there any particular areas within your industry that you are interested in or passionate about?",
        "Have you attended any industry conferences, workshops, or training programs?",
        "Are there any professional communities or networks that you are a part of?",
        "Have you published any articles, papers, or contributed to any industry publications?",
    ],
    "Learning Goals": [
        "What are your current learning goals or objectives?",
        "Are there any specific skills or knowledge areas you want to develop?",
        "Do you have any career-related learning goals?",
        "Are there any specific subjects or topics you are interested in learning more about?",
        "Are you looking to acquire any certifications or qualifications?",
        "Do you prefer self-paced learning or structured courses?",
        "Are there any specific learning platforms or resources you prefer?",
        "Are you interested in learning through online courses, books, videos, or other mediums?",
        "Do you have any preferred learning methods or strategies?",
        "Are there any specific learning challenges or obstacles you are facing?",
    ],
    "Learning Style": [
        "How do you prefer to learn new information or skills?",
        "Do you prefer visual learning through videos, diagrams, or infographics?",
        "Are you more inclined towards reading and learning through written materials like articles or books?",
        "Do you enjoy hands-on learning experiences or interactive exercises?",
        "Are you comfortable with audio-based learning, such as podcasts or audiobooks?",
        "Do you prefer learning in a group setting or individually?",
        "Are you more motivated by structured learning programs or self-directed learning?",
        "Do you prefer learning through online platforms, in-person classes, or a combination of both?",
        "Are you open to experimenting with different learning methods or do you prefer sticking to a specific approach?",
        "Are there any specific tools or technologies that you find helpful for learning?",
    ],
    "Tech and Gadgets": [
        "Are you interested in technology and gadgets?",
        "What are some of your favorite devices or gadgets that you currently use?",
        "Do you have any preferred operating systems or software applications?",
        "Are there any specific emerging technologies or trends that you find intriguing?",
        "How do you stay updated with the latest tech news and developments?",
        "Have you ever tried experimenting with coding or programming?",
        "Are there any specific tech-related hobbies or projects that you enjoy working on?",
        "Do you have any favorite tech influencers or experts that you follow?",
        "Are there any particular areas within technology that you are passionate about or want to learn more about?",
        "Are you open to exploring new technologies and gadgets, or do you prefer sticking to what you are familiar with?",
    ],
};
// Styled Components
const MainPaper = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginTop: theme.spacing(2),
}));
const StyledTabs = styled(Tabs)(({ theme }) => ({
    "& .MuiTabs-indicator": {
        display: "none",
    },
}));
const Question = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));
const Answer = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: theme.palette.secondary.dark,
        },
        "&.Mui-focused fieldset": {
            borderColor: theme.palette.secondary.light,
        },
        "&:hover fieldset": {
            borderColor: theme.palette.secondary.light,
        },
        "&.Mui-disabled fieldset": {
            borderColor: theme.palette.secondary.dark,
        },
    },
    "& label.Mui-focused": {
        color: theme.palette.secondary.light,
    },
}));

const Questions = () => {
    const { answers, handleAnswerChange } = useContext(ProfileContext);
    const [currentTab, setCurrentTab] = useState(0);

    return (
        <>
            <StyledTabs
                id="question-category-tabs"
                value={currentTab}
                onChange={(_, newValue) => setCurrentTab(newValue)}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                textColor="secondary"
            >
                {Object.keys(questions).map((category, index) => (
                    <Tab key={index} label={category} textColor="secondary" />
                ))}
            </StyledTabs>
            <MainPaper id="questions-container">
                {Object.entries(questions).map(
                    ([category, categoryQuestions], index) => (
                        <Box hidden={currentTab !== index} key={index}>
                            {categoryQuestions.map(
                                (question, questionIndex) => (
                                    <Box key={questionIndex}>
                                        <Question variant="body1">{`${question}`}</Question>
                                        <Answer
                                            fullWidth
                                            label="Answer"
                                            variant="outlined"
                                            value={
                                                answers[category]?.[question] ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleAnswerChange(
                                                    category,
                                                    question,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Box>
                                )
                            )}
                        </Box>
                    )
                )}
            </MainPaper>
        </>
    );
};

export default Questions;
