import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

function Clouds() {
    const ref = useRef();

    useEffect(() => {
        const data = [
            {
                category: 'Tech and Gadgets',
                questionsAnswered: Math.random() * 50,
            },
            {
                category: 'Accessibility Needs',
                questionsAnswered: Math.random() * 50,
            },
            {
                category: 'Time Availability',
                questionsAnswered: Math.random() * 50,
            },
            {
                category: 'Skill Level Assessment',
                questionsAnswered: Math.random() * 50,
            },
            {
                category: 'Learning Style',
                questionsAnswered: Math.random() * 50,
            },
            {
                category: 'Learning Goals',
                questionsAnswered: Math.random() * 50,
            },
            {
                category: 'Professional Background',
                questionsAnswered: Math.random() * 50,
            },
            {
                category: 'Personal Interests',
                questionsAnswered: Math.random() * 50,
            },
        ];
        // Create a new cloud layout with the specified settings
        const layout = cloud()
            .size([1000, 500]) // Set the size of the cloud to be 500x500 pixels
            .words(
                data.map((d) => ({
                    text: d.category,
                    size: d.questionsAnswered,
                }))
            ) // Map the data to words, where each word's text is the category and size is the number of questions answered
            .padding(5) // Set the padding around each word to be 5 pixels
            .rotate(() => ~~(Math.random() * 2) * 90) // Randomly rotate each word by either 0 or 90 degrees
            .font('Impact') // Set the font of the words to be "Impact"
            .fontSize((d) => d.size) // Set the font size of each word to be its size property
            .on('end', draw); // Specify a callback function to be called when the layout generation is finished

        // Start generating the cloud layout
        layout.start();

        // Define the callback function to draw the words on the SVG
        function draw(words) {
            // Remove the existing SVG if it exists
            d3.select(ref.current).select('svg').remove();

            // Append a new SVG element
            const svg = d3
                .select(ref.current)
                .append('svg')
                .attr('width', layout.size()[0]) // Set the width of the SVG to be the width of the cloud
                .attr('height', layout.size()[1]); // Set the height of the SVG to be the height of the cloud

            svg.append('g') // Append a group element to the SVG
                .attr(
                    'transform',
                    'translate(' +
                        layout.size()[0] / 2 +
                        ',' +
                        layout.size()[1] / 2 +
                        ')'
                ) // Center the group element in the SVG
                .selectAll('text') // Select all text elements in the group
                .data(words) // Bind the words data to the text elements
                .enter()
                .append('a') // Create a new a element for each word
                .on('click', function (d, i) {
                    // Add an onClick event to each a element
                    console.log('Clicked on word: ', d.text);
                })
                .append('text') // Create a new text element for each word
                .style('font-size', (d) => d.size + 'px') // Set the font size of each text element to be its word's size
                .style('font-family', 'Impact') // Set the font family of each text element to be "Impact"
                .attr('text-anchor', 'middle') // Center the text in its bounding box
                .attr(
                    'transform',
                    (d) =>
                        'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
                ) // Position and rotate each text element according to its word's properties
                .text((d) => d.text)
                .on('mouseover', function () {
                    d3.select(this).style('cursor', 'pointer'); // Change cursor to pointer on mouseover
                    d3.select(this).style('fill', 'red'); // Change color to red on mouseover
                })
                .on('mouseout', function () {
                    d3.select(this).style('fill', 'black'); // Change color back to black on mouseout
                }); // Set the text content of each text element to be its word's text
        }
    }, []);

    return <div ref={ref} />;
}

export default Clouds;
