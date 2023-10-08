import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import {
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    TextField,
} from '@mui/material';
import { styled } from '@mui/system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const questions = {
    'Personal Interests': [
        'What are your favorite hobbies or activities?',
        'Are there any specific sports or games you enjoy playing or watching?',
        'Do you have any favorite books, movies, or TV shows?',
        'Are there any particular genres of music or artists you like?',
        'Do you have any favorite travel destinations or places you would like to visit?',
        'Are there any specific topics or subjects that you enjoy learning about?',
        'Do you have any favorite cuisines or types of food?',
        'Are there any social causes or organizations that you are passionate about?',
        'Do you have any favorite hobbies or activities that you enjoy doing with friends or family?',
        'Are there any specific skills or talents that you have developed or are interested in developing?',
    ],
    'Professional Background': [
        'What industry do you work in or have experience in?',
        'What is your current job role or profession?',
        'Are you satisfied with your current job or are you looking for new opportunities?',
        'Can you tell me about any specific skills or expertise you have developed in your professional career?',
        'Have you worked in any notable companies or organizations?',
        'Are there any specific certifications or qualifications you have obtained?',
        'Do you have any professional goals or aspirations?',
        'Are there any particular areas within your industry that you are interested in or passionate about?',
        'Have you attended any industry conferences, workshops, or training programs?',
        'Are there any professional communities or networks that you are a part of?',
        'Have you published any articles, papers, or contributed to any industry publications?',
    ],
    'Learning Goals': [
        'What are your current learning goals or objectives?',
        'Are there any specific skills or knowledge areas you want to develop?',
        'Do you have any career-related learning goals?',
        'Are there any specific subjects or topics you are interested in learning more about?',
        'Are you looking to acquire any certifications or qualifications?',
        'Do you prefer self-paced learning or structured courses?',
        'Are there any specific learning platforms or resources you prefer?',
        'Are you interested in learning through online courses, books, videos, or other mediums?',
        'Do you have any preferred learning methods or strategies?',
        'Are there any specific learning challenges or obstacles you are facing?',
    ],
    'Learning Style': [
        'How do you prefer to learn new information or skills?',
        'Do you prefer visual learning through videos, diagrams, or infographics?',
        'Are you more inclined towards reading and learning through written materials like articles or books?',
        'Do you enjoy hands-on learning experiences or interactive exercises?',
        'Are you comfortable with audio-based learning, such as podcasts or audiobooks?',
        'Do you prefer learning in a group setting or individually?',
        'Are you more motivated by structured learning programs or self-directed learning?',
        'Do you prefer learning through online platforms, in-person classes, or a combination of both?',
        'Are you open to experimenting with different learning methods or do you prefer sticking to a specific approach?',
        'Are there any specific tools or technologies that you find helpful for learning?',
    ],
    'Skill Level Assessment': [
        'How would you rate your current skill level in [specific domain] on a scale of 1 to 10?',
        'Have you had any prior experience or training in [specific domain]?',
        'Are you a beginner, intermediate, or advanced learner in [specific domain]?',
        'Have you completed any courses or certifications related to [specific domain]?',
        'Can you provide examples of projects or tasks you have completed in [specific domain]?',
        'Are there any specific areas within [specific domain] where you feel more confident or knowledgeable?',
        'Have you worked professionally or in a personal capacity with [specific domain]?',
        'Are there any specific challenges or areas of improvement you are currently facing in [specific domain]?',
        'Are you comfortable with the foundational concepts and principles of [specific domain]?',
        'Are you interested in expanding your skills and knowledge in [specific domain]?',
    ],
    'Time Availability': [
        'How much time do you have available for learning on a weekly basis?',
        'Are you looking for learning resources that can be completed in short, bite-sized sessions?',
        'Do you prefer longer, in-depth learning materials that require a significant time commitment?',
        'Are you able to dedicate specific time slots for learning, or do you prefer flexible learning options?',
        'Are there any specific time constraints or commitments that may affect your learning schedule?',
        'Are you open to learning resources that can be accessed and completed at your own pace?',
        'Do you prefer learning resources that provide a structured timeline or schedule?',
        'Are you interested in learning resources that offer quick tips or hacks for time-efficient learning?',
        'Are you comfortable with asynchronous learning, where you can access materials at any time?',
        'Are you open to exploring micro-learning options, such as short tutorials or mini-courses?',
    ],
    'Accessibility Needs': [
        'Do you have any specific accessibility needs or preferences when it comes to learning materials?',
        'Are there any visual impairments that require accommodations, such as high contrast themes or screen reader compatibility?',
        'Do you prefer learning resources that offer text-to-speech functionality for audio support?',
        'Are there any specific mobility challenges that require keyboard navigation or alternative input methods?',
        'Are you sensitive to certain colors or visual stimuli that may affect your learning experience?',
        'Do you require closed captions or transcripts for video-based learning materials?',
        'Are there any specific assistive technologies or tools that you find helpful for learning?',
        'Are you comfortable with online learning platforms that offer accessibility features?',
        'Are there any specific accessibility guidelines or standards that you prefer learning resources to adhere to?',
        'Are there any other accessibility considerations or accommodations that would enhance your learning experience?',
    ],
    'Tech and Gadgets': [
        'Are you interested in technology and gadgets?',
        'What are some of your favorite devices or gadgets that you currently use?',
        'Do you have any preferred operating systems or software applications?',
        'Are there any specific emerging technologies or trends that you find intriguing?',
        'How do you stay updated with the latest tech news and developments?',
        'Have you ever tried experimenting with coding or programming?',
        'Are there any specific tech-related hobbies or projects that you enjoy working on?',
        'Do you have any favorite tech influencers or experts that you follow?',
        'Are there any particular areas within technology that you are passionate about or want to learn more about?',
        'Are you open to exploring new technologies and gadgets, or do you prefer sticking to what you are familiar with?',
    ],
};

