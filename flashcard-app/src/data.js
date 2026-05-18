export const folders = [
    {
        id: 'f1',
        name: 'Web Dev',
        cards: [
            {
                id: 1,
                question: "What does HTML stand for?",
                answer: "HyperText Markup Language"
            },
            {
                id: 2,
                question: "What is the correct syntax for referring to an external script called 'xxx.js'?",
                answer: "&lt;script src='xxx.js'&gt;"
            }
        ]
    },
    {
        id: 'f2',
        name: 'JavaScript Basics',
        cards: [
            {
                id: 3,
                question: "How do you write 'Hello World' in an alert box?",
                answer: "alert('Hello World');"
            },
            {
                id: 4,
                question: "How do you create a function in JavaScript?",
                answer: "function myFunction()"
            },            
            {
                id: 5,
                question: "What are the potential risks of using <em>innerHTML</em> without a sanitizer like DOMPurify?",
                answer: "<u>XSS</u>"
            }
        ]
    }
];

const testData = [1, 2, 3]

export const config   = { theme: 'dark' }