const MainPaper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));
const AccordionWrapper = styled(Accordion)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: '10px',
    border: `1px solid ${theme.palette.secondary.dark}`,
}));

const AccordionSummaryWrapper = styled(AccordionSummary)(({ theme }) => ({
    
}));

const AccordionDetailsWrapper = styled(AccordionDetails)`
    /* Add your custom styles here */
`;

const CategoryText = styled(Typography)(({ theme }) => ({
    color: theme.palette.secondary.dark,
    fontSize: '1.8rem',
}));

const QuestionText = styled(Typography)(({ theme }) => ({}));

const TextFieldWrapper = styled(TextField)`
    /* Add your custom styles here */
`;

const Questions = () => {
    const { idToken } = useContext(AuthContext);
    const [answers, setAnswers] = useState({});

    // Load answers from backend
    useEffect(() => {
        const getAnswers = async () => {
            try {
                const response = await fetch(`${backendUrl}/profile/get-questions`, {
                    method: 'GET',
                    headers: {
                        Authorization: idToken,
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                setAnswers(data.answers);
            } catch (error) {
                console.log(error);
            }
        };
        getAnswers();
    }, [idToken]);

    const handleAnswerChange = (category, question, answer) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [category]: {
                ...(prevAnswers[category] || {}),
                [question]: answer,
            },
        }));
    };

    const handleFormSubmit = async () => {
        try {
            const response = await fetch(`${backendUrl}/profile/update-questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
                credentials: 'include',
                body: JSON.stringify({ answers }),
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <MainPaper>
                {Object.entries(questions).map(
                    ([category, categoryQuestions], index) => (
                        <AccordionWrapper key={index} disableGutters={true}>
                            <AccordionSummaryWrapper
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <CategoryText>{category}</CategoryText>
                            </AccordionSummaryWrapper>
                            <AccordionDetailsWrapper>
                                <Box>
                                    {categoryQuestions.map(
                                        (question, questionIndex) => (
                                            <AccordionWrapper
                                                key={questionIndex}
                                                disableGutters={true}
                                            >
                                                <AccordionSummaryWrapper
                                                    expandIcon={
                                                        <ExpandMoreIcon />
                                                    }
                                                    aria-controls={`panel-${index}-${questionIndex}-content`}
                                                    id={`panel-${index}-${questionIndex}-header`}
                                                >
                                                    <QuestionText variant="body1">
                                                        {`${question}`}
                                                    </QuestionText>
                                                </AccordionSummaryWrapper>
                                                <AccordionDetailsWrapper>
                                                    <TextFieldWrapper
                                                        fullWidth
                                                        label="Answer"
                                                        variant="outlined"
                                                        value={
                                                            answers[category]?.[
                                                                question
                                                            ] || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleAnswerChange(
                                                                category,
                                                                question,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </AccordionDetailsWrapper>
                                            </AccordionWrapper>
                                        )
                                    )}
                                </Box>
                            </AccordionDetailsWrapper>
                        </AccordionWrapper>
                    )
                )}
            <Box>
                <Button variant="contained" onClick={handleFormSubmit} sx={{margin: 3}}>
                    Update
                </Button>
            </Box>
        </MainPaper>
    );
};

export default Questions;
